import express from "express";
import controller from "../controller/Transaction";

const router = express.Router();

router.post("/update/", controller.update);
router.post("/create", controller.createTransaction);
router.get("/get/:transactionId", controller.readTransaction);
router.get("/get/", controller.readAll);
router.patch("/update/:transactionId", controller.updateTransaction);
router.delete("/delete/:transactionId", controller.deleteTransaction);
router.post("/getDupes/", controller.getDupes);

export = router;
