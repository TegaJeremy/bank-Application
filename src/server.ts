import express, {Application,Request,Response} from "express"
const app:Application = express()
const PORT =7672
app.use(express.json())
 import {mongoUrl} from './config/config'
 import router from './routers/userRouter'
 import transactionRouter from './routers/transactionRouter'

 app.use(router)
 app.use(transactionRouter)



app.get("/", (req:Request, res:Response)=>{
     res.send('welcom to my project')
})


app.listen(PORT, ()=>{
    console.log(`connected to port ${PORT}`)
})
console.log('MongoDB Connection URL:', mongoUrl);
