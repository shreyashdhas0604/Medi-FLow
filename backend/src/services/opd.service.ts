import { PrismaClient, PaymentStatus } from "@prisma/client";
import { sendVirtualOpdEmail } from "../utils/emailUtil";

const prisma = new PrismaClient();

interface OPDRegistrationInput {
    patientId: number;
    doctorId: number;
    bedId?: number;
    diagnosis?: string;
    prescription?: string;
    symptoms?: string;
    date?: Date;
    departmentId: number;
    hospitalId: number;
    paymentStatus?: PaymentStatus;
    followUp?: boolean;
    followUpDate?: Date;
    followUpReason?: string;
    followUpPrescription?: string;
    followUpDiagnosis?: string;
    patient: any;
    department: any;
    hospital: any;
}

export class OpdService {
    
    /**
     * Registers a new OPD visit
     * @param opd OPD visit data
     * @returns Created OPD visit or undefined on error
     */
    public async registerOpdVisit(opd: any) {
        try {
            const opdVisit = await prisma.oPDRegistration.create({
                data: {
                    patientID: opd.patientID,
                    doctorID: opd.doctorID,
                    bedID: opd.bedID || null,
                    departmentID: opd.departmentID || null,
                    hospitalID: opd.hospitalID,
                    name: opd.name || null,
                    date: new Date(opd.date).toISOString() || new Date(),
                    paymentStatus: opd.paymentStatus || PaymentStatus.Pending,
                    symptoms: opd.symptoms || null,
                    diagnosis: opd.diagnosis || null,
                    prescription: opd.prescription || null,
                    followUp: opd.followup || false,
                    followUpDate: opd.followUpDate || null,
                    followUpReason: opd.followUpReason || null,
                    followUpPrescription: opd.followUpPrescription || null,
                    followUpDiagnosis: opd.followUpDiagnosis || null,
                    allergies: opd.allergies || null,
                    bloodGroup: opd.bloodGroup || null,
                    weight: opd.weight || 0,
                    OPDTime: opd.OPDTime,
                    isVirtualOPD: opd.isVirtualOPD || false,
                    VirtualOPDDate: opd.VirtualOPDDate || null,
                    VirtualOPDTime: opd.VirtualOPDTime || null,
                    VirtualOPDLink: opd.VirtualOPDLink || null,
                    VirtualOPDRoomName: opd.VirtualOPDRoomName || null,
                },
            });

            // Remove Kafka producer code

            return opdVisit;
        } catch (error: any) {
            console.error("Error in registerOPD: ", error.message);
            return undefined;
        }
    }

    /**
     * Gets an OPD visit by its ID
     * @param id OPD visit ID
     * @returns OPD visit or undefined on error
     */
    public async getOpdVisitById(id: number) {
        try {
            return await prisma.oPDRegistration.findUnique({
                where: { id },
            });
        } catch (error) {
            console.error("Error in getOpdVisitById: ", error);
            return undefined;
        }
    }

    /**
     * Updates an OPD visit
     * @param opd OPD visit data with ID
     * @returns Updated OPD visit or undefined on error
     */
    public async updateOpdVisit(opd: any) {
        try {
            return await prisma.oPDRegistration.update({
                where: { id: opd.id },
                data: {
                    ...opd,
                    date: opd.date || new Date(),
                },
            });
        } catch (error) {
            console.error("Error in updateOpdVisit: ", error);
            return undefined;
        }
    }

    /**
     * Deletes an OPD visit
     * @param id OPD visit ID
     * @returns Deleted OPD visit or undefined on error
     */
    public async deleteOpdVisit(id: number) {
        try {
            return await prisma.oPDRegistration.delete({
                where: { id },
            });
        } catch (error) {
            console.error("Error in deleteOpdVisit: ", error);
            return undefined;
        }
    }

    /**
     * Gets all OPD visits
     * @returns Array of OPD visits or undefined on error
     */
    public async getAllOpdVisits() {
        try {
            return await prisma.oPDRegistration.findMany();
        } catch (error) {
            console.error("Error in getAllOpdVisits: ", error);
            return undefined;
        }
    }

    /**
     * Gets all OPD visits for a patient
     * @param patientId Patient's ID
     * @returns Array of OPD visits or undefined on error
     */
    public async getPatientOpds(patientId: number) {
        try {
            return await prisma.oPDRegistration.findMany({
                where: { patientID: patientId },
            });
        } catch (error) {
            console.error("Error in getPatientOpds: ", error);
            return undefined;
        }
    }

    /**
     * Gets all OPD visits for a doctor
     * @param doctorId Doctor's ID
     * @returns Array of OPD visits or undefined on error
     */
    public async getDoctorOpds(doctorId: number) {
        try {
            return await prisma.oPDRegistration.findMany({
                where: { doctorID: doctorId },
            });
        } catch (error) {
            console.error("Error in getDoctorOpds: ", error);
            return undefined;
        }
    }

    /**
     * Updates payment status of an OPD visit
     * @param id OPD visit ID
     * @param status New payment status
     * @returns Updated OPD visit or undefined on error
     */
    public async updatePaymentStatus(id: number, status: PaymentStatus) {
        try {
            return await prisma.oPDRegistration.update({
                where: { id },
                data: { paymentStatus: status },
            });
        } catch (error) {
            console.error("Error in updatePaymentStatus: ", error);
            return undefined;
        }
    }

    /**
     * Gets all OPD visits between two dates
     * @param from Start date
     * @param to End date
     * @returns Array of OPD visits or undefined on error
     */
    public async getOpdsByDate(from: Date, to: Date) {
        try {
            return await prisma.oPDRegistration.findMany({
                where: {
                    date: {
                        gte: from,
                        lte: to,
                    },
                },
            });
        } catch (error) {
            console.error("Error in getOpdsByDate: ", error);
            return undefined;
        }
    }

    /**
     * Registers a follow-up OPD visit
     * @param opd Follow-up OPD visit data
     * @returns Created follow-up OPD visit or undefined on error
     */
    public async registerFollowUp(opd: any) {
        try {
            // Set followUp to true
            opd.followUp = true;
            
            // Register as a normal OPD visit with followUp flag
            return await this.registerOpdVisit(opd);
        } catch (error) {
            console.error("Error in registerFollowUp: ", error);
            return undefined;
        }
    }

    /**
     * Gets all OPD visits for a department
     * @param departmentId Department's ID
     * @returns Array of OPD visits or undefined on error
     */
    public async getDepartmentOpds(departmentId: number) {
        try {
            return await prisma.oPDRegistration.findMany({
                where: { departmentID: departmentId },
            });
        } catch (error) {
            console.error("Error in getDepartmentOpds: ", error);
            return undefined;
        }
    }

    /**
     * Gets all OPD visits with a specific payment status
     * @param status Payment status
     * @returns Array of OPD visits or undefined on error
     */
    public async getOpdsByPaymentStatus(status: PaymentStatus) {
        try {
            return await prisma.oPDRegistration.findMany({
                where: { paymentStatus: status },
            });
        } catch (error) {
            console.error("Error in getOpdsByPaymentStatus: ", error);
            return undefined;
        }
    }

    /**
     * Schedules a virtual meeting for an OPD visit
     * @param meet Virtual meeting data
     * @returns Created OPD visit or undefined on error
     */
    public async scheduleMeet(meet: any) {
        try {
            const meetingUrl = `http://localhost:${meet.port}/join-vopd`;
            const uniqueRoomName = `virtual-opd-room-${meet.patientID}-${meet.doctorID}-${meet.date}`;
            meet.VirtualOPDRoomName = uniqueRoomName;
            meet.isVirtualOPD = true;
            meet.VirtualOPDLink = meetingUrl;

            const virtualMeet = await prisma.oPDRegistration.create({
                data: {
                    patientID: meet.patientID,
                    doctorID: meet.doctorID,
                    bedID: meet.bedID || null,
                    departmentID: meet.departmentID || null,
                    hospitalID: meet.hospitalID,
                    name: meet.name || null,
                    date: new Date(meet.date).toISOString() || new Date(),
                    paymentStatus: meet.paymentStatus || PaymentStatus.Pending,
                    symptoms: meet.symptoms || null,
                    diagnosis: meet.diagnosis || null,
                    prescription: meet.prescription || null,
                    followUp: meet.followup || false,
                    followUpDate: meet.followUpDate || null,
                    followUpReason: meet.followUpReason || null,
                    followUpPrescription: meet.followUpPrescription || null,
                    followUpDiagnosis: meet.followUpDiagnosis || null,
                    allergies: meet.allergies || null,
                    bloodGroup: meet.bloodGroup || null,
                    weight: meet.weight || 0,
                    OPDTime: meet.OPDTime,
                    isVirtualOPD: true,
                    VirtualOPDDate: new Date(meet.date).toISOString() || null,
                    VirtualOPDTime: meet.OPDTime || null,
                    VirtualOPDLink: meetingUrl || null,
                    VirtualOPDRoomName: uniqueRoomName || null,
                },
            });

            const patientDetails = await prisma.oPDRegistration.findUnique({
                where: {
                    id: virtualMeet.id
                },
                include: {
                    patient: true
                }
            });

            const doctorDetails = await prisma.doctor.findUnique({
                where: {
                    id: meet.doctorID
                },
                include: {
                    user: true
                }
            });

            // Send email to patient with meeting link
            const patientEmailBody = `Hello ${meet.name},\n\nYour virtual OPD meet with Dr. ${doctorDetails?.user?.username} is scheduled on ${meet.date} at ${meet.OPDTime}. Please click on the link below to join the meeting.\n\n${meetingUrl} and enter the room name as ${uniqueRoomName}`;

            // Send email to doctor with meeting link
            const doctorEmailBody = `Hello Dr. ${doctorDetails?.user?.username},\n\nYour virtual OPD meet with patient ${meet.name} is scheduled on ${meet.date} at ${meet.OPDTime}. Please click on the link below to join the meeting.\n\n${meetingUrl} and enter the room name as ${uniqueRoomName}`;

            // Send email to patient
            const patientEmail = patientDetails?.patient?.email;
            if (patientEmail) {
                await sendVirtualOpdEmail(patientEmail, patientEmailBody);
            } else {
                console.error("Patient email is undefined");
            }

            // Send email to doctor
            const doctorEmail = doctorDetails?.user?.email;
            if (doctorEmail) {
                await sendVirtualOpdEmail(doctorEmail, doctorEmailBody);
            } else {
                console.error("Doctor email is undefined");
            }

            return virtualMeet;
        } catch (error) {
            console.error("Error in scheduleMeet: ", error);
            return undefined;
        }
    }

    /**
     * Creates a virtual room for OPD meeting
     * @param roomName Room name
     * @returns Created room details or error
     */
    public async createRoom(roomName: string): Promise<any> {
        try {
            const apiKey = process.env.DAILY_API_KEY;
            const headers = {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            };

            const response = await fetch("https://api.daily.co/v1/rooms", {
                method: "POST",
                headers,
                body: JSON.stringify({
                    name: roomName,
                    properties: {
                        enable_screenshare: true,
                        enable_chat: true,
                        start_video_off: true,
                        start_audio_off: false,
                        lang: "en",
                    },
                }),
            });

            if (!response.ok) {
                throw new Error(`Error creating room: ${response.statusText}`);
            }

            const result = await response.json();
            return result;
        } catch (error: any) {
            console.error("Error in createRoom: ", error);
            return undefined;
        }
    }

    /**
     * Gets details of a virtual room
     * @param roomName Room name
     * @returns Room details or null if not found
     */
    public async getRoom(roomName: string): Promise<any> {
        try {
            const apiKey = process.env.DAILY_API_KEY;
            const headers = {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            };

            const response = await fetch(`https://api.daily.co/v1/rooms/${roomName}`, {
                method: "GET",
                headers,
            });

            if (!response.ok) {
                if (response.status === 404) {
                    // Room not found, handle gracefully
                    return null;
                }
                throw new Error(`Error getting room: ${response.statusText}`);
            }

            const result = await response.json();
            return result;
        } catch (error: any) {
            console.error("Error in getRoom: ", error);
            return undefined;
        }
    }

    /**
     * Verifies if a user is authorized to join a virtual meeting
     * @param roomId Room ID
     * @param userId User ID
     * @returns Boolean indicating if user is authorized
     */
    public async verifyVirtualMeet(roomId: string, userId: number): Promise<boolean> {
        try {
            const meetingRoom = await this.getPatientOpds(userId);
            if (!meetingRoom) {
                console.log("No meeting rooms found for user:", userId);
                return false;
            }

            for (const room of meetingRoom) {
                if (room.VirtualOPDRoomName === roomId) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error("Error in VerifyVirtualMeet: ", error);
            return false;
        }
    }
}