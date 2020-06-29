import axios from 'axios'
import bcrypt from 'bcryptjs'
import { getEndpointError } from '@utils/functions';
import { WARN } from '@utils/constants';

export const recaptcha = async (req, res, next) => {

    // Test pass
    if(process.env.NODE_ENV === "test"){
        return next()
    }

    //// Postman backdoor
    if (process.env.NODE_ENV === "dev" && req.body.registerKey) {
        const isMatch = await bcrypt.compare(
            req.body.registerKey,
            process.env.REGISTER_KEY
        );

        if (!isMatch) {
            const e = getEndpointError(WARN, 'Please authenticate', req.user && req.user._id)
            e.status = 401
            return next(e)
        }
        return next()
    }
    ////

    const token = req.body.recaptcha

    if (!token) {
        throw getEndpointError(WARN, 'No recaptcha token provided', req.user && req.user._id)
    }

    const secretKey = process.env.SECRET_RECAPTCHA_KEY;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    try {
        const res = await axios.post(url)
        if (!res.data.success) {
            throw getEndpointError(WARN, 'Recaptcha rejection', req.user && req.user._id)
        }
        next()
    } catch (e) {
        e.status = 401
        next(e)
    }
}