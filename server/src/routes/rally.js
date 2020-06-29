import express from 'express'
import { Rally } from '@models/rally';
import { ItemModel } from '@models/itemModel';
import { adminAuth } from '@middleware/adminAuth';
import { auth } from '@middleware/auth';
import { savePNGImage, removeImage, getEndpointError } from '@utils/functions'
import { ERROR, INFO, WARN } from '@utils/constants'

import rallyStore from '@store/rally.store'


const uploadPath = "../static/images/rallies/"

const router = new express.Router


////ADMIN-SIDE


//OK
router.get('/listEventCreator', adminAuth, async (req, res, next) => {
    try {
        const rallyList = await Rally.find({ expiryDate: { $gte: new Date() } })

        res.send(rallyList)
    } catch (e) {
        next(e)
    }


})

//OK
router.post('/create', adminAuth, async (req, res, next) => {

    try {
        const rally = new Rally(req.body)


        await rally.conflictCheck()

        await rally.save()

        await rallyStore.updateQueue()
        res.status(201).send(rally._id)

    } catch (e) {
        next(e)
    }
})

router.patch('/uploadIcon/:id', adminAuth, async (req, res, next) => {
    try {
        if (!req.files) {
            throw getEndpointError(WARN, 'No file(s) provided')
        }

        const rally = await Rally.findById(req.params.id)
        if (!rally) {
            throw getEndpointError(WARN, 'Rally does not exist', null, 404)
        }

        if (req.files.icon) {
            let icon = req.files.icon.data
            const imgSrc = await savePNGImage(icon, rally._id, uploadPath, rally.imgSrc)
            rally.imgSrc = imgSrc
        }



        await rally.save()

        res.status(200).send()
    } catch (e) {
        next(e)
    }

})

//OK
router.patch("/update", adminAuth, async (req, res, next) => {
    let updates = Object.keys(req.body);
    const id = req.body._id
    try {
        updates = updates.filter((update) => {
            return update !== '_id' || update !== "imgSrc"
        })

        const forbiddenUpdates = [""];

        const isValidOperation = updates.every(update => {
            return !forbiddenUpdates.includes(update);
        });

        if (!isValidOperation) {
            throw getEndpointError(WARN, 'Invalid update')
        }


        const rally = await Rally.findById(id)

        if (!rally) {
            return res.status(404).send()
        }

        updates.forEach(update => {
            rally[update] = req.body[update]; //rally[update] -> rally.name, rally.password itd.
        });

        await rally.save();

        if (updates.includes("activationDate") || updates.includes('expiryDate') || updates.includes('startDate')) {
            await rallyStore.updateQueue()
        }

        res.send(rally._id);
    } catch (e) {
        next(e)
    }
});

//OK
router.delete('/remove', adminAuth, async (req, res, next) => {

    try {

        const rally = await Rally.findOneAndDelete({ _id: req.body._id })

        if (!rally) {
            throw getEndpointError(WARN, 'Rally does not exist', null, 404)
        }

        await removeImage(uploadPath, rally.imgSrc)

        await rally.updateQueue()

        res.sendStatus(200)
    } catch (e) {
        next(e)
    }
})

////USER-SIDE

//OK
router.get('/first', auth, async (req, res, next) => {
    try {
        const rallyArray = await Rally
            .aggregate()
            .match({ $and: [{ activationDate: { $lte: new Date() } }, { expiryDate: { $gte: new Date() } }] })
            .project(rallyStore.rallyProjection(req.user._id))
            .sort({ "startDate": 1 })
            .limit(1)
        if (!rallyArray.length) {
            res.send("")
            return
        }
        const rally = rallyArray[0]

        if (!rally.awardsAreSecret) {
            await ItemModel.rallyPopulate(rally)
        }

        res.send(rally) //can send undefined, what have to be supported by frontend
    } catch (e) {
        next(e)
    }
})


export const rallyRouter = router

