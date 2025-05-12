// import { Router } from 'express';
// import { HospitalController } from '../controllers/hospital.controller';
// import { isAuthenticated } from '../../user/middlewares/user.middleware';
// import multer from 'multer';

// const upload = multer();
// const hospitalRouter = Router();
// const hospitalController = new HospitalController();

// hospitalRouter.get('/ping', (req, res) => {
//     res.send('pong'); 
// }); 

// hospitalRouter.post('/create-hospital',isAuthenticated,upload.array('hospitalImages') ,  hospitalController.createHospital.bind(hospitalController));
// hospitalRouter.get('/hospitals', isAuthenticated, hospitalController.getHospitals.bind(hospitalController));
// hospitalRouter.get('/hospital/:id', isAuthenticated, hospitalController.getHospital.bind(hospitalController));
// hospitalRouter.put('/update-hospital/:id', isAuthenticated, hospitalController.updateHospital.bind(hospitalController));
// hospitalRouter.delete('/delete-hospital/:id', isAuthenticated, hospitalController.deleteHospital.bind(hospitalController));
// hospitalRouter.put('/verify-hospital/:id', isAuthenticated, hospitalController.verifyHospital.bind(hospitalController));
// hospitalRouter.get('/:hospitalId/:departmentId/doctors', isAuthenticated, hospitalController.getDoctorsByHospitalandDepartment.bind(hospitalController));
// hospitalRouter.get('/:hospitalId/doctors', isAuthenticated, hospitalController.getDoctorsByHospital.bind(hospitalController));
// hospitalRouter.get('/verified-hospitals', isAuthenticated, hospitalController.getVerifiedHospitals.bind(hospitalController));
// hospitalRouter.get('/:hospitalId/beds', isAuthenticated, hospitalController.getBedsByHospital.bind(hospitalController));
// hospitalRouter.get('/:hospitalId/departments', isAuthenticated, hospitalController.getDepartmentsByHospital.bind(hospitalController));
// hospitalRouter.get('/:hospitalId/ratings', isAuthenticated, hospitalController.getRatingsByHospital.bind(hospitalController));
// hospitalRouter.post('/:hospitalId/rating', isAuthenticated, hospitalController.addRating.bind(hospitalController));
// hospitalRouter.put('/:hospitalId/rating/:ratingId', isAuthenticated, hospitalController.updateRating.bind(hospitalController));
// hospitalRouter.delete('/:hospitalId/rating/:ratingId', isAuthenticated, hospitalController.deleteRating.bind(hospitalController));
// hospitalRouter.get('/:hospitalId/timeslots', isAuthenticated, hospitalController.getTimeSlots.bind(hospitalController));
// hospitalRouter.post('/:hospitalId/timeslots', isAuthenticated, hospitalController.addTimeSlot.bind(hospitalController));
// hospitalRouter.put('/:hospitalId/timeslots/:timeslotId', isAuthenticated, hospitalController.updateTimeSlot.bind(hospitalController));
// hospitalRouter.delete('/:hospitalId/timeslots/:timeslotId', isAuthenticated, hospitalController.deleteTimeSlot.bind(hospitalController));
// hospitalRouter.get('/availability/:hospitalId/:date', isAuthenticated, hospitalController.getAvailability.bind(hospitalController));
// hospitalRouter.get('/available-timeslots/:hospitalId/:date', isAuthenticated, hospitalController.getAvailableTimeSlots.bind(hospitalController));

// export {hospitalRouter};