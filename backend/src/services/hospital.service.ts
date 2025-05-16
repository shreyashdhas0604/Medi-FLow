import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class HospitalService {
    constructor() {}

    public async createHospital(hospitalData: any): Promise<any> {
        try {
            const newHospital = await prisma.hospital.create({
                data: hospitalData
            });
            return newHospital;
        } catch (error: any) {
            console.error("Error in createHospital Service:", error);
            throw new Error(`Failed to create hospital: ${error.message}`);
        }
    }

    public async getHospitals(query: any = {}): Promise<any> {
        try {
            const hospitals = await prisma.hospital.findMany(query);
            return hospitals;
        } catch (error: any) {
            console.error("Error in getHospitals Service:", error);
            throw new Error(`Failed to fetch hospitals: ${error.message}`);
        }
    }

    public async getHospitalById(id: number): Promise<any> {
        try {
            const hospital = await prisma.hospital.findUnique({
                where: { id }
            });
            
            if (!hospital) {
                throw new Error("Hospital not found");
            }
            
            return hospital;
        } catch (error: any) {
            console.error("Error in getHospitalById Service:", error);
            throw new Error(`Failed to fetch hospital: ${error.message}`);
        }
    }

    public async updateHospital(id: number, hospitalData: any): Promise<any> {
        try {
            const hospital = await prisma.hospital.findUnique({
                where: { id }
            });
            
            if (!hospital) {
                throw new Error("Hospital not found");
            }
            
            const updatedHospital = await prisma.hospital.update({
                where: { id },
                data: hospitalData
            });
            
            return updatedHospital;
        } catch (error: any) {
            console.error("Error in updateHospital Service:", error);
            throw new Error(`Failed to update hospital: ${error.message}`);
        }
    }

    public async deleteHospital(id: number): Promise<any> {
        try {
            const hospital = await prisma.hospital.findUnique({
                where: { id }
            });
            
            if (!hospital) {
                throw new Error("Hospital not found");
            }
            
            const deletedHospital = await prisma.hospital.delete({
                where: { id }
            });
            
            return deletedHospital;
        } catch (error: any) {
            console.error("Error in deleteHospital Service:", error);
            throw new Error(`Failed to delete hospital: ${error.message}`);
        }
    }

    public async verifyHospital(id: number): Promise<any> {
        try {
            const hospital = await prisma.hospital.findUnique({
                where: { id }
            });
            
            if (!hospital) {
                throw new Error("Hospital not found");
            }
            
            const verifiedHospital = await prisma.hospital.update({
                where: { id },
                data: { isVerified: "approved" }
            });
            
            return verifiedHospital;
        } catch (error: any) {
            console.error("Error in verifyHospital Service:", error);
            throw new Error(`Failed to verify hospital: ${error.message}`);
        }
    }

    public async getDoctorsByHospitalandDepartment(hospitalId: number, departmentId: number): Promise<any> {
        try {
            // First check if hospital exists
            const hospital = await prisma.hospital.findUnique({
                where: { id: hospitalId }
            });
            
            if (!hospital) {
                throw new Error("Hospital not found");
            }
            
            // Check if department exists
            const department = await prisma.department.findUnique({
                where: { id: departmentId }
            });
            
            if (!department) {
                throw new Error("Department not found");
            }
            
            const doctors = await prisma.doctor.findMany({
                where: {
                    hospitalID: hospitalId,
                    departmentId: departmentId
                }
            });
            
            return doctors;
        } catch (error: any) {
            console.error("Error in getDoctorsByHospitalandDepartment Service:", error);
            throw new Error(`Failed to fetch doctors: ${error.message}`);
        }
    }

    public async getDoctorsByHospital(hospitalId: number): Promise<any> {
        try {
            const hospital = await prisma.hospital.findUnique({
                where: { id: hospitalId },
                include: {
                    doctors: true
                }
            });
            
            if (!hospital) {
                throw new Error("Hospital not found");
            }
            
            return hospital.doctors;
        } catch (error: any) {
            console.error("Error in getDoctorsByHospital Service:", error);
            throw new Error(`Failed to fetch doctors: ${error.message}`);
        }
    }

    public async getVerifiedHospitals(): Promise<any> {
        try {
            const hospitals = await prisma.hospital.findMany({
                where: { isVerified: "approved" }
            });
            
            return hospitals;
        } catch (error: any) {
            console.error("Error in getVerifiedHospitals Service:", error);
            throw new Error(`Failed to fetch verified hospitals: ${error.message}`);
        }
    }

    public async getBedsByHospital(hospitalId: number): Promise<any> {
        try {
            const hospital = await prisma.hospital.findUnique({
                where: { id: hospitalId },
                include: {
                    beds: true
                }
            });
            
            if (!hospital) {
                throw new Error("Hospital not found");
            }
            
            return hospital.beds;
        } catch (error: any) {
            console.error("Error in getBedsByHospital Service:", error);
            throw new Error(`Failed to fetch beds: ${error.message}`);
        }
    }

    public async getDepartmentsByHospital(hospitalId: number): Promise<any> {
        try {
            const hospital = await prisma.hospital.findUnique({
                where: { id: hospitalId },
                include: {
                    departments: true
                }
            });
            
            if (!hospital) {
                throw new Error("Hospital not found");
            }
            
            return hospital.departments;
        } catch (error: any) {
            console.error("Error in getDepartmentsByHospital Service:", error);
            throw new Error(`Failed to fetch departments: ${error.message}`);
        }
    }

    public async getRatingsByHospital(hospitalId: number): Promise<any> {
        try {
            const hospital = await prisma.hospital.findUnique({
                where: { id: hospitalId },
                include: {
                    ratings: true
                }
            });
            
            if (!hospital) {
                throw new Error("Hospital not found");
            }
            
            return hospital.ratings;
        } catch (error: any) {
            console.error("Error in getRatingsByHospital Service:", error);
            throw new Error(`Failed to fetch ratings: ${error.message}`);
        }
    }

    public async addRating(hospitalId: number, ratingData: any): Promise<any> {
        try {
            const hospital = await prisma.hospital.findUnique({
                where: { id: hospitalId }
            });
            
            if (!hospital) {
                throw new Error("Hospital not found");
            }
            
            const newRating = await prisma.rating.create({
                data: {
                    hospitalID: hospitalId,  // Changed from hospitalId to hospitalID
                    ...ratingData
                }
            });
            
            await this.updateHospitalAverageRating(hospitalId);
            return newRating;
        } catch (error: any) {
            console.error("Error in addRating Service:", error);
            throw new Error(`Failed to add rating: ${error.message}`);
        }
    }

    private async updateHospitalAverageRating(hospitalId: number): Promise<void> {
        try {
            const ratings = await prisma.rating.findMany({
                where: { hospitalID: hospitalId }  // Changed from hospitalId to hospitalID
            });
            
            if (ratings.length === 0) {
                await prisma.hospital.update({
                    where: { id: hospitalId },
                    data: { rating: 0 }
                });
                return;
            }
            
            const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0); // Changed from value to rating
            const averageRating = totalRating / ratings.length;
            
            await prisma.hospital.update({
                where: { id: hospitalId },
                data: { rating: averageRating }
            });
        } catch (error: any) {
            console.error("Error in updateHospitalAverageRating Service:", error);
            throw new Error(`Failed to update hospital average rating: ${error.message}`);
        }
    }

    public async getTimeSlots(hospitalId: number): Promise<any> {
        try {
            // Check if hospital exists
            const hospital = await prisma.hospital.findUnique({
                where: { id: hospitalId }
            });
            
            if (!hospital) {
                throw new Error("Hospital not found");
            }
            
            const timeslots = await prisma.timeslot.findMany({
                where: {
                    hospitalID: hospitalId,
                    availableCount: { gt: 0 }
                },
                orderBy: {
                    date: 'asc'
                }
            });
            
            return timeslots;
        } catch (error: any) {
            console.error("Error in getTimeSlots Service:", error);
            throw new Error(`Failed to fetch time slots: ${error.message}`);
        }
    }

    public async addTimeSlot(hospitalId: number, timeSlotData: any): Promise<any> {
        try {
            // Check if hospital exists
            const hospital = await prisma.hospital.findUnique({
                where: { id: hospitalId }
            });
            
            if (!hospital) {
                throw new Error("Hospital not found");
            }
            
            const { date, time, availableCount, uniqueIdentifier } = timeSlotData;
            const slotdate = new Date(date).toISOString();
            
            // Create a unique identifier if one isn't provided
            const slotIdentifier = uniqueIdentifier || `${hospitalId}-${slotdate}-${time}`;
            
            const updateOrCreateTimeslot = await prisma.timeslot.upsert({
                where: { uniqueIdentifier: slotIdentifier },
                update: {
                    availableCount
                },
                create: {
                    hospitalID: hospitalId,
                    date: slotdate,
                    time,
                    availableCount,
                    uniqueIdentifier: slotIdentifier
                }
            });
            
            return updateOrCreateTimeslot;
        } catch (error: any) {
            console.error("Error in addTimeSlot Service:", error);
            throw new Error(`Failed to add time slot: ${error.message}`);
        }
    }

    public async updateTimeSlot(hospitalId: number, timeSlotId: number, timeSlotData: any): Promise<any> {
        try {
            // Check if hospital exists
            const hospital = await prisma.hospital.findUnique({
                where: { id: hospitalId }
            });
            
            if (!hospital) {
                throw new Error("Hospital not found");
            }
            
            // Check if timeslot exists and belongs to this hospital
            const timeslot = await prisma.timeslot.findFirst({
                where: { 
                    id: timeSlotId,
                    hospitalID: hospitalId
                }
            });
            
            if (!timeslot) {
                throw new Error("Time slot not found or does not belong to this hospital");
            }
            
            const updatedTimeSlot = await prisma.timeslot.update({
                where: { id: timeSlotId },
                data: timeSlotData
            });
            
            return updatedTimeSlot;
        } catch (error: any) {
            console.error("Error in updateTimeSlot Service:", error);
            throw new Error(`Failed to update time slot: ${error.message}`);
        }
    }

    public async deleteTimeSlot(hospitalId: number, timeSlotId: number): Promise<any> {
        try {
            // Check if hospital exists
            const hospital = await prisma.hospital.findUnique({
                where: { id: hospitalId }
            });
            
            if (!hospital) {
                throw new Error("Hospital not found");
            }
            
            // Check if timeslot exists and belongs to this hospital
            const timeslot = await prisma.timeslot.findFirst({
                where: { 
                    id: timeSlotId,
                    hospitalID: hospitalId
                }
            });
            
            if (!timeslot) {
                throw new Error("Time slot not found or does not belong to this hospital");
            }
            
            const deletedTimeSlot = await prisma.timeslot.delete({
                where: { id: timeSlotId }
            });
            
            return deletedTimeSlot;
        } catch (error: any) {
            console.error("Error in deleteTimeSlot Service:", error);
            throw new Error(`Failed to delete time slot: ${error.message}`);
        }
    }

    public async getAvailability(hospitalId: number, date: string): Promise<any> {
        try {
            // Check if hospital exists
            const hospital = await prisma.hospital.findUnique({
                where: { id: hospitalId }
            });
            
            if (!hospital) {
                throw new Error("Hospital not found");
            }
            
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(startDate.getDate() + 1);
            
            const availability = await prisma.timeslot.findMany({
                where: {
                    hospitalID: hospitalId,
                    date: {
                        gte: startDate,
                        lt: endDate,
                    },
                },
                orderBy: {
                    time: 'asc'
                }
            });
            
            return availability;
        } catch (error: any) {
            console.error("Error in getAvailability Service:", error);
            throw new Error(`Failed to fetch availability: ${error.message}`);
        }
    }

    public async getAvailableTimeSlots(hospitalId: number, selectedDate: string): Promise<any> {
        try {
            // Check if hospital exists
            const hospital = await prisma.hospital.findUnique({
                where: { id: hospitalId },
                select: { timeSlots: true, totalPersonsPerSlot: true },
            });
            
            if (!hospital) {
                throw new Error("Hospital not found");
            }
            
            const date = new Date(selectedDate);
            
            const existingTimeslots = await prisma.timeslot.findMany({
                where: {
                    hospitalID: hospitalId,
                    date: date,
                },
            });
            
            const timeslotMap = new Map(
                existingTimeslots.map((slot) => [slot.time, slot.availableCount])
            );
            
            const availableSlots = hospital.timeSlots.map((time) => ({
                time,
                availableCount: timeslotMap.get(time) ?? hospital.totalPersonsPerSlot,
                date: selectedDate
            }));
            
            return availableSlots;
        } catch (error: any) {
            console.error("Error in getAvailableTimeSlots Service:", error);
            throw new Error(`Failed to fetch available time slots: ${error.message}`);
        }
    }

    public async updateRating(hospitalId: number, ratingId: number, ratingData: any): Promise<any> {
        try {
            const hospital = await prisma.hospital.findUnique({
                where: { id: hospitalId }
            });
            
            if (!hospital) {
                throw new Error("Hospital not found");
            }

            const rating = await prisma.rating.findFirst({
                where: { 
                    id: ratingId,
                    hospitalID: hospitalId
                }
            });

            if (!rating) {
                throw new Error("Rating not found or does not belong to this hospital");
            }

            const updatedRating = await prisma.rating.update({
                where: { id: ratingId },
                data: ratingData
            });

            await this.updateHospitalAverageRating(hospitalId);
            return updatedRating;
        } catch (error: any) {
            console.error("Error in updateRating Service:", error);
            throw new Error(`Failed to update rating: ${error.message}`);
        }
    }

    public async deleteRating(hospitalId: number, ratingId: number): Promise<any> {
        try {
            const hospital = await prisma.hospital.findUnique({
                where: { id: hospitalId }
            });
            
            if (!hospital) {
                throw new Error("Hospital not found");
            }

            const rating = await prisma.rating.findFirst({
                where: { 
                    id: ratingId,
                    hospitalID: hospitalId
                }
            });

            if (!rating) {
                throw new Error("Rating not found or does not belong to this hospital");
            }

            const deletedRating = await prisma.rating.delete({
                where: { id: ratingId }
            });

            await this.updateHospitalAverageRating(hospitalId);
            return deletedRating;
        } catch (error: any) {
            console.error("Error in deleteRating Service:", error);
            throw new Error(`Failed to delete rating: ${error.message}`);
        }
    }
}