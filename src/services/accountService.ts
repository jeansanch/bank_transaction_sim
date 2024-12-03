import { Account } from '../models/Account';

export class AccountService {
    private accounts: Account[] = [];
    private locks: { [key: number]: boolean } = {};

    private acquireLock(id: number): Promise<void> {
        return new Promise((resolve) => {
            const tryAcquire = () => {
                if (!this.locks[id]) {
                    this.locks[id] = true;
                    resolve();
                } else {
                    setTimeout(tryAcquire, 10);
                }
            };
            tryAcquire();
        });
    }

    private releaseLock(id: number): void {
        delete this.locks[id];
    }

    async createAccount(balance: number): Promise<Account> {
        if (balance < 0 || isNaN(balance)) {
            throw new Error('Invalid balance. Balance must be a non-negative number.');
        }
        const account: Account = {
            id: this.accounts.length + 1,
            balance
        };
        this.accounts.push(account);
        return account;
    }


    async getAccount(id: number): Promise<Account> {
        return this.accounts.find((account) => account.id === id);
    }

    async deposit(id: number, amount: number): Promise<Account> {
        await this.acquireLock(id);
        try {
            const account = await this.getAccount(id);
            account.balance += amount;
            return account;
        } finally {
            this.releaseLock(id);
        }
    }

    async withdraw(id: number, amount: number): Promise<Account> {
        await this.acquireLock(id);
        try {
            const account = await this.getAccount(id);
            account.balance -= amount;
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
            } else {
                throw new Error('Insufficient balance');
            }
        } finally {
            this.releaseLock(fromId);
            this.releaseLock(toId);
        }
    }

}