import jwt from 'jsonwebtoken'
import { User } from '../models/user'

export const auth = async (req, res, next) => {
    //console.log('auth middleware')
    try{
        const token = req.cookies.token || req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token}) //finding proper user with proper token
        if(!user) {
            throw new Error()
        }


        req.token = token //specified token - u can logout from specific device!
        req.user = user
        next()
        //console.log(token)
    }catch(e) {
        console.log(e)
        res.status(401).send({ error: 'Please authenticate.'})
    }
}
