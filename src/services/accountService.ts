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

    async createAccount(balance: number): Promise<Account> {
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
    }


    async getAccount(id: number): Promise<Account> {
        const account = this.accounts.find((account) => account.id === id);
        if (!account) {
            log.error(`Account with id ${id} not found`);
            throw new Error('Account not found');
        }
        return account;
    }

    async deposit(id: number, amount: number): Promise<Account> {
        await this.acquireLock(id);
        try {
            const account = await this.getAccount(id);
            account.balance += amount;
            log.info(`Deposited ${amount} to account ${id}`);
            return account;
        } finally {
            this.releaseLock(id);
        }
    }

    async withdraw(id: number, amount: number): Promise<Account> {
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
    }

    async transfer(fromId: number, toId: number, amount: number): Promise<void> {
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
    }

}