import express from 'express'
import { ProductModel } from '../models/productModel';
import { auth } from '../middleware/auth';

const router = new express.Router


router.post('/createProduct', auth, async (req, res) =>{

    const productModel = new ProductModel(req.body)

    try {
        await productModel.save() //this method holds updated user!
        res.status(201).send(productModel)
    } catch (e) {
        res.status(400).send(e)
    }
})



export const productRouter = router