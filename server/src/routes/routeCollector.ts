// routes/routeCollector.ts

import express from 'express';
import { auth, adminAuth } from '../middleware/auth';
import * as availabilityController from '../controllers/availabilityController';
import * as sessionController from '../controllers/sessionController';
import * as userController from '../controllers/userController';
import * as authController from '../controllers/authController';

const router = express.Router();
// base url: http://localhost:5000/api/



// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', auth, authController.logout);

// Availability routes
router.get('/availability', auth, availabilityController.getUserAvailability);
router.post('/availability', auth, availabilityController.createAvailability);
router.patch('/availability/:id', auth, availabilityController.updateAvailability);
router.delete('/availability/:id', auth, availabilityController.deleteAvailability);
router.get('/availability/all', adminAuth, availabilityController.getAllAvailabilities);
router.get('/availability/date/:date', auth, availabilityController.getAvailabilitiesByDate);

// Session routes
router.post('/session', auth, sessionController.createSession);
router.get('/session/all', adminAuth, sessionController.getAllSessions);
router.get('/session', auth, sessionController.getUserSessions);
router.get('/session/:id', auth, sessionController.getSessionById);
router.patch('/session/:id', auth, sessionController.updateSession);
router.delete('/session/:id', auth, sessionController.deleteSession);

// User routes
router.get('/users', adminAuth, userController.getAllUsers);
router.get('/user/:id', auth, userController.getUserById);
router.patch('/user/:id', auth, userController.updateUser);
router.delete('/user/:id', auth, userController.deleteUser);

// Auth check route
router.get('/auth/check', auth, authController.checkAuth);


export default router;
