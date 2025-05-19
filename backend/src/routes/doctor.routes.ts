import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { DoctorController } from "../controllers/doctor.controller";

const doctorRouter = Router();
const doctorController = new DoctorController();

doctorRouter.post('/register', doctorController.createDoctor.bind(doctorController));
doctorRouter.get('/getDoctors/:departmentId', isAuthenticated, doctorController.getDoctorsByDepartment.bind(doctorController));
doctorRouter.get('/getDoctorsByHospital/:hospitalId', isAuthenticated, doctorController.getDoctorsByHospital.bind(doctorController));
doctorRouter.get('/getDoctorsByAvailability/:availability', isAuthenticated, doctorController.getDoctorsByAvailability.bind(doctorController));
doctorRouter.get('/getDoctor/:id', isAuthenticated, doctorController.getDoctor.bind(doctorController));
doctorRouter.put('/updateDoctor/:id', isAuthenticated, doctorController.updateDoctor.bind(doctorController));
doctorRouter.put('/updateDoctor/:id', isAuthenticated, doctorController.updateDoctor.bind(doctorController));
doctorRouter.delete('/deleteDoctor/:id', isAuthenticated, doctorController.deleteDoctor.bind(doctorController));
doctorRouter.get('/getRatings/:id', isAuthenticated, doctorController.getRatings.bind(doctorController));
doctorRouter.post('/addRating/:id', isAuthenticated, doctorController.addRating.bind(doctorController));
doctorRouter.put('/updateRating/:id', isAuthenticated, doctorController.updateRating.bind(doctorController));
doctorRouter.delete('/deleteRating/:id', isAuthenticated, doctorController.deleteRating.bind(doctorController));
doctorRouter.get('/getAllDoctors', isAuthenticated, doctorController.getAllDoctors.bind(doctorController));
doctorRouter.get('/getDoctorsBySpeciality/:speciality', isAuthenticated, doctorController.getDoctorsBySpeciality.bind(doctorController));
doctorRouter.get('/getOPDRegistrations/:doctorId', isAuthenticated, doctorController.getOPDRegistrations.bind(doctorController)); 

export {doctorRouter};