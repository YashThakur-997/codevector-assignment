const { prisma } = require('../config/db');

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Beauty'];

const getProducts = async (req, res) => {
  try {
    const { category, cursor, history } = req.query;
    const limit = parseInt(req.query.limit, 10) || 20;
    const take = limit + 1;

    // Parse our history stack from the URL query string (comma-separated cursors)
    let historyStack = history ? history.split(',') : [];

    let findManyArgs = {
      take: take,
      orderBy: [
        { createdAt: 'desc' },
        { id: 'desc' }
      ],
      where: category ? { category } : {},
    };

    if (cursor) {
      findManyArgs.cursor = { id: cursor };
      findManyArgs.skip = 1;
    }

    const products = await prisma.product.findMany(findManyArgs);
    const hasNextPage = products.length > limit;
    const results = hasNextPage ? products.slice(0, limit) : products;

    let nextCursor = null;
    if (hasNextPage) {
      nextCursor = results[results.length - 1].id;
    }

    // Build the dynamic navigation tokens
    let prevCursor = null;
    let nextHistoryString = '';
    let prevHistoryString = '';

    if (cursor) {
      // If we have a cursor, we are at least on page 2.
      // The cursor for the "Previous" page is the last item in our history stack.
      prevCursor = historyStack[historyStack.length - 1] || null;
      
      // The history string for the Next page adds our current cursor to the stack
      nextHistoryString = [...historyStack, cursor].join(',');
      
      // The history string for the Previous page pops the last item off the stack
      prevHistoryString = historyStack.slice(0, -1).join(',');
    } else {
      // We are on page 1
      nextHistoryString = '';
    }

    return res.render('index', {
      products: results,
      nextCursor,
      prevCursor,
      nextHistory: nextHistoryString,
      prevHistory: prevHistoryString,
      currentCategory: category || '',
      categories: CATEGORIES
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).send('Internal server error');
  }
};

// Add this new function to handle form submission
const createProduct = async (req, res) => {
  try {
    const { name, category, price } = req.body;

    if (!name || !category || !price) {
      return res.status(400).send('All fields are required.');
    }

    // Insert the new record into the database
    await prisma.product.create({
      data: {
        name: name,
        category: category,
        price: parseFloat(price),
        // createdAt defaults to now() natively in the schema
      }
    });

    // Redirect straight back to the first page to see the shiny new item at the top
    return res.redirect('/');
  } catch (error) {
    console.error('Create Product Error:', error);
    return res.status(500).send('Internal server error');
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Read the current query string states so we can return the user exactly where they were
    const { category, cursor, history } = req.query;

    await prisma.product.delete({
      where: { id: id }
    });

    // Rebuild the query string parameters to preserve pagination context after deletion
    let redirectUrl = '/?';
    if (category) redirectUrl += `category=${category}&`;
    if (cursor) redirectUrl += `cursor=${cursor}&`;
    if (history) redirectUrl += `history=${history}`;

    return res.redirect(redirectUrl);
  } catch (error) {
    console.error('Delete Product Error:', error);
    return res.status(500).send('Internal server error');
  }
};

// Add it to your module exports at the bottom
module.exports = {
  getProducts,
  createProduct,
  deleteProduct // Added here
};
