import express from 'express'
const router = express.Router()
import {registerUser} from '../controller/userController'

router.post('/registerUser', registerUser)

export = router