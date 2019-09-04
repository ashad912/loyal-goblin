import express from 'express'
import {router} from './routes/routes'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import path from 'path'
import cors from 'cors'
import cookieParser from 'cookie-parser'

mongoose.Promise = global.Promise

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false})

export const app = express()
const port = process.env.PORT || 4000;


app.use(cors());
app.use(express.static(path.join(__dirname, '../client/build')));

app.use(bodyParser.json()) //going to have access to json mssg
app.use(cookieParser())


app.use(router) //export required to use routes from api.js


app.use((err, req, res, next)=>{ 
    res.status(422).send({error: err.message}) 
})

app.listen(port, ()=>{
    console.log(`Listening at ${port}`)
})