import { vehicleServices } from './vehicle.service';
import { Request, Response } from "express";

const createVehicle=async(req: Request, res: Response)=>{
    const {vehicle_name, type,registration_number,daily_rent_price,availability_status}=req.body ; 


    try {

    
        const result = await vehicleServices.createVehicle(vehicle_name, type,registration_number,daily_rent_price,availability_status)

        res.status(200).send({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
        
    } catch (error:any) {
        res.status(501).send({
            success:false,
            message:error.message
        })
        
    }
  

  

}

const getAllVehicles=async(req: Request, res: Response)=>{



    try {

    
        const result = await vehicleServices.getAllVehicles()
        if(result.rows.length ===0){
             res.status(200).send({
      success: true,
      message: "No vehicles found",
      
    });


        }
        res.status(200).send({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows[0],
    });
        
    } catch (error:any) {
        res.status(501).send({
            success:false,
            message:error.message
        })
        
    }
  

  

}

const singleVehicle =async(req: Request, res: Response)=>{
     try {
    const id=Number(req.params.vehicleId);
    
        const result = await vehicleServices.singleVehicle(id)
        
        res.status(200).send({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows[0],
    });
        
    } catch (error:any) {
        res.status(501).send({
            success:false,
            message:error.message
        })
        
    }

}

const updateVehicle =async(req: Request, res: Response)=>{
     try {
    const {vehicle_name, type,registration_number,daily_rent_price,availability_status}=req.body ; 
    const id=Number(req.params.vehicleId);
    const {}=req.body
    
        const result = await vehicleServices.updateVehicle(id,vehicle_name, type,registration_number,daily_rent_price,availability_status,)
       
        res.status(200).send({
      success: true,
      message: "Vehicles updated successfully",
      data: result.rows[0],
    });
        
    } catch (error:any) {
        res.status(501).send({
            success:false,
            message:error.message
        })
        
    }

}

const deleteVehicle=async(req: Request, res: Response)=>{
     try {
    const id=Number(req.params.vehicleId);
    
        const result = await vehicleServices.deleteVehicle(id)
        
        res.status(200).send({
      success: true,
      message: "Vehicles delete successfully",
      
    });
        
    } catch (error:any) {
        res.status(501).send({
            success:false,
            message:error.message
        })
        
    }

}
export const vehicleController={
    createVehicle,getAllVehicles,singleVehicle,updateVehicle,deleteVehicle
}