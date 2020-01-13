export const adminAuth = async (req, res, next) => {
    //TODO: implement full admin auth


    const token = req.cookies.token || (req.header('Authorization') && req.header('Authorization').replace('Bearer ', ''))
    if(!token){
        throw new Error()
    }
    req.token = token 

    next()
}