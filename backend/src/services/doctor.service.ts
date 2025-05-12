import { PrismaClient, Doctor, User, Department, Hospital } from '@prisma/client';
import { ApiResponse } from "../utils/ApiResponse";

const prisma = new PrismaClient();

// Update DoctorData interface to match schema
interface DoctorData {
    userID: number;          // matches schema
    specialization: string;  // matches schema
    qualification: string;   // matches schema
    experience: number;      // matches schema
    hospitalID: number;      // matches schema casing
    departmentId: number;    // matches schema casing
    isAvailable: boolean;    // matches schema
}

interface RatingData {
    rating: number;
    comment?: string;
    userId: number;
    doctorId: number;
}

export class DoctorService {
    public async createDoctor(doctorData: DoctorData): Promise<ApiResponse> {
        try {
            const { userID, specialization, qualification, experience, hospitalID, departmentId } = doctorData;
            
            if (!userID || !specialization || !qualification || !experience || !hospitalID || !departmentId) {
                return new ApiResponse(400, {}, "Please provide all required details");
            }

            const doctor = await prisma.doctor.create({
                data: {
                    ...doctorData,
                    hospitalID: parseInt(String(hospitalID)),
                    departmentId: parseInt(String(departmentId)),
                    experience: parseInt(String(experience))
                },
                include: {
                    user: true,
                    department: true,
                    hospital: true
                }
            });

            return new ApiResponse(201, { doctor }, "Doctor registered successfully");
        } catch (error: any) {
            console.error("Error in createDoctor Service:", error);
            return new ApiResponse(500, {}, error.message || "Failed to create doctor");
        }
    }

    public async getDoctorsByDepartment(departmentId: number): Promise<ApiResponse> {
        try {
            const doctors = await prisma.doctor.findMany({
                where: { departmentId },
                include: {
                    user: true,
                    department: true,
                    hospital: true
                }
            });

            return new ApiResponse(200, { doctors }, "Doctors fetched successfully");
        } catch (error: any) {
            console.error("Error in getDoctorsByDepartment Service:", error);
            return new ApiResponse(500, {}, error.message || "Failed to fetch doctors");
        }
    }

    public async getDoctorsByHospital(hospitalId: number): Promise<ApiResponse> {
        try {
            const doctors = await prisma.doctor.findMany({
                where: { hospitalID: hospitalId },
                include: {
                    user: true,
                    department: true,
                    hospital: true
                }
            });

            return new ApiResponse(200, { doctors }, "Doctors fetched successfully");
        } catch (error: any) {
            console.error("Error in getDoctorsByHospital Service:", error);
            return new ApiResponse(500, {}, error.message || "Failed to fetch doctors");
        }
    }

    public async getDoctorsByAvailability(availability: boolean): Promise<ApiResponse> {
        try {
            const doctors = await prisma.doctor.findMany({
                where: { isAvailable: availability },
                include: {
                    user: true,
                    department: true,
                    hospital: true
                }
            });

            return new ApiResponse(200, { doctors }, "Doctors fetched successfully");
        } catch (error: any) {
            console.error("Error in getDoctorsByAvailability Service:", error);
            return new ApiResponse(500, {}, error.message || "Failed to fetch doctors");
        }
    }

    // Update getDoctor method to use correct ID field
    public async getDoctor(id: number): Promise<ApiResponse> {
        try {
            const doctor = await prisma.doctor.findUnique({
                where: { id }, // This is correct as per schema
                include: {
                    user: true,
                    department: true,
                    hospital: true,
                    ratings: true,
                    registrations: true
                }
            });

            if (!doctor) {
                return new ApiResponse(404, {}, "Doctor not found");
            }

            return new ApiResponse(200, { doctor }, "Doctor fetched successfully");
        } catch (error: any) {
            console.error("Error in getDoctor Service:", error);
            return new ApiResponse(500, {}, error.message || "Failed to fetch doctor");
        }
    }

    // Update updateDoctor method to use correct ID field
    public async updateDoctor(id: number, updateData: Partial<DoctorData>): Promise<ApiResponse> {
        try {
            const doctor = await prisma.doctor.update({
                where: { id }, // Should use id instead of userID
                data: updateData,
                include: {
                    user: true,
                    department: true,
                    hospital: true
                }
            });

            return new ApiResponse(200, { doctor }, "Doctor updated successfully");
        } catch (error: any) {
            console.error("Error in updateDoctor Service:", error);
            return new ApiResponse(500, {}, error.message || "Failed to update doctor");
        }
    }

    // Update deleteDoctor method to use correct ID field
    public async deleteDoctor(id: number): Promise<ApiResponse> {
        try {
            const doctor = await prisma.doctor.delete({
                where: { id }, // Should use id instead of userID
                include: {
                    user: true
                }
            });

            return new ApiResponse(200, { doctor }, "Doctor deleted successfully");
        } catch (error: any) {
            console.error("Error in deleteDoctor Service:", error);
            return new ApiResponse(500, {}, error.message || "Failed to delete doctor");
        }
    }

    public async getRatings(doctorId: number): Promise<ApiResponse> {
        try {
            const ratings = await prisma.rating.findMany({
                where: { doctorID: doctorId }, // Changed doctorId to doctorID
                include: {
                    user: true
                }
            });

            return new ApiResponse(200, { ratings }, "Ratings fetched successfully");
        } catch (error: any) {
            console.error("Error in getRatings Service:", error);
            return new ApiResponse(500, {}, error.message || "Failed to fetch ratings");
        }
    }

    public async addRating(doctorId: number, ratingData: RatingData): Promise<ApiResponse> {
        try {
            const rating = await prisma.rating.create({
                data: {
                    ...ratingData,
                    doctorID: doctorId, // Changed doctorId to doctorID
                    userID: ratingData.userId // Changed userId to userID
                },
                include: {
                    user: true,
                    doctor: true
                }
            });

            return new ApiResponse(201, { rating }, "Rating added successfully");
        } catch (error: any) {
            console.error("Error in addRating Service:", error);
            return new ApiResponse(500, {}, error.message || "Failed to add rating");
        }
    }

    public async updateRating(ratingId: number, updateData: Partial<RatingData>): Promise<ApiResponse> {
        try {
            const rating = await prisma.rating.update({
                where: { id: ratingId },
                data: updateData,
                include: {
                    user: true,
                    doctor: true
                }
            });

            return new ApiResponse(200, { rating }, "Rating updated successfully");
        } catch (error: any) {
            console.error("Error in updateRating Service:", error);
            return new ApiResponse(500, {}, error.message || "Failed to update rating");
        }
    }

    public async deleteRating(ratingId: number, userId: number): Promise<ApiResponse> {
        try {
            const rating = await prisma.rating.delete({
                where: {
                    id: ratingId,
                    userID: userId // Changed userId to userID
                }
            });

            return new ApiResponse(200, { rating }, "Rating deleted successfully");
        } catch (error: any) {
            console.error("Error in deleteRating Service:", error);
            return new ApiResponse(500, {}, error.message || "Failed to delete rating");
        }
    }

    public async getOPDRegistrations(doctorId: number): Promise<ApiResponse> {
        try {
            const registrations = await prisma.oPDRegistration.findMany({ // Changed registration to oPDRegistration
                where: { doctorID: doctorId }, // Changed doctorId to doctorID
                include: {
                    patient: true,
                    doctor: {
                        include: {
                            user: true
                        }
                    }
                }
            });

            return new ApiResponse(200, { registrations }, "OPD registrations fetched successfully");
        } catch (error: any) {
            console.error("Error in getOPDRegistrations Service:", error);
            return new ApiResponse(500, {}, error.message || "Failed to fetch OPD registrations");
        }
    }

    // Add after getOPDRegistrations method
    public async getAllDoctors(): Promise<ApiResponse> {
        try {
            const doctors = await prisma.doctor.findMany({
                include: {
                    user: true,
                    department: true,
                    hospital: true,
                    ratings: true
                }
            });

            return new ApiResponse(200, { doctors }, "All doctors fetched successfully");
        } catch (error: any) {
            console.error("Error in getAllDoctors Service:", error);
            return new ApiResponse(500, {}, error.message || "Failed to fetch doctors");
        }
    }

    public async getDoctorsBySpeciality(specialization: string): Promise<ApiResponse> {
        try {
            const doctors = await prisma.doctor.findMany({
                where: { specialization },
                include: {
                    user: true,
                    department: true,
                    hospital: true,
                    ratings: true
                }
            });

            return new ApiResponse(200, { doctors }, "Doctors fetched successfully");
        } catch (error: any) {
            console.error("Error in getDoctorsBySpeciality Service:", error);
            return new ApiResponse(500, {}, error.message || "Failed to fetch doctors");
        }
    }
}