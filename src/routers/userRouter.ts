import express from 'express'
const router = express.Router()
import {registerUser,verifyEmail,resendVerification} from '../controller/userController'

router.post('/registerUser', registerUser)
router.post('/verifyUser/:token', verifyEmail)
router.post('/resend-verification', resendVerification)

export = router