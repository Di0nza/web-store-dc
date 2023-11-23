const Router = require('express');
const router = new Router();
const adminController = require('../controller/adminController')

router.get('/', adminController.getAll)

module.exports = router;