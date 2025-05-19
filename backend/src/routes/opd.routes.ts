import {isAuthenticated} from '../middlewares/auth.middleware'
import { Router } from "express";
import { OPDController } from "../controllers/opd.controller";

const opdRouter = Router();
const opdController = new OPDController();

opdRouter.post("/register", isAuthenticated, opdController.registerOpdVisit.bind(opdController));
opdRouter.get("/:id", isAuthenticated, opdController.getOpdVisitById.bind(opdController)); 
opdRouter.put("/:id", isAuthenticated, opdController.updateOpdVisit.bind(opdController));
opdRouter.delete("/:id", isAuthenticated, opdController.deleteOpdVisit.bind(opdController));
opdRouter.get("/getallopds", isAuthenticated, opdController.getAllOpdVisits.bind(opdController));
opdRouter.get("/getpatientopds/:id", isAuthenticated, opdController.getPatientOpds.bind(opdController)); 
opdRouter.get("/getdoctoropds/:id", isAuthenticated, opdController.getDoctorOpds.bind(opdController));
opdRouter.put("/updatepayment/:id", isAuthenticated, opdController.updatePaymentStatus.bind(opdController));
opdRouter.get("/getopdsbydate", isAuthenticated, opdController.getOpdsByDate.bind(opdController));
opdRouter.post("/followup", isAuthenticated, opdController.registerFollowUp.bind(opdController));
opdRouter.get("/getdepartmentopds/:departmentId", isAuthenticated, opdController.getDepartmentOpds.bind(opdController));
opdRouter.get("/getopdsbypaymentstatus/:status", isAuthenticated, opdController.getOpdsByPaymentStatus.bind(opdController));
opdRouter.post("/schedulemeet", isAuthenticated, opdController.scheduleMeet.bind(opdController));
opdRouter.get("/video-call/:id", isAuthenticated, opdController.videoCall.bind(opdController));

export {opdRouter};