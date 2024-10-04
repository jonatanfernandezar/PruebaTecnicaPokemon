import { Router } from "express";
import { createOrder, receiveWebHook, confirmOrden } from "../controllers/payment.controllers.js";

const router = Router();

router.get("/webhook", receiveWebHook);

router.post("/create-order", createOrder);

router.post("/webhook", receiveWebHook);

router.post("/success", confirmOrden);

export default router;