import { Account } from '../models/Account';

export class AccountService {
    private accounts: Account[] = [];

    createAccount(balance: number): Account {
        const account: Account = {
            id: this.accounts.length + 1,
            balance
        };
        this.accounts.push(account);
        return account;
    }

    getAccount(id: number): Account {
        return this.accounts.find((account) => account.id === id);
    }

    deposit(id: number, amount: number): Account {
        const account = this.getAccount(id);
        account.balance += amount;
        return account;
    }

    withdraw(id: number, amount: number): Account {
        const account = this.getAccount(id);
        account.balance -= amount;
        return account;
    }
}