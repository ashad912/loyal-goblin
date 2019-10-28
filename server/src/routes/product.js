import express from 'express'
import { Product } from '../models/product';
import { auth } from '../middleware/auth';

const router = new express.Router


router.post('/createProduct', auth, async (req, res) =>{

    const product = new Product(req.body)

    try {
        await product.save() //this method holds updated user!
        res.status(201).send(product)
    } catch (e) {
        res.status(400).send(e)
    }
})



export const productRouter = router