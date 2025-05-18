    import { Router } from 'express';
    import { HospitalController } from '../controllers/hospital.controller';
    import { isAuthenticated } from '../middlewares/auth.middleware';
    import multer from 'multer';

    const upload = multer();
    const hospitalRouter = Router();
    const hospitalController = new HospitalController();

    hospitalRouter.get('/ping', (req, res) => {
        res.send('pong'); 
    });

    // Hospital CRUD operations
    hospitalRouter.post('/create-hospital', isAuthenticated, upload.array('hospitalImages'), hospitalController.createHospital.bind(hospitalController));
    hospitalRouter.get('/hospitals', hospitalController.getHospitals.bind(hospitalController));
    hospitalRouter.get('/hospital/:id', hospitalController.getHospital.bind(hospitalController));
    hospitalRouter.put('/update-hospital/:id', isAuthenticated, hospitalController.updateHospital.bind(hospitalController));
    hospitalRouter.delete('/delete-hospital/:id', isAuthenticated, hospitalController.deleteHospital.bind(hospitalController));
    hospitalRouter.put('/verify-hospital/:id', isAuthenticated, hospitalController.verifyHospital.bind(hospitalController));
    hospitalRouter.get('/verified-hospitals', isAuthenticated, hospitalController.getVerifiedHospitals.bind(hospitalController));

    // Doctor-related endpoints
    hospitalRouter.get('/:hospitalId/:departmentId/doctors', hospitalController.getDoctorsByHospitalandDepartment.bind(hospitalController));
    hospitalRouter.get('/:hospitalId/doctors', hospitalController.getDoctorsByHospital.bind(hospitalController));

    // Department-related endpoints
    hospitalRouter.get('/:hospitalId/departments', hospitalController.getDepartmentsByHospital.bind(hospitalController));
    hospitalRouter.post('/:hospitalId/departments', hospitalController.addDepartment.bind(hospitalController));
    hospitalRouter.put('/:hospitalId/departments/:departmentId', hospitalController.updateDepartment.bind(hospitalController));
    hospitalRouter.delete('/:hospitalId/departments/:departmentId', hospitalController.deleteDepartment.bind(hospitalController));

    // Bed-related endpoints
    hospitalRouter.get('/:hospitalId/beds', hospitalController.getBedsByHospital.bind(hospitalController));

    // Rating-related endpoints
    hospitalRouter.get('/:hospitalId/ratings', hospitalController.getRatingsByHospital.bind(hospitalController));
    hospitalRouter.post('/:hospitalId/rating', isAuthenticated, hospitalController.addRating.bind(hospitalController));
    hospitalRouter.put('/:hospitalId/rating/:ratingId', isAuthenticated, hospitalController.updateRating.bind(hospitalController));
    hospitalRouter.delete('/:hospitalId/rating/:ratingId', isAuthenticated, hospitalController.deleteRating.bind(hospitalController));

    // Timeslot-related endpoints
    hospitalRouter.get('/:hospitalId/timeslots',  hospitalController.getTimeSlots.bind(hospitalController));
    hospitalRouter.post('/:hospitalId/timeslots', isAuthenticated, hospitalController.addTimeSlot.bind(hospitalController));
    hospitalRouter.put('/:hospitalId/timeslots/:timeslotId', isAuthenticated, hospitalController.updateTimeSlot.bind(hospitalController));
    hospitalRouter.delete('/:hospitalId/timeslots/:timeslotId', isAuthenticated, hospitalController.deleteTimeSlot.bind(hospitalController));

    // Availability-related endpoints
    hospitalRouter.get('/availability/:hospitalId/:date', hospitalController.getAvailability.bind(hospitalController));
    hospitalRouter.get('/available-timeslots/:hospitalId/:date', hospitalController.getAvailableTimeSlots.bind(hospitalController));

    export {hospitalRouter};