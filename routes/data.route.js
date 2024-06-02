import express from 'express';
import * as dataController from '../controllers/data.controller.js';
import WardDataModel from '../models/ward.data.model.js';





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
router.get('/next-holding/:ward', async (req, res) => {
    try {
      const ward = parseInt(req.params.ward, 10);
      const latestHoldingDoc = await WardDataModel.findOne({ ward: ward }, {}, { sort: { holding: -1 } });
      const latestHolding = latestHoldingDoc ? latestHoldingDoc.holding : 0;
      const nextHolding = latestHolding + 1;
      res.json({ nextHolding });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
router.get("/tax-register",  dataController.TaxRegisterGetDataController);
router.post("/post-data",  dataController.asesmentMakeDataController);
router.post("/tax-pay",  dataController.taxPaymentController);
router.put("/update-qr/:id",dataController.updateQrController);
router.put("/update-data/:id",  dataController.singleDataUpdateController);
router.delete("/delete-data/:id",  dataController.singleDataDeleteController);

export default router
 