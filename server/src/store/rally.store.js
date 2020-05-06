import cron from 'node-cron'
import moment from 'moment'
import { Rally } from '../models/rally';
import { User } from '../models/user'
import { Item } from '../models/item';
import { asyncForEach, designateExperienceMods} from '../utils/methods'


let finishTask

//OK
const updateQueue = async () => {
    try {
        
        
        if(finishTask){ //what if is it not undefined - after restart
            finishTask.destroy()
        }
        
        const firstToStartArray = await Rally.find({ $and: [{ activationDate: { $lte: new Date() } }, {expiryDate: { $gte: new Date() } }]}).sort({"startDate": 1 }).limit(1)
        const firstToExpireArray = await Rally.find({ $and: [{ activationDate: { $lte: new Date() } }, {expiryDate: { $gte: new Date() } }]}).sort({"expiryDate": 1 }).limit(1)
        
        if(!firstToStartArray.length || !firstToExpireArray.length){
            console.log('There is no rally for update criteria!')
            return null
        }

        
        const firstToStart = firstToStartArray[0]
        const firstToExpire = firstToExpireArray[0]

        // const firstToActivate = {
        //     _id: 'halo1234',
        //     activationDate: '2019-11-19T15:55:00.000+00:00',
        //     expiryDate: '2019-11-19T15:56:00.000+00:00'
        // }

        
        if(firstToStart._id.toString() !== firstToExpire._id.toString()){
            console.log('Gap in frontend validation!')
        }
        
        


        //finish
        finishTask = cron.schedule(designateScheduleTime(firstToExpire.expiryDate), async () => {
            
            try{
                
                await finish(firstToExpire)
                
            }catch(e) {
                console.log(e.message)
            }
            
            
        },{
            scheduled: true,
            timezone: "Africa/Casablanca" //always UTC 0 //Warsaw UTC+1/UTC+2
        }
        );
        return firstToExpire
    }catch (e) {
        console.log(e.message)
    }
}

const addAwards = async (user, awardsLevels, rallyNotifications) => {
    const prevNewRallyAwards = rallyNotifications.awards
    let items = []
    let newRallyAwards = []
    if(prevNewRallyAwards && prevNewRallyAwards.length){
        newRallyAwards = [...prevNewRallyAwards]
    }
    await asyncForEach(awardsLevels, async (awardsLevel) => {
        
        if(user.experience >= awardsLevel.level){
            
            await asyncForEach(Object.keys(awardsLevel.awards.toJSON()), async (className) => {
                
                if(user.profile.class === className || className === 'any') {
                        
                    await asyncForEach(awardsLevel.awards[className], async (item) => {

                        const index = newRallyAwards.findIndex((award) => award.itemModel.toString() === item.itemModel.toString())
                        if(index > -1){
                            newRallyAwards[index].quantity += item.quantity
                        }else{
                            newRallyAwards = [...newRallyAwards, {quantity: item.quantity, itemModel: item.itemModel}] 
                        }
                        
                        
                        for(let i=0; i < item.quantity; i++) {
                            const newItem = new Item({itemModel: item.itemModel, owner: user.profile._id})
                            await newItem.save()
                            items = [...items, newItem._id]
                        }
                        
                    })
                }
            }) 
        }
    })
    
    
    return {items, newRallyAwards} 
}

//OK - CHECK PARTLY
const finish = async (rally) => {
    

    //CHECK: IS IT POPULATING?
    await rally.populate({
        path: 'users.profile'
    }).execPopulate()



    const users = rally.users

    await asyncForEach(users, async (rallyUser) => {

        try{
            const user = await User.findById(rallyUser.profile._id).populate({
                path: 'userRallies'
            }) //recoginized as an array
            // console.log(user.userRallies, rallyUser.experience)

            //UPDATE TO CHECK
            const index = user.userRallies.findIndex((activeRally) => activeRally._id.toString() === rally._id.toString())

            if((user.userRallies.length) && (index >= 0) && (rallyUser.experience > 0)){ 
                const data = await addAwards(rallyUser, rally.awardsLevels, user.rallyNotifications)
                const {items, newRallyAwards} = data

                const modRallyExp = designateExperienceMods(rally.experience, user.userPerks.rawExperience)
                //const newLevels = designateNewLevels(user.experience, modRallyExp)
                const newLevels = user.getNewLevels(modRallyExp)

                await User.updateOne(
                    {_id: user._id},
                    { $addToSet: { bag: { $each: items } }, $set: {'rallyNotifications.isNew': true, 'rallyNotifications.awards': newRallyAwards}, $inc: {experience: modRallyExp, 'statistics.rallyCounter': 1, 'rallyNotifications.experience': modRallyExp, levelNotifications: newLevels}}
                )
                
            }
        }catch(e){
            console.log(e.message)
        }
            
            
            //
    
    })

    
    await rally.save()
    finishTask.destroy()
    await updateQueue() //if update is to fast??


}

//OK
const designateScheduleTime = (date) => {
    
    const momentDate = moment.utc(date) //was moment(date) for 'Europe/Warsaw'
    const month = momentDate.month() + 1
    const dayOfMonth = momentDate.date()
    const hour = momentDate.hour()
    const minutes = momentDate.minutes()
    const seconds = momentDate.seconds()
    console.log(`${seconds} ${minutes} ${hour} ${dayOfMonth} ${month} *`)
    return `${seconds} ${minutes} ${hour} ${dayOfMonth} ${month} *`
}
    
    
export default {
    updateQueue,
    finish
}