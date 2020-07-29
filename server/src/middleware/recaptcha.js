import axios from 'axios'
import bcrypt from 'bcryptjs'
import keys from '@config/keys'
import { getEndpointError } from '@utils/functions';
import { WARN } from '@utils/constants';

export const recaptcha = async (req, res, next) => {

    // Test pass
    if (keys.nodeEnv === "test") {
        return next()
    }

    //// Postman backdoor
    if (keys.nodeEnv === 'dev' && req.body.registerKey) {
        const isMatch = await bcrypt.compare(
            req.body.registerKey,
            keys.registerKey
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
    try {
        if (!token) {
            throw getEndpointError(WARN, 'No recaptcha token provided', req.user && req.user._id)
        }

        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${keys.secretRecaptcha}&response=${token}`;

        const res = await axios.post(url)
        if (!res.data.success) {
            throw getEndpointError(WARN, 'Recaptcha rejection', req.user && req.user._id)
        }
        next()
    } catch (e) {
        next(e)
    }
}