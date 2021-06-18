import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Product from '../models/productModel.js';
import { isAdmin, isAuth } from '../utils.js';

const productRouter = express.Router();

productRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.send(products);
  })
);

// aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

productRouter.post(
  '/addproduct',
  expressAsyncHandler(async (req, res) => {
    const productadd = new Product({
      name: req.body.name,
      price: req.body.price,
      countInStock: req.body.price,
      image: req.body.image,
      brand: req.body.brand,
      description: req.body.description,
    });
    const createdProduct = await productadd.save();
    res.send({
      _id: createdProduct._id,
      name: createdProduct.name,
      price: createdProduct.price,
      countInStock: createdProduct.price,
      image: createdProduct.image,
      brand: createdProduct.brand,
      description: createdProduct.description,
      token: generateToken(createdProduct),
    });
  })
);

//end ..........................
productRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    //await Product.remove({});
    const createdProducts = await Product.insertMany(data.products);
    res.send({ createdProducts });
  })
);

productRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.delete('/:id', async (req, res) => {
  try {
    await Product.deleteOne({ _id: req.params.id });
    res.status(200).send({ msg: 'product deleted' });
  } catch (error) {
    res.status(500).send({ msg: 'product not deleted', error });
  }
});

productRouter.put('/:id', async (req, res) => {
  try {
    await Product.updateOne({ _id: req.params.id }, { $set: { ...req.body } });
    res.status(200).send({ msg: 'product updated' });
  } catch (error) {
    res.status(500).send({ msg: 'product not updated', error });
  }
});

export default productRouter;
