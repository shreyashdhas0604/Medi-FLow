import { ApiResponse } from "../utils/ApiResponse";
import { DoctorService } from "../services/doctor.service";
import { Request, Response } from "express";

const doctorService = new DoctorService();
 // Define the DoctorController class
export class DoctorController {
    public async createDoctor(req: any, res: any) {
        try {
            const reqDoctor = req.body;
            if (!reqDoctor) {
                return res.status(400).json(
                    new ApiResponse(400, {}, "Please provide doctor details")
                );
            }

            const doctor = await doctorService.createDoctor(reqDoctor);
            return res.status(201).json(
                new ApiResponse(201, { doctor }, "Doctor created successfully")
            );
        } catch (error: any) {
            console.error("Error in createDoctor Controller : ", error);
            return res.status(500).json(
                new ApiResponse(500, {}, error.message || "Failed to create doctor")
            );
        }
    }

    public async getDoctorsByDepartment(req: any, res: any) {
        try {
            const departmentId = req.params.departmentId;
            if (!departmentId) {
                return res.status(400).json(
                    new ApiResponse(400, {}, "Department ID is required")
                );
            }

            const doctors = await doctorService.getDoctorsByDepartment(departmentId);
            return res.status(200).json(
                new ApiResponse(200, { doctors }, "Doctors fetched successfully")
            );
        } catch (error: any) {
            console.error("Error in getDoctorsByDepartment Controller : ", error);
            return res.status(500).json(
                new ApiResponse(500, {}, error.message || "Failed to fetch doctors")
            );
        }
    }

    public async getDoctorsByHospital(req: any, res: any) {
        try {
            const hospitalId = req.params.hospitalId;
            if (!hospitalId) {
                return res.status(400).json(
                    new ApiResponse(400, {}, "Hospital ID is required")
                );
            }

            const doctors = await doctorService.getDoctorsByHospital(hospitalId);
            return res.status(200).json(
                new ApiResponse(200, { doctors }, "Doctors fetched successfully")
            );
        } catch (error: any) {
            console.error("Error in getDoctorsByHospital Controller : ", error);
            return res.status(500).json(
                new ApiResponse(500, {}, error.message || "Failed to fetch doctors")
            );
        }
    }

    public async getDoctorsByAvailability(req: any, res: any) {
        try {
            const availability = req.params.availability;
            if (!availability) {
                return res.status(400).json(
                    new ApiResponse(400, {}, "Availability parameter is required")
                );
            }

            const doctors = await doctorService.getDoctorsByAvailability(availability);
            return res.status(200).json(
                new ApiResponse(200, { doctors }, "Doctors fetched successfully")
            );
        } catch (error: any) {
            console.error("Error in getDoctorsByAvailability Controller : ", error);
            return res.status(500).json(
                new ApiResponse(500, {}, error.message || "Failed to fetch doctors")
            );
        }
    }

    public async getDoctor(req: any, res: any) {
        try {
            const id = parseInt(req.params.id);
            if (!id) {
                return res.status(400).json(
                    new ApiResponse(400, {}, "Doctor ID is required")
                );
            }

            const doctor = await doctorService.getDoctor(id);
            if (!doctor) {
                return res.status(404).json(
                    new ApiResponse(404, {}, "Doctor not found")
                );
            }

            return res.status(200).json(
                new ApiResponse(200, { doctor }, "Doctor fetched successfully")
            );
        } catch (error: any) {
            console.error("Error in getDoctor Controller : ", error);
            return res.status(500).json(
                new ApiResponse(500, {}, error.message || "Failed to fetch doctor")
            );
        }
    }

    public async updateDoctor(req: any, res: any) {
        try {
            const doctorId = parseInt(req.params.id); // Ensure ID is parsed as number
            const updateData = req.body;

            if (!doctorId || !updateData) {
                return res.status(400).json(
                    new ApiResponse(400, {}, "Doctor ID and update data are required")
                );
            }

            const doctor = await doctorService.updateDoctor(doctorId, updateData);
            return res.status(200).json(
                new ApiResponse(200, { doctor }, "Doctor updated successfully")
            );
        } catch (error: any) {
            console.error("Error in updateDoctor Controller : ", error);
            return res.status(500).json(
                new ApiResponse(500, {}, error.message || "Failed to update doctor")
            );
        }
    }

    public async deleteDoctor(req: any, res: any) {
        try {
            const doctorId = parseInt(req.params.id); // Ensure ID is parsed as number
            if (!doctorId) {
                return res.status(400).json(
                    new ApiResponse(400, {}, "Doctor ID is required")
                );
            }

            const doctor = await doctorService.deleteDoctor(doctorId);
            return res.status(200).json(
                new ApiResponse(200, { doctor }, "Doctor deleted successfully")
            );
        } catch (error: any) {
            console.error("Error in deleteDoctor Controller : ", error);
            return res.status(500).json(
                new ApiResponse(500, {}, error.message || "Failed to delete doctor")
            );
        }
    }

    public async getRatings(req: any, res: any) {
        try {
            const doctorId = req.params.id;
            if (!doctorId) {
                return res.status(400).json(
                    new ApiResponse(400, {}, "Doctor ID is required")
                );
            }

            const ratings = await doctorService.getRatings(doctorId);
            return res.status(200).json(
                new ApiResponse(200, { ratings }, "Ratings fetched successfully")
            );
        } catch (error: any) {
            console.error("Error in getRatings Controller : ", error);
            return res.status(500).json(
                new ApiResponse(500, {}, error.message || "Failed to fetch ratings")
            );
        }
    }

    public async addRating(req: any, res: any) {
        try {
            const doctorId = req.params.id;
            const ratingData = req.body;

            if (!doctorId || !ratingData) {
                return res.status(400).json(
                    new ApiResponse(400, {}, "Doctor ID and rating data are required")
                );
            }

            const rating = await doctorService.addRating(doctorId, ratingData);
            return res.status(201).json(
                new ApiResponse(201, { rating }, "Rating added successfully")
            );
        } catch (error: any) {
            console.error("Error in addRating Controller : ", error);
            return res.status(500).json(
                new ApiResponse(500, {}, error.message || "Failed to add rating")
            );
        }
    }

    public async updateRating(req: any, res: any) {
        try {
            const ratingId = req.params.id;
            const updateData = req.body;

            if (!ratingId || !updateData) {
                return res.status(400).json(
                    new ApiResponse(400, {}, "Rating ID and update data are required")
                );
            }

            const rating = await doctorService.updateRating(ratingId, updateData);
            return res.status(200).json(
                new ApiResponse(200, { rating }, "Rating updated successfully")
            );
        } catch (error: any) {
            console.error("Error in updateRating Controller : ", error);
            return res.status(500).json(
                new ApiResponse(500, {}, error.message || "Failed to update rating")
            );
        }
    }

    public async deleteRating(req: any, res: any) {
        try {
            const ratingId = req.params.id;
            const userId = req.user?.id;

            if (!ratingId || !userId) {
                return res.status(400).json(
                    new ApiResponse(400, {}, "Rating ID and user ID are required")
                );
            }

            const rating = await doctorService.deleteRating(ratingId, userId);
            if (!rating) {
                return res.status(404).json(
                    new ApiResponse(404, {}, "Rating not found")
                );
            }

            return res.status(200).json(
                new ApiResponse(200, { rating }, "Rating deleted successfully")
            );
        } catch (error: any) {
            console.error("Error in deleteRating Controller : ", error);
            return res.status(500).json(
                new ApiResponse(500, {}, error.message || "Failed to delete rating")
            );
        }
    }

    public async getAllDoctors(req: any, res: any) {
        try {
            const doctors = await doctorService.getAllDoctors();
            return res.status(200).json(
                new ApiResponse(200, { doctors }, "All doctors fetched successfully")
            );
        } catch (error: any) {
            console.error("Error in getAllDoctors Controller : ", error);
            return res.status(500).json(
                new ApiResponse(500, {}, error.message || "Failed to fetch doctors")
            );
        }
    }

    public async getDoctorsBySpeciality(req: any, res: any) {
        try {
            const speciality = req.params.speciality;
            if (!speciality) {
                return res.status(400).json(
                    new ApiResponse(400, {}, "Speciality parameter is required")
                );
            }

            const doctors = await doctorService.getDoctorsBySpeciality(speciality);
            return res.status(200).json(
                new ApiResponse(200, { doctors }, "Doctors fetched successfully")
            );
        } catch (error: any) {
            console.error("Error in getDoctorsBySpeciality Controller : ", error);
            return res.status(500).json(
                new ApiResponse(500, {}, error.message || "Failed to fetch doctors")
            );
        }
    }

    public async getOPDRegistrations(req: any, res: any) {
        try {
            const doctorId = req.params.doctorId;
            if (!doctorId) {
                return res.status(400).json(
                    new ApiResponse(400, {}, "Doctor ID is required")
                );
            }

            const opdRegistrations = await doctorService.getOPDRegistrations(doctorId);
            return res.status(200).json(
                new ApiResponse(200, { opdRegistrations }, "OPD registrations fetched successfully")
            );
        } catch (error: any) {
            console.error("Error in getOPDRegistrations Controller : ", error);
            return res.status(500).json(
                new ApiResponse(500, {}, error.message || "Failed to fetch OPD registrations")
            );
        }
    }
}