import express from 'express'
import {userRouter} from './routes/user'
import {eventRouter} from './routes/event'
import {itemRouter} from './routes/item'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import path from 'path'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import socket from 'socket.io'

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

const server = app.listen(port, ()=>{
    console.log(`Listening at ${port}`)
})

//cant refactor socket methods to separate file :<< but it worked on another computer, maybe clean and rebuild?

var io = socket(server) //param is a server, defined upper

const mission = io.of('/mission')

mission.on('connection', (socket) => { 
    console.log('New client connected', socket.id)

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId, () => {
            console.log(socket.id, "joined the room", roomId)
            io.of('mission').to(roomId).emit('joinRoom', roomId)
        })
    })

    socket.on('addItem', (data) => {
        io.of('mission').to(data.roomId).emit('addItem', data.item)
    })

    socket.on('deleteItem', (data) => {
        io.of('mission').to(data.roomId).emit('deleteItem', data.id)
    })

    socket.on('registerUser', (data) => {
        io.of('mission').to(data.roomId).emit('registerUser', data.user)
    })

    socket.on('unregisterUser', (data) => {
        io.of('mission').to(data.roomId).emit('unregisterUser', data.id)
    })

    socket.on('modifyUserStatus', (data) => {
        io.of('mission').to(data.roomId).emit('modifyUserStatus', data.user)
    })


    socket.on("disconnect", () => console.log("Client disconnected", socket.id));
})

//api -> create event instance
//-> promise -> authMiddleware + authEventMiddleware -> load component with id of instance (!!!) -> socket emit connection
//==io.use -> query being in party by token->user->party //additional eventToken
//-> joining room refs by instance id