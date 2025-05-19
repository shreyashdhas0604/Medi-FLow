import { Bed, PaymentStatus } from "@prisma/client";
import { ApiResponse } from "../utils/ApiResponse";
import { OpdService } from "../services/opd.service";

interface OpdVisit {
    patientID: number;
    doctorID: number;
    bedID?: number | null;
    departmentID?: number | null;
    hospitalID: number;
    name?: string | null;
    date: Date | string;
    paymentStatus?: PaymentStatus;
    symptoms?: string | null;
    diagnosis?: string | null;
    prescription?: string | null;
    followUp?: boolean;
    followUpDate?: Date | null;
    followUpReason?: string | null;
    followUpPrescription?: string | null;
    followUpDiagnosis?: string | null;
    allergies?: string | null;
    bloodGroup?: string | null;
    weight?: number;
    OPDTime: string;
    isVirtualOPD?: boolean;
    VirtualOPDDate?: Date | string | null;
    VirtualOPDTime?: string | null;
    VirtualOPDLink?: string | null;
    VirtualOPDRoomName?: string | null;
}

export class OPDController {
    private opdService: OpdService;

    constructor() {
        this.opdService = new OpdService();
    }

    public async registerOpdVisit(req: any, res: any) {
        try {
            const result = await this.opdService.registerOpdVisit(req.body);

            if(result === undefined){
                return res.status(400).json(new ApiResponse(400, "Failed to register OPD visit"));
            }

            return res.status(200).json(new ApiResponse(200, result));
        } catch (error) {
            console.log("Error in registerOpdVisit controller: ", error);
            return res.status(500).json(new ApiResponse(500, error));
        }
    }

    public async getOpdVisitById(req: any, res: any) {
        try {
            const id = parseInt(req.params.id);

            const result = await this.opdService.getOpdVisitById(id);

            if(result === undefined){
                return res.status(400).json(new ApiResponse(400, "Failed to get OPD visit"));
            }

            return res.status(200).json(new ApiResponse(200, result));
        } catch (error) {
            console.log("Error in getOpdVisitById controller: ", error);
            return res.status(500).json(new ApiResponse(500, error));
        }
    }

    public async updateOpdVisit(req: any, res: any) {
        try {
            const id = parseInt(req.params.id);
            const opdVisit = {
                id,
                ...req.body
            };

            const result = await this.opdService.updateOpdVisit(opdVisit);

            if(result === undefined){
                return res.status(400).json(new ApiResponse(400, "Failed to update OPD visit"));
            }

            return res.status(200).json(new ApiResponse(200, result));
        } catch (error) {
            console.log("Error in updateOpdVisit controller: ", error);
            return res.status(500).json(new ApiResponse(500, error));
        }
    }

    public async deleteOpdVisit(req: any, res: any) {
        try {
            const id = parseInt(req.params.id);

            const result = await this.opdService.deleteOpdVisit(id);

            if(result === undefined){
                return res.status(400).json(new ApiResponse(400, "Failed to delete OPD visit"));
            }

            return res.status(200).json(new ApiResponse(200, result));
        } catch (error) {
            console.log("Error in deleteOpdVisit controller: ", error);
            return res.status(500).json(new ApiResponse(500, error));
        }
    }

    public async getAllOpdVisits(req: any, res: any) {
        try {
            const result = await this.opdService.getAllOpdVisits();

            if(result === undefined){
                return res.status(400).json(new ApiResponse(400, "Failed to get OPD visits"));
            }

            return res.status(200).json(new ApiResponse(200, result));
        } catch (error) {
            console.log("Error in getAllOpdVisits controller: ", error);
            return res.status(500).json(new ApiResponse(500, error));
        }
    }

    public async getPatientOpds(req: any, res: any) {
        try {
            const id = parseInt(req.params.id);

            const result = await this.opdService.getPatientOpds(id);

            if(result === undefined){
                return res.status(400).json(new ApiResponse(400, "Failed to get patient OPDs"));
            }

            return res.status(200).json(new ApiResponse(200, result));
        } catch (error) {
            console.log("Error in getPatientOpds controller: ", error);
            return res.status(500).json(new ApiResponse(500, error));
        }
    }

    public async getDoctorOpds(req: any, res: any) {
        try {
            const id = parseInt(req.params.id);

            const result = await this.opdService.getDoctorOpds(id);

            if(result === undefined){
                return res.status(400).json(new ApiResponse(400, "Failed to get doctor OPDs"));
            }

            return res.status(200).json(new ApiResponse(200, result));
        } catch (error) {
            console.log("Error in getDoctorOpds controller: ", error);
            return res.status(500).json(new ApiResponse(500, error));
        }
    }

    public async updatePaymentStatus(req: any, res: any) {
        try {
            const id = parseInt(req.params.id);
            const status = req.body.status;

            const result = await this.opdService.updatePaymentStatus(id, status);

            if(result === undefined){
                return res.status(400).json(new ApiResponse(400, "Failed to update payment status"));
            }

            return res.status(200).json(new ApiResponse(200, result));
        } catch (error) {
            console.log("Error in updatePaymentStatus controller: ", error);
            return res.status(500).json(new ApiResponse(500, error));
        }
    }

    public async getOpdsByDate(req: any, res: any) {
        try {
            const startDate = new Date(req.body.startDate);
            const endDate = new Date(req.body.endDate);

            const result = await this.opdService.getOpdsByDate(startDate, endDate);

            if(result === undefined){
                return res.status(400).json(new ApiResponse(400, "Failed to get OPDs by date"));
            }

            return res.status(200).json(new ApiResponse(200, result));
        } catch (error) {
            console.log("Error in getOpdsByDate controller: ", error);
            return res.status(500).json(new ApiResponse(500, error));
        }
    }

    public async registerFollowUp(req: any, res: any) {
        try {
            const result = await this.opdService.registerFollowUp(req.body);

            if(result === undefined){
                return res.status(400).json(new ApiResponse(400, "Failed to register follow-up visit"));
            }

            return res.status(200).json(new ApiResponse(200, result));
        } catch (error) {
            console.log("Error in registerFollowUp controller: ", error);
            return res.status(500).json(new ApiResponse(500, error));
        }
    }

    public async getDepartmentOpds(req: any, res: any) {
        try {
            const departmentId = parseInt(req.params.departmentId);

            const result = await this.opdService.getDepartmentOpds(departmentId);

            if(result === undefined){
                return res.status(400).json(new ApiResponse(400, "Failed to get department OPDs"));
            }

            return res.status(200).json(new ApiResponse(200, result));
        } catch (error) {
            console.log("Error in getDepartmentOpds controller: ", error);
            return res.status(500).json(new ApiResponse(500, error));
        }
    }

    public async getOpdsByPaymentStatus(req: any, res: any) {
        try {
            const status = req.params.status as PaymentStatus;

            const result = await this.opdService.getOpdsByPaymentStatus(status);

            if(result === undefined){
                return res.status(400).json(new ApiResponse(400, "Failed to get OPDs by payment status"));
            }

            return res.status(200).json(new ApiResponse(200, result));
        } catch (error) {
            console.log("Error in getOpdsByPaymentStatus controller: ", error);
            return res.status(500).json(new ApiResponse(500, error));
        }
    }

    public async scheduleMeet(req: any, res: any) {
        try {
            const meet = {
                ...req.body,
                port: (req.user.role === 'Patient') ? 5173 : 5174
            };
            
            const result = await this.opdService.scheduleMeet(meet);

            if(result === undefined){
                return res.status(400).json(new ApiResponse(400, "Failed to schedule meet"));
            }

            return res.status(200).json(new ApiResponse(200, result));
        } catch (error) {
            console.log("Error in scheduleMeet controller: ", error);
            return res.status(500).json(new ApiResponse(500, error));
        }
    }

    public async videoCall(req: any, res: any) {
        try {
            const roomId = req.params.id;
        
            if (!roomId) {
                return res.status(400).send({ error: "Room ID is required" });
            }
        
            const check = await this.opdService.verifyVirtualMeet(roomId, req.user.id);
        
            if (!check) {
                return res.status(400).json(new ApiResponse(400, "You are not authorized to join this meet"));
            }
        
            const room = await this.opdService.getRoom(roomId);
        
            if (!room) {
                const newRoom = await this.opdService.createRoom(roomId);
                return res.status(200).send(newRoom);
            } else {
                return res.status(200).send(room);
            }
        } catch (error) {
            console.log("Error in videoCall controller: ", error);
            return res.status(500).send({ error: "Internal Server Error" });
        }
    }
}