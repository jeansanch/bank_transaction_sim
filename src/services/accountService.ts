import { Account } from '../models/Account';

export class AccountService {
    private accounts: Account[] = [];

    createAccount(balance: number): Account {
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

    transfer(fromId: number, toId: number, amount: number): void {
        const fromAccount = this.getAccount(fromId);
        const toAccount = this.getAccount(toId);
        if (fromAccount.balance >= amount) {
            fromAccount.balance -= amount;
            toAccount.balance += amount;
        } else {
            throw new Error('Insufficient balance');
        }
    }

}