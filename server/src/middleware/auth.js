
import { User } from '@models/user'
import { getToken, decodeTokenAndGet} from './functions'

export const auth = async (req, res, next) => {
    
    try{
        const token = getToken(req, 'token')
        const user = await decodeTokenAndGet(User, {active: true, 'tokens.token': token}, token, process.env.JWT_SECRET)
        
        await user.updateActivityDate(req.query)
        
        if(user.passwordChangeToken){
            user.passwordChangeToken = null
            await user.save()
        }

        req.token = token //specified token - u can logout from specific device!
        req.user = user
        next()
    }catch(e) {
        e.status = e.status || 401
        next(e)
    }
}

