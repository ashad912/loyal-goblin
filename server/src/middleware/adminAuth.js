import jwt from 'jsonwebtoken'
import { Admin } from '@models/admin'
import { getToken, decodeTokenAndGet } from './functions'


export const adminAuth = async (req, res, next) => {
    
    try{
        const token = getToken(req, 'hash')
        const admin =  await decodeTokenAndGet(Admin, {token}, token, process.env.ADMIN_JWT_SECRET)
        req.token = token 
        req.admin = admin
        next()
    }catch(e) {
        e.status = 401
        next(e)
    }
}