import express from 'express'
import bcrypt from 'bcryptjs'
import { ItemModel } from '../models/itemModel';
import { auth } from '../middleware/auth';
import { Item } from '../models/item';

const router = new express.Router


router.post('/createModel', auth, async (req, res) =>{

    const itemModel = new ItemModel(req.body)

    try {
        await itemModel.save() //this method holds updated user!
        res.status(201).send(itemModel)
    } catch (e) {
        res.status(400).send(e)
    }
})



router.post('/create', auth, async (req, res) =>{

    //without adding to spefic user eq!

    const item = new Item(req.body)

    try {
        await item.save() //this method holds updated user!
        res.status(201).send(item)
    } catch (e) {
        res.status(400).send(e)
    }
})

export const itemRouter = router