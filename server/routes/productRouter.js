const Router = require('express');
const router = new Router();
const productController = require('../controller/productController')

router.get('/', productController.getAll)

module.exports = router;