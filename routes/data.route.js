import express from 'express';
import * as dataController from '../controllers/data.controller.js';





const router = express.Router();

router.get("/wards",  dataController.getWardDataController);
router.get("/villageByWard/:ward",  dataController.getVillageDataController);
router.get("/single-details/:id",  dataController.getSingleDetailsDataController);
router.get("/ward-data/:ward",  dataController.asesmentGetDataController);
router.get("/ward-data-calculate/:ward",  dataController.allDataCalculateController);
router.get("/search",  dataController.searchDataController);
router.get("/recipt/:id",  dataController.TaxRegisterRecipt);
router.get("/all-data",  dataController.allDataController);
router.get("/recipt",  dataController.paymentRecipt);
router.get("/tax-register",  dataController.TaxRegisterGetDataController);
router.post("/post-data",  dataController.asesmentMakeDataController);
router.post("/tax-pay",  dataController.taxPaymentController);
router.put("/update-qr/:id",dataController.updateQrController);
router.put("/update-data/:id",  dataController.singleDataUpdateController);
router.delete("/delete-data/:id",  dataController.singleDataDeleteController);

export default router
 