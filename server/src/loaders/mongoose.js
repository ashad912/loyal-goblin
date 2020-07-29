import mongoose from 'mongoose';
import keys from '@config/keys'

export default async () => {
    mongoose.Promise = global.Promise;

    let options = {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
    }

    options = keys.replica ? {...options, replicaSet: keys.replicaName} : options


    const connection = await mongoose.connect(keys.mongoURL, options);
    return connection.connection.db;
};