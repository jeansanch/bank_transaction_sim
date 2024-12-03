import { Router } from 'express';
import { createAccount, getAccount, deposit, withdraw, transfer } from '../controllers/accountController';

const router = Router();

router.post('/', createAccount);
router.get('/:id', getAccount);
router.post('/:id/deposit', deposit);
router.post('/:id/withdraw', withdraw);
router.post('/transfer', transfer);

export default router;