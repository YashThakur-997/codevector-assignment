require('dotenv').config();
const express = require('express');
const productsRouter = require('./routes/products.routes');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// CRUCIAL: This parses form text fields so req.body works!
app.use(express.urlencoded({ extended: true })); 

// Mounted directly to the root '/'
app.use('/', productsRouter);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 High-performance backend listening on port ${PORT}`);
});