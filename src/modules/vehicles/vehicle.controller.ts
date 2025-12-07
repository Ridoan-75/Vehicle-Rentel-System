import { vehicleServices } from './vehicle.service';
import { Request, Response } from "express";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;

    const result = await vehicleServices.createVehicle(
      vehicle_name, 
      type, 
      registration_number, 
      daily_rent_price, 
      availability_status
    );

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('already exists') ? 409 : 400;
    res.status(statusCode).json({
      success: false,
      message: "Error creating vehicle",
      errors: error.message
    });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getAllVehicles();
    
    if (result.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: []
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result,  
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error retrieving vehicles",
      errors: error.message
    });
  }
};

const singleVehicle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.vehicleId);
    
    const result = await vehicleServices.singleVehicle(id);
    
    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: "Error retrieving vehicle",
      errors: error.message
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.vehicleId);
    const updateData = req.body;
    
    const result = await vehicleServices.updateVehicle(id, updateData);
    
    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 :
                       error.message.includes('already exists') ? 409 : 400;
    
    res.status(statusCode).json({
      success: false,
      message: "Error updating vehicle",
      errors: error.message
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.vehicleId);
    
    await vehicleServices.deleteVehicle(id);
    
    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 400;
    
    res.status(statusCode).json({
      success: false,
      message: "Error deleting vehicle",
      errors: error.message
    });
  }
};

export const vehicleController = {
  createVehicle,
  getAllVehicles,
  singleVehicle,
  updateVehicle,
  deleteVehicle
};