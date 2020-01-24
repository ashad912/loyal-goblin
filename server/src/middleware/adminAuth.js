import jwt from 'jsonwebtoken'
import { Admin } from '../models/admin'


export const adminAuth = async (req, res, next) => {
    //console.log('auth middleware')
    try{
        
        const token = req.cookies.hash || (req.header('Authorization') && req.header('Authorization').replace('Bearer ', ''))

        if(!token){
            throw new Error()
        }
        
        const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET)
        const admin = await Admin.findOne({_id: decoded._id, token: token}) //finding proper admin with token
        if(!admin) {
            throw new Error()
        }

        req.token = token //specified token - u can logout from specific device!
        req.admin = admin
        next()
        //console.log(token)
    }catch(e) {
        console.log(e.message)
        res.status(401).send({ error: 'Please authenticate.'})
    }
}