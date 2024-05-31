const express = require('express')
const { getAllProducts, createProduct, updateProduct, deleteProduct, getOneProduct } = require('../controllers/productControllers');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');


const router = express.Router();

router.route('/products').get(isAuthenticatedUser, authorizeRoles("admin") ,getAllProducts)
router. route('/product/create').post(isAuthenticatedUser,createProduct)
router.route('/product/:id').put(isAuthenticatedUser,updateProduct).delete(isAuthenticatedUser,deleteProduct).get(getOneProduct)

module.exports = router