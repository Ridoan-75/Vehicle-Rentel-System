import { Router } from "express";
import { vehicleController } from "./vehicle.controller";
import auth from "../../middleware/auth";
import verifyAccess from "../../middleware/verifyAccess";

const router = Router();


router.post("/", auth(), verifyAccess(['admin']), vehicleController.createVehicle);
router.get("/", vehicleController.getAllVehicles); 
router.get("/:vehicleId", vehicleController.singleVehicle);  
router.put("/:vehicleId", auth(), verifyAccess(['admin']), vehicleController.updateVehicle);
router.delete("/:vehicleId", auth(), verifyAccess(['admin']), vehicleController.deleteVehicle);

export const vehicleRoute = router;