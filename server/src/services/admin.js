import { Admin } from "@models/admin";


const login = async (email, password) => {
    const admin = await Admin.findByCredentials(email, password);
    const token = await admin.generateAuthToken(); //on instancegenerateAuthToken
    return { admin, token }
}

const logout = async (admin) => {
    admin.token = null
    await admin.save();
}

export default {
    login,
    logout
}