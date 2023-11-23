const Router = require('express')
const router = new Router();
const productRouter = require('./productRouter');
const adminRouter = require('./adminRouter');
const userRouter = require('./userRouter');

router.use('/product', productRouter);
router.use('/admin', adminRouter);
router.use('/users', userRouter);

module.exports = router