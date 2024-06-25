import express from 'express';
import * as dataController from '../controllers/data.controller.js';
import { upload } from '../middleware/multer.middleware.js';



const router = express.Router();

router.post('/add-product', upload.array('images'), dataController.addProduct);
router.post('/add-banner', upload.array('images'), dataController.addBanner);
router.put('/product-update/:productId', upload.array('images'), dataController.updateProduct);
router.put('/status-update/:id', dataController.updateOrderStatus);
router.post('/order', dataController.confirmOrderMake);
// router.put('/update/:id', dataController.updateProduct);
// router.delete('/delete/:id', dataController.deleteProduct);
router.get('/products', dataController.getProducts);
router.delete('/product-delete/:id', dataController.deleteProduct);
router.get('/banner', dataController.getBanner);
router.get('/orders', dataController.getOrders);
router.get('/product/:slug', dataController.getSingleProduct);
router.get('/product-get/:id', dataController.SingleProductForUpdate);
// router.get('/load-more', dataController.loadMoreProducts);

export default router
 