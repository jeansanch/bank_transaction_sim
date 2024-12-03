import { Request, Response } from 'express';
import { AccountService } from '../services/accountService';

const accountService = new AccountService();

export const createAccount = async (req: Request, res: Response) => {
    const { balance } = req.body;
    try {
        const account = await accountService.createAccount(balance);
        res.status(201).json(account);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAccount = async (req: Request, res: Response) => {
    const { id } = req.params;
    const account = await accountService.getAccount(Number(id));
    if (account) {
        res.status(200).json({
            message: `You have ${account.balance} in your account.`,
            account
        });
    } else {
        res.status(404).json({ message: 'Account not found' });
    }
};

export const deposit = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { amount } = req.body;
    try {
        const account = await accountService.deposit(Number(id), amount);
        res.status(200).json(account);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const withdraw = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { amount } = req.body;
    try {
        const account = await accountService.withdraw(Number(id), amount);
        res.status(200).json(account);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const transfer = async (req: Request, res: Response) => {
    const { fromId, toId, amount } = req.body;
    if (fromId === toId) {
        res.status(400).json({ message: 'Cannot transfer money between the same account' });
    }
    try {
        const fromAccount = await accountService.getAccount(fromId);
        const toAccount = await accountService.getAccount(toId);
        if (!fromAccount || !toAccount) {
            res.status(404).json({ message: 'One or both accounts not found' });
        }
        await accountService.transfer(fromId, toId, amount);
        res.status(200).json({ message: 'Transfer successful' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};