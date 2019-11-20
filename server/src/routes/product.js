import express from 'express'
import { Product } from '../models/product';
import { auth } from '../middleware/auth';

const router = new express.Router


////ADMIN-SIDE

//CHECK
router.post('/create', auth, async (req, res) =>{

    const product = new Product(req.body)

    try {
        await product.save()
        res.status(201).send(product)
    } catch (e) {
        res.status(500).send(e)
    }
})



//CHECK
router.patch("/update", auth, async (req, res, next) => {
    const updates = Object.keys(req.body);

    const forbiddenUpdates = ["_id"];
  
    const isValidOperation = updates.every(update => {
        return !forbiddenUpdates.includes(update);
    });
  
    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid update!" });
    }
  
    try {
      const product = await Product.findById(req.body._id)
  
      updates.forEach(update => {
        product[update] = req.body[update]; //rally[update] -> rally.name, rally.password itd.
      });
  
      await product.save();

      res.send(product);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });

//CHECK
router.delete('/remove', auth, async (req, res) =>{

    try {
        const product = await Product.findOneAndDelete({_id: req.body._id})

        if(!product){
            res.status(404).send()
        }
        res.send()
    } catch (e) {
        res.status(500).send(e.message)
    }
})


////USER-SIDE

//CHECK
router.get('/shop', auth, async (req, res)=> {

    try{
        const shop = await Product.find({})
        res.send(shop)
    }catch(e){
        res.status(400).send(e.message)
    }
})
export const productRouter = router