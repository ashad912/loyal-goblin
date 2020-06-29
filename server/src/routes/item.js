import express from 'express'
import { ItemModel } from '@models/itemModel';
import { User } from '@models/user';
import { adminAuth } from '@middleware/adminAuth';
import { Item } from '@models/item';
import { savePNGImage, saveSVGImage, removeImage, getEndpointError } from '@utils/functions'
import {ERROR, INFO, WARN} from '@utils/constants'


const uploadIconPath = "../static/images/items/"
const uploadAppearancePath = "../static/images/appearance/main/"
const uploadAltAppearancePath = "../static/images/appearance/alt/"

const router = new express.Router

////ADMIN-SIDE

///MODEL


router.get('/itemModels', adminAuth, async (req, res, next) => {
    try {
        const itemModels = await ItemModel.find({}).populate({
            path: "perks.target.disc-product",
            select: '_id name'
        })

        res.status(200).send(itemModels)
    } catch (e) {
        next(e)
    }
})


//OK
router.post('/createModel', adminAuth, async (req, res, next) => {

    const itemModel = new ItemModel(req.body)

    try {
        await itemModel.save()
        res.status(201).send(itemModel._id)
    } catch (e) {
        next(e)
    }
})

router.patch('/uploadModelImages/:id', adminAuth, async (req, res, next) => {
    try {
        if (!req.files) {
            throw getEndpointError(WARN, 'No file(s) provided')
        }

        const itemModel = await ItemModel.findById(req.params.id)
        if (!itemModel) {
            throw getEndpointError(WARN, 'Item model does not exist', null, 404)
        }

        const date = Date.now()

        if (req.files.icon) {
            let icon = req.files.icon.data
            const imgSrc = await savePNGImage(icon, itemModel._id, uploadIconPath, itemModel.imgSrc, date)
            itemModel.imgSrc = imgSrc
        }

        if (req.files.appearance) {
            let appearance = req.files.appearance.data
            const appearanceSrc = await saveSVGImage(appearance, itemModel._id, uploadAppearancePath, itemModel.appearanceSrc, date)
            itemModel.appearanceSrc = appearanceSrc
        }

        if (req.files.altAppearance) {
            let altAppearance = req.files.altAppearance.data
            const altAppearanceSrc = await saveSVGImage(altAppearance, itemModel._id, uploadAltAppearancePath, itemModel.altAppearanceSrc, date)
            itemModel.altAppearanceSrc = altAppearanceSrc
        }


        await itemModel.save()

        res.status(200).send()
    } catch (e) {
        next(e)
    }

})

//OK
router.patch("/updateModel", adminAuth, async (req, res, next) => {
    let updates = Object.keys(req.body);
    const id = req.body._id

    try{
        
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
    
        const itemModel = await ItemModel.findById(id)

        if (!itemModel) {
            throw getEndpointError(WARN, 'Item model does not exist', null, 404)
        }

        updates.forEach(async (update) => {
            itemModel[update] = req.body[update];
        });

        const equippableItems = ['weapon', 'feet', 'hands', 'head', 'chest', 'legs', 'ring']

        if (!equippableItems.includes(itemModel.type)) {
            if (itemModel.appearanceSrc) {
                await removeImage(uploadAppearancePath, itemModel.appearanceSrc)
                itemModel.appearanceSrc = null
            }
            if (itemModel.altAppearanceSrc) {
                await removeImage(uploadAltAppearancePath, itemModel.altAppearanceSrc)
                itemModel.altAppearanceSrc = null
            }
        }

        if (itemModel.twoHanded) {
            if (itemModel.altAppearanceSrc) {
                await removeImage(uploadAltAppearancePath, itemModel.altAppearanceSrc)
                itemModel.altAppearanceSrc = null
            }
        }

        await itemModel.save();

        res.send(itemModel._id);
    } catch (e) {
        next(e)
    }
});



//OK
router.delete('/removeModel', adminAuth, async (req, res, next) => {

    try {
        const itemModel = await ItemModel.findOne({ _id: req.body._id })

        if (!itemModel) {
            throw getEndpointError(WARN, 'Item model does not exist', null, 404)
        }

        await removeImage(uploadIconPath, itemModel.imgSrc)

        await itemModel.remove()

        res.send()
    } catch (e) {
        next(e)
    }
})




////USER-SIDE

// blank

//

////TESTS

/// TEST ADMIN -> INSTANCE

//OK
router.post('/create', adminAuth, async (req, res, next) => {


    const item = new Item(req.body)

    try {
        const user = await User.findById(req.body.owner)

        if (!user) {
            throw getEndpointError(WARN, 'Invalid owner')
        }

        const itemModel = await ItemModel.findById(req.body.itemModel)

        if (!itemModel) {
            throw getEndpointError(WARN, 'Invalid model')
        }

        await item.save()
        //console.log(item)

        //NOTE: without using 'post save' middleware (adding to bag) due to optimalization issues - less queries for adding awards

        await User.updateOne(
            { _id: req.body.owner },
            { $addToSet: { bag: item._id } }
        )
        // user.bag = [...user.bag, item._id]
        // await user.save()

        res.status(201).send(item)
    } catch (e) {
        next(e)
    }
})


//OK
router.delete('/remove', adminAuth, async (req, res, next) => {

    try {
        const item = await Item.findOne({ _id: req.body._id })

        if (!item) {
            res.status(404).send()
        }

        await item.remove()

        res.send()
    } catch (e) {
        next(e)
    }
})


export const itemRouter = router