import mongoose from 'mongoose'

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}

//mongo connection in setup file is not preferred due to integration tests application

export const connect = () => mongoose.connect('mongodb://localhost:27017/loyalgoblin-test', options)

export const disconnect = () => mongoose.connection.close()