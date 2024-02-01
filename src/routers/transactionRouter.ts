import express from 'express'
const router = express.Router()
import {deposit,Transfer, withdraw,getTransactionHistory} from '../controller/transationController'

router.post('/deposit', deposit);
router.post('/transfer', Transfer);
router.get('/withdraw', withdraw);
router.get('/Transactions/:accountNumber', getTransactionHistory);



export = router