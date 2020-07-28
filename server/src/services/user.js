import { User } from "@models/user";


const getUsers = async () => {
  try {
    const users = await User.aggregate().match({}).sort({ "lastActivityDate": -1 }).project({
      '_id': 1,
      'name': 1,
      'avatar': 1,
      'active': 1,
      'experience': 1,
      'lastActivityDate': 1,

    })

    return users
  } catch (e) {
    throw e
  }

}


export default {
    getUsers
}

