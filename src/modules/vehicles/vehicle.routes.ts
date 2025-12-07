import { Router } from "express";
import { vehicleController } from "./vehicle.controller";
import auth from "../../middleware/auth";
import verifyAdmin from "../../middleware/verifyAccess";

  const router=Router()

  router.post("/vehicles",auth(),verifyAdmin(),vehicleController.createVehicle)
  router.get("/vehicles",vehicleController.getAllVehicles)
  router.get("/vehicles/:vehicleId",vehicleController.singleVehicle)
  router.put("/vehicles/:vehicleId",auth(),verifyAdmin(),vehicleController.updateVehicle)
  router.delete("/vehicles/:vehicleId",auth(),verifyAdmin(),vehicleController.deleteVehicle)



export const vehicleRoute = router;