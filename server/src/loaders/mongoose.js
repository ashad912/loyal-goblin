import mongoose from 'mongoose';

export default async () => {
    mongoose.Promise = global.Promise;

    let options = {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
    }

    options = process.env.REPLICA === "true" ? {...options, replicaSet: process.env.REPLICA_NAME} : options

    mongoose.connect(process.env.MONGODB_URL, options);

    const connection = await mongoose.connect(process.env.MONGODB_URL, options);
    return connection.connection.db;
};