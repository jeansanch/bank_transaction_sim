import { Account } from '../models/Account';
import log from '../utils/logger';

export class AccountService {
    private accounts: Account[] = [];
    private locks: { [key: number]: boolean } = {};

    private acquireLock(id: number): Promise<void> {
        return new Promise((resolve) => {
            const tryAcquire = () => {
                log.debug(`Trying to acquire lock for account ${id}`);
                if (!this.locks[id]) {
                    this.locks[id] = true;
                    resolve();
                } else {
                    setTimeout(tryAcquire, 10);
                }
            };
            tryAcquire();
            log.debug(`Acquired lock for account ${id}`);
        });
    }

    private releaseLock(id: number): void {
        delete this.locks[id];
        log.debug(`Released lock for account ${id}`);
    }

    private async retryOperation<T>(operation: () => Promise<T>, retries: number, delay: number): Promise<T> {
        for (let i = 0; i < retries; i++) {
            try {
                return await operation();
            } catch (error) {
                log.error(`Operation failed. Attempt ${i + 1} of ${retries}. Error: ${error.message}`);
                if (i < retries - 1) {
                    await new Promise((resolve) => setTimeout(resolve, delay));
                } else {
                    throw error;
                }
            }
        }
    }

    private async withTimeout<T>(operation: () => Promise<T>, timeout: number): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const timer = setTimeout(() => {
                
                reject(new Error('Operation timed out'));
            }, timeout);

            operation()
                .then((result) => {
                    clearTimeout(timer);
                    resolve(result);
                })
                .catch((error) => {
                    clearTimeout(timer);
                    reject(error);
                });
        });
    }

    async createAccount(balance: number): Promise<Account> {
        return this.withTimeout(async () => {
            if (balance < 0 || isNaN(balance)) {
                log.error('Invalid balance. Balance must be a non-negative number.');
                throw new Error('Invalid balance. Balance must be a non-negative number.');
            }
            const account: Account = {
                id: this.accounts.length + 1,
                balance
            };
            this.accounts.push(account);
            log.info(`Created account with id ${account.id}`);
            return account;
        }, 5000);
    }


    async getAccount(id: number): Promise<Account> {
        return this.withTimeout(async () => {
            const account = this.accounts.find((account) => account.id === id);
            if (!account) {
                log.error(`Account with id ${id} not found`);
                throw new Error('Account not found');
            }
            return account;
        }, 5000);
    }

    async deposit(id: number, amount: number): Promise<Account> {
        return this.retryOperation(async () => {
            await this.acquireLock(id);
            try {
                const account = await this.getAccount(id);
                account.balance += amount;
                log.info(`Deposited ${amount} to account ${id}`);
                return account;
            } finally {
                this.releaseLock(id);
            }
        }, 3, 1000);
    }

    async withdraw(id: number, amount: number): Promise<Account> {
        return this.retryOperation(async () => {
            await this.acquireLock(id);
            try {
                const account = await this.getAccount(id);
                if (account.balance < amount) {
                    log.error('Insufficient balance');
                    throw new Error('Insufficient balance');
                }
                account.balance -= amount;
                log.info(`Withdrew ${amount} from account ${id}`);
                return account;
            } finally {
                this.releaseLock(id);
            }
        }, 3, 1000);
    }

    async transfer(fromId: number, toId: number, amount: number): Promise<void> {
        return this.retryOperation(async () => {
            await this.acquireLock(fromId);
            await this.acquireLock(toId);
            try {
                const fromAccount = await this.getAccount(fromId);
                const toAccount = await this.getAccount(toId);
                if (fromAccount.balance >= amount) {
                    fromAccount.balance -= amount;
                    toAccount.balance += amount;
                    log.info(`Transferred ${amount} from account ${fromId} to account ${toId}`);
                } else {
                    log.error('Insufficient balance');
                    throw new Error('Insufficient balance');
                }
            } finally {
                this.releaseLock(fromId);
                this.releaseLock(toId);
            }
        }, 3, 1000);
    }
}