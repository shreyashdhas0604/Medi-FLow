import { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { HospitalService } from '../services/hospital.service';
import cloudinaryService from '../utils/cloudinaryService';
import { time } from 'console';

export class HospitalController {
    private hospitalService: HospitalService;

    constructor() {
        this.hospitalService = new HospitalService();
    }

    public async createHospital(req: any, res: any) {
        try {
            const { name, address, registrationNumber, contactNumber, adminID, departments } = req.body;

            console.log("Req body in the createHospitalController : ",req.body);
            // Validation for required fields
            if (!name || !address || !registrationNumber || !contactNumber || !adminID || !departments) {
                return res.status(400).json(
                    new ApiResponse(400, null, 'Please provide all the details (name, address, registrationNumber, contactNumber, adminID, departments)')
                );
            }

            let departmentsData;
            try {
                departmentsData = typeof departments === 'string' ? JSON.parse(departments) : departments;
            } catch (error) {
                return res.status(400).json(
                    new ApiResponse(400, null, 'Invalid departments data format')
                );
            }

            // Validate departments array
            if (!Array.isArray(departmentsData) || departmentsData.length === 0) {
                return res.status(400).json(
                    new ApiResponse(400, null, 'Please provide at least one department')
                );
            }

            req.body.timeSlots = JSON.parse(req.body.timeSlots);

            const reqHospitalData = {
                name: req.body.name,
                speciality: req.body.speciality,
                address: req.body.address,
                registrationNumber: req.body.registrationNumber,
                contactNumber: req.body.contactNumber,
                timings: req.body.timings,
                totalBeds: parseInt(req.body.totalBeds),
                totalPersonsPerSlot: parseInt(req.body.totalPersonsPerSlot),
                hospitalImageUrl: req.body.hospitalImageUrl || [],
                establishedDate: new Date(req.body.establishedDate),
                rating: parseFloat(req.body.rating) || 0.0,
                isVerified: req.body.isVerified || 'pending',
                adminID: parseInt(req.body.adminID),
                //timeslots must be array of strings
                timeSlots : req.body.timeSlots || [],
                departments: departmentsData,
            };

            // Handle image upload
            const imageFiles = req.files as Express.Multer.File[];
            const uploadedImageUrls: string[] = [];

            if (imageFiles?.length > 0) {
                for (const file of imageFiles) {
                    try {
                        const uploadResult = await cloudinaryService.uploadImage(file.buffer, `${name}-${Date.now()}`);
                        const result = uploadResult as {secure_url : string}
                        uploadedImageUrls.push(result.secure_url);
                    } catch (uploadError) {
                        console.error('Error uploading image:', uploadError);
                        return res.status(500).json(
                            new ApiResponse(500, null, 'Error while uploading images')
                        );
                    }
                }
                reqHospitalData.hospitalImageUrl = uploadedImageUrls;
            }

            const hospital = await this.hospitalService.createHospital(reqHospitalData);
            return res.status(201).json(
                new ApiResponse(201, hospital, 'Hospital registered successfully with departments. It will be visible once verified.')
            );
        } catch (error: any) {
            console.error('Error in createHospital:', error);
            return res.status(error.statusCode || 500).json(
                new ApiResponse(error.statusCode || 500, null, error.message || 'Error while registering hospital')
            );
        }
    }

    public async getHospitals(req: any, res: any) {
        try {
            const hospitals = await this.hospitalService.getHospitals(req.query);
            return res.status(200).json(
                new ApiResponse(200, { hospitals }, 'Hospitals fetched successfully')
            );
        } catch (error: any) {
            console.error('Error in getHospitals:', error);
            return res.status(500).json(
                new ApiResponse(500, null, error.message || 'Failed to fetch hospitals')
            );
        }
    }

    public async getHospital(req: any, res: any) {
        try {
            const id = parseInt(req.params.id);
            const hospital = await this.hospitalService.getHospitalById(id);
            
            if (!hospital) {
                return res.status(404).json(
                    new ApiResponse(404, null, 'Hospital not found')
                );
            }

            return res.status(200).json(
                new ApiResponse(200, { hospital }, 'Hospital fetched successfully')
            );
        } catch (error: any) {
            console.error('Error in getHospital:', error);
            return res.status(500).json(
                new ApiResponse(500, null, error.message || 'Failed to fetch hospital')
            );
        }
    }

    public async updateHospital(req: any, res: any) {
        try {
            const id = parseInt(req.params.id);
            const hospital = await this.hospitalService.updateHospital(id, req.body);
            return res.status(200).json(
                new ApiResponse(200, { hospital }, 'Hospital updated successfully')
            );
        } catch (error: any) {
            console.error('Error in updateHospital:', error);
            return res.status(500).json(
                new ApiResponse(500, null, error.message || 'Failed to update hospital')
            );
        }
    }

    public async deleteHospital(req: any, res: any) {
        try {
            const id = parseInt(req.params.id);
            await this.hospitalService.deleteHospital(id);
            return res.status(200).json(
                new ApiResponse(200, null, 'Hospital deleted successfully')
            );
        } catch (error: any) {
            console.error('Error in deleteHospital:', error);
            return res.status(500).json(
                new ApiResponse(500, null, error.message || 'Failed to delete hospital')
            );
        }
    }

    public async verifyHospital(req: any, res: any) {
        try {
            const id = parseInt(req.params.id);
            const hospital = await this.hospitalService.verifyHospital(id);
            return res.status(200).json(
                new ApiResponse(200, { hospital }, 'Hospital verified successfully')
            );
        } catch (error: any) {
            console.error('Error in verifyHospital:', error);
            return res.status(500).json(
                new ApiResponse(500, null, error.message || 'Failed to verify hospital')
            );
        }
    }

    public async getDoctorsByHospitalandDepartment(req: any, res: any) {
        try {
            const hospitalId = parseInt(req.params.hospitalId);
            const departmentId = parseInt(req.params.departmentId);
            const doctors = await this.hospitalService.getDoctorsByHospitalandDepartment(hospitalId, departmentId);
            return res.status(200).json(
                new ApiResponse(200, { doctors }, 'Doctors fetched successfully')
            );
        } catch (error: any) {
            console.error('Error in getDoctorsByHospitalandDepartment:', error);
            return res.status(500).json(
                new ApiResponse(500, null, error.message || 'Failed to fetch doctors')
            );
        }
    }

    public async getDoctorsByHospital(req: any, res: any) {
        try {
            const hospitalId = parseInt(req.params.hospitalId);
            const doctors = await this.hospitalService.getDoctorsByHospital(hospitalId);
            return res.status(200).json(
                new ApiResponse(200, { doctors }, 'Doctors fetched successfully')
            );
        } catch (error: any) {
            console.error('Error in getDoctorsByHospital:', error);
            return res.status(500).json(
                new ApiResponse(500, null, error.message || 'Failed to fetch doctors')
            );
        }
    }

    public async getVerifiedHospitals(req: any, res: any) {
        try {
            const hospitals = await this.hospitalService.getVerifiedHospitals();
            return res.status(200).json(
                new ApiResponse(200, { hospitals }, 'Verified hospitals fetched successfully')
            );
        } catch (error: any) {
            console.error('Error in getVerifiedHospitals:', error);
            return res.status(500).json(
                new ApiResponse(500, null, error.message || 'Failed to fetch verified hospitals')
            );
        }
    }

    public async getBedsByHospital(req: any, res: any) {
        try {
            const hospitalId = parseInt(req.params.hospitalId);
            const beds = await this.hospitalService.getBedsByHospital(hospitalId);
            return res.status(200).json(
                new ApiResponse(200, { beds }, 'Beds fetched successfully')
            );
        } catch (error: any) {
            console.error('Error in getBedsByHospital:', error);
            return res.status(500).json(
                new ApiResponse(500, null, error.message || 'Failed to fetch beds')
            );
        }
    }

    public async getDepartmentsByHospital(req: any, res: any) {
        try {
            const hospitalId = parseInt(req.params.hospitalId);
            const departments = await this.hospitalService.getDepartmentsByHospital(hospitalId);
            return res.status(200).json(
                new ApiResponse(200, { departments }, 'Departments fetched successfully')
            );
        } catch (error: any) {
            console.error('Error in getDepartmentsByHospital:', error);
            return res.status(500).json(
                new ApiResponse(500, null, error.message || 'Failed to fetch departments')
            );
        }
    }

    public async getRatingsByHospital(req: any, res: any) {
        try {
            const hospitalId = parseInt(req.params.hospitalId);
            const ratings = await this.hospitalService.getRatingsByHospital(hospitalId);
            return res.status(200).json(
                new ApiResponse(200, { ratings }, 'Ratings fetched successfully')
            );
        } catch (error: any) {
            console.error('Error in getRatingsByHospital:', error);
            return res.status(500).json(
                new ApiResponse(500, null, error.message || 'Failed to fetch ratings')
            );
        }
    }

    public async addRating(req: any, res: any) {
        try {
            const hospitalId = parseInt(req.params.hospitalId);
            const rating = await this.hospitalService.addRating(hospitalId, req.body);
            return res.status(201).json(
                new ApiResponse(201, { rating }, 'Rating added successfully')
            );
        } catch (error: any) {
            console.error('Error in addRating:', error);
            return res.status(500).json(
                new ApiResponse(500, null, error.message || 'Failed to add rating')
            );
        }
    }

    public async updateRating(req: any, res: any) {
        try {
            const hospitalId = parseInt(req.params.hospitalId);
            const ratingId = parseInt(req.params.ratingId);
            const rating = await this.hospitalService.updateRating(hospitalId, ratingId, req.body);
            return res.status(200).json(
                new ApiResponse(200, { rating }, 'Rating updated successfully')
            );
        } catch (error: any) {
            console.error('Error in updateRating:', error);
            return res.status(500).json(
                new ApiResponse(500, null, error.message || 'Failed to update rating')
            );
        }
    }

    public async deleteRating(req: any, res: any) {
        try {
            const hospitalId = parseInt(req.params.hospitalId);
            const ratingId = parseInt(req.params.ratingId);
            await this.hospitalService.deleteRating(hospitalId, ratingId);
            return res.status(200).json(
                new ApiResponse(200, null, 'Rating deleted successfully')
            );
        } catch (error: any) {
            console.error('Error in deleteRating:', error);
            return res.status(500).json(
                new ApiResponse(500, null, error.message || 'Failed to delete rating')
            );
        }
    }

    public async getTimeSlots(req: any, res: any) {
        try {
            const hospitalId = parseInt(req.params.hospitalId);
            const timeslots = await this.hospitalService.getTimeSlots(hospitalId);
            return res.status(200).json(
                new ApiResponse(200, { timeslots }, 'Time slots fetched successfully')
            );
        } catch (error: any) {
            console.error('Error in getTimeSlots:', error);
            return res.status(500).json(
                new ApiResponse(500, null, error.message || 'Failed to fetch time slots')
            );
        }
    }

    public async addTimeSlot(req: any, res: any) {
        try {
            const hospitalId = parseInt(req.params.hospitalId);
            const timeslot = await this.hospitalService.addTimeSlot(hospitalId, req.body);
            return res.status(201).json(
                new ApiResponse(201, { timeslot }, 'Time slot added successfully')
            );
        } catch (error: any) {
            console.error('Error in addTimeSlot:', error);
            return res.status(500).json(
                new ApiResponse(500, null, error.message || 'Failed to add time slot')
            );
        }
    }

    public async updateTimeSlot(req: any, res: any) {
        try {
            const hospitalId = parseInt(req.params.hospitalId);
            const timeslotId = parseInt(req.params.timeslotId);
            const timeslot = await this.hospitalService.updateTimeSlot(hospitalId, timeslotId, req.body);
            return res.status(200).json(
                new ApiResponse(200, { timeslot }, 'Time slot updated successfully')
            );
        } catch (error: any) {
            console.error('Error in updateTimeSlot:', error);
            return res.status(500).json(
                new ApiResponse(500, null, error.message || 'Failed to update time slot')
            );
        }
    }

    public async deleteTimeSlot(req: any, res: any) {
        try {
            const hospitalId = parseInt(req.params.hospitalId);
            const timeslotId = parseInt(req.params.timeslotId);
            await this.hospitalService.deleteTimeSlot(hospitalId, timeslotId);
            return res.status(200).json(
                new ApiResponse(200, null, 'Time slot deleted successfully')
            );
        } catch (error: any) {
            console.error('Error in deleteTimeSlot:', error);
            return res.status(500).json(
                new ApiResponse(500, null, error.message || 'Failed to delete time slot')
            );
        }
    }

    public async getAvailability(req: any, res: any) {
        try {
            const hospitalId = parseInt(req.params.hospitalId);
            const { date } = req.params;
            
            if (!date) {
                return res.status(400).json(
                    new ApiResponse(400, null, 'Date is required')
                );
            }

            const availability = await this.hospitalService.getAvailability(hospitalId, date);
            return res.status(200).json(
                new ApiResponse(200, { availability }, 'Availability fetched successfully')
            );
        } catch (error: any) {
            console.error('Error in getAvailability:', error);
            return res.status(500).json(
                new ApiResponse(500, null, error.message || 'Failed to fetch availability')
            );
        }
    }

    public async getAvailableTimeSlots(req: any, res: any) {
        try {
            const hospitalId = parseInt(req.params.hospitalId);
            const { date } = req.params;
            
            if (!date) {
                return res.status(400).json(
                    new ApiResponse(400, null, 'Date is required')
                );
            }

            const availableTimeSlots = await this.hospitalService.getAvailableTimeSlots(hospitalId, date);
            return res.status(200).json(
                new ApiResponse(200, { availableTimeSlots }, 'Available time slots fetched successfully')
            );
        } catch (error: any) {
            console.error('Error in getAvailableTimeSlots:', error);
            return res.status(500).json(
                new ApiResponse(500, null, error.message || 'Failed to fetch available time slots')
            );
        }
    }

    public async addDepartment(req: any, res: any) {
        try {
            const hospitalId = parseInt(req.params.hospitalId);
            const departmentData = req.body;

            if (!departmentData.name) {
                return res.status(400).json(
                    new ApiResponse(400, null, 'Department name is required')
                );
            }

            const department = await this.hospitalService.addDepartmentToHospital(hospitalId, departmentData);
            return res.status(201).json(
                new ApiResponse(201, { department }, 'Department added successfully')
            );
        } catch (error: any) {
            console.error('Error in addDepartment:', error);
            return res.status(500).json(
                new ApiResponse(500, null, error.message || 'Failed to add department')
            );
        }
    }

    public async updateDepartment(req: any, res: any) {
        try {
            const hospitalId = parseInt(req.params.hospitalId);
            const departmentId = parseInt(req.params.departmentId);
            const departmentData = req.body;

            const department = await this.hospitalService.updateDepartment(hospitalId, departmentId, departmentData);
            return res.status(200).json(
                new ApiResponse(200, { department }, 'Department updated successfully')
            );
        } catch (error: any) {
            console.error('Error in updateDepartment:', error);
            return res.status(500).json(
                new ApiResponse(500, null, error.message || 'Failed to update department')
            );
        }
    }

    public async deleteDepartment(req: any, res: any) {
        try {
            const hospitalId = parseInt(req.params.hospitalId);
            const departmentId = parseInt(req.params.departmentId);

            await this.hospitalService.deleteDepartment(hospitalId, departmentId);
            return res.status(200).json(
                new ApiResponse(200, null, 'Department deleted successfully')
            );
        } catch (error: any) {
            console.error('Error in deleteDepartment:', error);
            return res.status(500).json(
                new ApiResponse(500, null, error.message || 'Failed to delete department')
            );
        }
    }
}
