import * as dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'

const username = process.env.USER_USERNAME
const password = process.env.USER_PASSWORD

 const mongoUrl = `mongodb+srv://${username}:${password}@cluster0.ly0chej.mongodb.net`

mongoose.connect(mongoUrl).then(()=>{
    console.log('connected to database successfully')
}).catch((error)=>{
    console.log(error.message)
})

 export{
    mongoUrl
 }