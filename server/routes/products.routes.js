const { getProducts , createProduct , deleteProduct } = require('../controllers/products.controller');
const express = require('express');
const router = express.Router();

router.get('/products', getProducts);

router.get('/',getProducts);

router.post('/add', createProduct);

router.post('/delete/:id', deleteProduct);


module.exports = router;
