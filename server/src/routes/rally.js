import express from 'express'
import { Rally} from '../models/rally';
import { auth } from '../middleware/auth';
import { Item } from '../models/item';
import { asyncForEach } from '../utils/methods'

const router = new express.Router


router.post('/createRally', auth, async (req, res) =>{

    const rally = new Rally(req.body)

    try {
        await rally.save()
        res.status(201).send(rally)
    } catch (e) {
        res.status(400).send(e)
    }
})
//TO-DO: FINISH!!!!
async function addAwards(user, awardsLevels){
    let items = []
    
    await asyncForEach(awardsLevels, async (awardsLevel) => {
        if(user.experience >= awardsLevel.level){
            await asyncForEach(Object.keys(awardsLevel), async (className) => {
                if(user.profile.class === className || className === 'any') {
                    await asyncForEach(className, async (item) => {
                        const newItem = new Item({model: item, owner: user.profile._id})
                        items = [...items, newItem]
                        await newItem.save()
                    })
                }
            }) 
        }
    })
    
    
    return items  
}

router.post('/finishRally', auth, async (req, res) => {
    const rally = await Rally.findById(req.body._id).populate({
        path: 'awardsLevels.awardsLevel.awards'
    }).populate({
        path: 'users.profile'
    }).execPopulate()

    const users = rally.users

    await asyncForEach(users, async (rallyUser) => {
        const user = await User.findById(rallyUser.profile._id).populate({
            path: 'activeRally'
        })
        if(user.activeRally && rallyUser.experience > 0){
            const items = await addAwards(rallyUser, rally.awardsLevels)
            user.bag = [...user.bag, items]
        } 
        
    })


})

export const rallyRouter = router