// import { Request, Response } from 'express';
// import { ApiResponse } from '../utils/ApiResponse';
// import { HospitalService } from '../services/hospital.service';
// import { HospitalRepository } from '../repositories/hospital.repository';
// import cloudinaryService from '../../utils/cloudinaryService';

// export class HospitalController {
//     private hospitalService: HospitalService;
//     private hospitalRepository: HospitalRepository;

//     constructor() {
//         this.hospitalService = new HospitalService();
//         this.hospitalRepository = new HospitalRepository();
//     }

//     public async createHospital(req: Request, res: Response) {
//         try {
//             const { name, address, registrationNumber, contactNumber, adminID } = req.body;

//             if (!name || !address || !registrationNumber || !contactNumber || !adminID) {
//                 return res.status(400).json(
//                     new ApiResponse(400, null, 'Please provide all required details')
//                 );
//             }

//             const reqHospitalData = {
//                 name,
//                 speciality: req.body.speciality,
//                 address,
//                 registrationNumber,
//                 contactNumber,
//                 timings: req.body.timings,
//                 totalBeds: parseInt(req.body.totalBeds),
//                 totalPersonsPerSlot: parseInt(req.body.totalPersonsPerSlot),
//                 timeslots: req.body.timeslots,
//                 hospitalImageUrl: [],
//                 establishedDate: new Date(req.body.establishedDate),
//                 rating: parseFloat(req.body.rating),
//                 isVerified: req.body.isVerified,
//                 adminID: parseInt(adminID),
//                 timeSlots: JSON.parse(req.body.opdTimeslots),
//             };

//             const imageFiles = req.files as Express.Multer.File[];
//             if (imageFiles?.length > 0) {
//                 const uploadedImageUrls = await Promise.all(
//                     imageFiles.map(file => 
//                         cloudinaryService.uploadImage(file.buffer, `${name}-${Date.now()}`)
//                     )
//                 );
//                 reqHospitalData.hospitalImageUrl = uploadedImageUrls.map((result: { secure_url: string }) => result.secure_url);
//             }

//             const hospital = await this.hospitalRepository.createHospital(reqHospitalData);
//             return res.status(201).json(
//                 new ApiResponse(201, { hospital }, 'Hospital registered successfully')
//             );
//         } catch (error: any) {
//             console.error('Error in createHospital:', error);
//             return res.status(500).json(
//                 new ApiResponse(500, null, error.message || 'Failed to create hospital')
//             );
//         }
//     }

//     public async getHospitals(req: Request, res: Response) {
//         try {
//             const hospitals = await this.hospitalService.getHospitals(req.query);
//             return res.status(200).json(
//                 new ApiResponse(200, { hospitals }, 'Hospitals fetched successfully')
//             );
//         } catch (error: any) {
//             console.error('Error in getHospitals:', error);
//             return res.status(500).json(
//                 new ApiResponse(500, null, error.message || 'Failed to fetch hospitals')
//             );
//         }
//     }

//     public async getHospital(req: Request, res: Response) {
//         try {
//             const id = parseInt(req.params.id);
//             const hospital = await this.hospitalRepository.getHospitalById(id);
            
//             if (!hospital) {
//                 return res.status(404).json(
//                     new ApiResponse(404, null, 'Hospital not found')
//                 );
//             }

//             return res.status(200).json(
//                 new ApiResponse(200, { hospital }, 'Hospital fetched successfully')
//             );
//         } catch (error: any) {
//             console.error('Error in getHospital:', error);
//             return res.status(500).json(
//                 new ApiResponse(500, null, error.message || 'Failed to fetch hospital')
//             );
//         }
//     }

//     public async updateHospital(req: Request, res: Response) {
//         try {
//             const id = parseInt(req.params.id);
//             const hospital = await this.hospitalService.updateHospital(id, req.body);
//             return res.status(200).json(
//                 new ApiResponse(200, { hospital }, 'Hospital updated successfully')
//             );
//         } catch (error: any) {
//             console.error('Error in updateHospital:', error);
//             return res.status(500).json(
//                 new ApiResponse(500, null, error.message || 'Failed to update hospital')
//             );
//         }
//     }

//     public async deleteHospital(req: Request, res: Response) {
//         try {
//             const id = req.params.id;
//             await this.hospitalService.deleteHospital(id);
//             return res.status(200).json(
//                 new ApiResponse(200, null, 'Hospital deleted successfully')
//             );
//         } catch (error: any) {
//             console.error('Error in deleteHospital:', error);
//             return res.status(500).json(
//                 new ApiResponse(500, null, error.message || 'Failed to delete hospital')
//             );
//         }
//     }

//     public async verifyHospital(req: Request, res: Response) {
//         try {
//             const id = req.params.id;
//             const hospital = await this.hospitalService.verifyHospital(id);
//             return res.status(200).json(
//                 new ApiResponse(200, { hospital }, 'Hospital verified successfully')
//             );
//         } catch (error: any) {
//             console.error('Error in verifyHospital:', error);
//             return res.status(500).json(
//                 new ApiResponse(500, null, error.message || 'Failed to verify hospital')
//             );
//         }
//     }

//     public async getDoctorsByHospitalandDepartment(req: Request, res: Response) {
//         try {
//             const { hospitalId, departmentId } = req.params;
//             const doctors = await this.hospitalService.getDoctorsByHospitalandDepartment(hospitalId, departmentId);
//             return res.status(200).json(
//                 new ApiResponse(200, { doctors }, 'Doctors fetched successfully')
//             );
//         } catch (error: any) {
//             console.error('Error in getDoctorsByHospitalandDepartment:', error);
//             return res.status(500).json(
//                 new ApiResponse(500, null, error.message || 'Failed to fetch doctors')
//             );
//         }
//     }

//     public async getDoctorsByHospital(req: Request, res: Response) {
//         try {
//             const { hospitalId } = req.params;
//             const doctors = await this.hospitalService.getDoctorsByHospital(hospitalId);
//             return res.status(200).json(
//                 new ApiResponse(200, { doctors }, 'Doctors fetched successfully')
//             );
//         } catch (error: any) {
//             console.error('Error in getDoctorsByHospital:', error);
//             return res.status(500).json(
//                 new ApiResponse(500, null, error.message || 'Failed to fetch doctors')
//             );
//         }
//     }

//     public async getVerifiedHospitals(req: Request, res: Response) {
//         try {
//             const hospitals = await this.hospitalService.getVerifiedHospitals();
//             return res.status(200).json(
//                 new ApiResponse(200, { hospitals }, 'Verified hospitals fetched successfully')
//             );
//         } catch (error: any) {
//             console.error('Error in getVerifiedHospitals:', error);
//             return res.status(500).json(
//                 new ApiResponse(500, null, error.message || 'Failed to fetch verified hospitals')
//             );
//         }
//     }

//     public async getBedsByHospital(req: Request, res: Response) {
//         try {
//             const { hospitalId } = req.params;
//             const beds = await this.hospitalService.getBedsByHospital(hospitalId);
//             return res.status(200).json(
//                 new ApiResponse(200, { beds }, 'Beds fetched successfully')
//             );
//         } catch (error: any) {
//             console.error('Error in getBedsByHospital:', error);
//             return res.status(500).json(
//                 new ApiResponse(500, null, error.message || 'Failed to fetch beds')
//             );
//         }
//     }

//     public async getDepartmentsByHospital(req: Request, res: Response) {
//         try {
//             const hospitalId = parseInt(req.params.hospitalId);
//             const departments = await this.hospitalService.getDepartmentsByHospital(hospitalId);
//             return res.status(200).json(
//                 new ApiResponse(200, { departments }, 'Departments fetched successfully')
//             );
//         } catch (error: any) {
//             console.error('Error in getDepartmentsByHospital:', error);
//             return res.status(500).json(
//                 new ApiResponse(500, null, error.message || 'Failed to fetch departments')
//             );
//         }
//     }

//     public async getRatingsByHospital(req: Request, res: Response) {
//         try {
//             const { hospitalId } = req.params;
//             const ratings = await this.hospitalService.getRatingsByHospital(hospitalId);
//             return res.status(200).json(
//                 new ApiResponse(200, { ratings }, 'Ratings fetched successfully')
//             );
//         } catch (error: any) {
//             console.error('Error in getRatingsByHospital:', error);
//             return res.status(500).json(
//                 new ApiResponse(500, null, error.message || 'Failed to fetch ratings')
//             );
//         }
//     }

//     public async addRating(req: Request, res: Response) {
//         try {
//             const { hospitalId } = req.params;
//             const rating = await this.hospitalService.addRating(hospitalId, req.body);
//             return res.status(201).json(
//                 new ApiResponse(201, { rating }, 'Rating added successfully')
//             );
//         } catch (error: any) {
//             console.error('Error in addRating:', error);
//             return res.status(500).json(
//                 new ApiResponse(500, null, error.message || 'Failed to add rating')
//             );
//         }
//     }

//     public async updateRating(req: Request, res: Response) {
//         try {
//             const { hospitalId, ratingId } = req.params;
//             const rating = await this.hospitalService.updateRating(hospitalId, ratingId, req.body);
//             return res.status(200).json(
//                 new ApiResponse(200, { rating }, 'Rating updated successfully')
//             );
//         } catch (error: any) {
//             console.error('Error in updateRating:', error);
//             return res.status(500).json(
//                 new ApiResponse(500, null, error.message || 'Failed to update rating')
//             );
//         }
//     }

//     public async deleteRating(req: Request, res: Response) {
//         try {
//             const { hospitalId, ratingId } = req.params;
//             await this.hospitalService.deleteRating(hospitalId, ratingId);
//             return res.status(200).json(
//                 new ApiResponse(200, null, 'Rating deleted successfully')
//             );
//         } catch (error: any) {
//             console.error('Error in deleteRating:', error);
//             return res.status(500).json(
//                 new ApiResponse(500, null, error.message || 'Failed to delete rating')
//             );
//         }
//     }

//     public async getTimeSlots(req: Request, res: Response) {
//         try {
//             const hospitalId = parseInt(req.params.hospitalId);
//             const timeslots = await this.hospitalService.getTimeSlots(hospitalId);
//             return res.status(200).json(
//                 new ApiResponse(200, { timeslots }, 'Time slots fetched successfully')
//             );
//         } catch (error: any) {
//             console.error('Error in getTimeSlots:', error);
//             return res.status(500).json(
//                 new ApiResponse(500, null, error.message || 'Failed to fetch time slots')
//             );
//         }
//     }

//     public async addTimeSlot(req: Request, res: Response) {
//         try {
//             const hospitalId = parseInt(req.params.hospitalId);
//             const timeslot = await this.hospitalService.addTimeSlot(hospitalId, req.body);
//             return res.status(201).json(
//                 new ApiResponse(201, { timeslot }, 'Time slot added successfully')
//             );
//         } catch (error: any) {
//             console.error('Error in addTimeSlot:', error);
//             return res.status(500).json(
//                 new ApiResponse(500, null, error.message || 'Failed to add time slot')
//             );
//         }
//     }

//     public async updateTimeSlot(req: Request, res: Response) {
//         try {
//             const { hospitalId, timeslotId } = req.params;
//             const timeslot = await this.hospitalService.updateTimeSlot(hospitalId, timeslotId, req.body);
//             return res.status(200).json(
//                 new ApiResponse(200, { timeslot }, 'Time slot updated successfully')
//             );
//         } catch (error: any) {
//             console.error('Error in updateTimeSlot:', error);
//             return res.status(500).json(
//                 new ApiResponse(500, null, error.message || 'Failed to update time slot')
//             );
//         }
//     }

//     public async deleteTimeSlot(req: Request, res: Response) {
//         try {
//             const { hospitalId, timeslotId } = req.params;
//             await this.hospitalService.deleteTimeSlot(hospitalId, timeslotId);
//             return res.status(200).json(
//                 new ApiResponse(200, null, 'Time slot deleted successfully')
//             );
//         } catch (error: any) {
//             console.error('Error in deleteTimeSlot:', error);
//             return res.status(500).json(
//                 new ApiResponse(500, null, error.message || 'Failed to delete time slot')
//             );
//         }
//     }

//     public async getAvailability(req: Request, res: Response) {
//         try {
//             const hospitalId = parseInt(req.params.hospitalId);
//             const { date } = req.params;
            
//             if (!date) {
//                 return res.status(400).json(
//                     new ApiResponse(400, null, 'Date is required')
//                 );
//             }

//             const availability = await this.hospitalService.getAvailability(hospitalId, date);
//             return res.status(200).json(
//                 new ApiResponse(200, { availability }, 'Availability fetched successfully')
//             );
//         } catch (error: any) {
//             console.error('Error in getAvailability:', error);
//             return res.status(500).json(
//                 new ApiResponse(500, null, error.message || 'Failed to fetch availability')
//             );
//         }
//     }

//     public async getAvailableTimeSlots(req: Request, res: Response) {
//         try {
//             const hospitalId = parseInt(req.params.hospitalId);
//             const { date } = req.params;
            
//             if (!date) {
//                 return res.status(400).json(
//                     new ApiResponse(400, null, 'Date is required')
//                 );
//             }

//             const availableTimeSlots = await this.hospitalService.getAvailableTimeSlots(hospitalId, date);
//             return res.status(200).json(
//                 new ApiResponse(200, { availableTimeSlots }, 'Available time slots fetched successfully')
//             );
//         } catch (error: any) {
//             console.error('Error in getAvailableTimeSlots:', error);
//             return res.status(500).json(
//                 new ApiResponse(500, null, error.message || 'Failed to fetch available time slots')
//             );
//         }
//     }
// }
