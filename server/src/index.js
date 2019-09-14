import express from 'express'
import {userRouter} from './routes/user'
import {eventRouter} from './routes/event'
import {itemRouter} from './routes/item'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import path from 'path'
import cors from 'cors'
import cookieParser from 'cookie-parser'

//TO-START: npm run-script dev

mongoose.Promise = global.Promise

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false})

export const app = express()
const port = process.env.PORT || 4000;


app.use(cors());
app.use(express.static(path.join(__dirname, '../client/build')));

app.use(bodyParser.json())
app.use(cookieParser())


app.use('/user', userRouter)
app.use('/event', eventRouter)
app.use('/item', itemRouter)


app.use((err, req, res, next)=>{ 
    res.status(422).send({error: err.message}) 
})

app.listen(port, ()=>{
    console.log(`Listening at ${port}`)
})