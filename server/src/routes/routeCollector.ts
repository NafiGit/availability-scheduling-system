// routes/routeCollector.ts

import express from 'express';
import { auth, adminAuth } from '../middleware/auth';
import * as availabilityController from '../controllers/availabilityController';
import * as sessionController from '../controllers/sessionController';
import * as userController from '../controllers/userController';

const router = express.Router();
// base url: http://localhost:5000/api/

// Availability routes
router.get('/availability', auth, availabilityController.getUserAvailability);
router.post('/availability', auth, availabilityController.createAvailability);
router.patch('/availability/:id', auth, availabilityController.updateAvailability);
router.delete('/availability/:id', auth, availabilityController.deleteAvailability);
router.get('/availability/all', adminAuth, availabilityController.getAllAvailabilities);

// Session routes
router.post('/session', auth, sessionController.createSession);
router.get('/session', auth, sessionController.getUserSessions);
router.get('/session/:id', auth, sessionController.getSessionById);
router.patch('/session/:id', auth, sessionController.updateSession);
router.delete('/session/:id', auth, sessionController.deleteSession);
router.get('/session/all', adminAuth, sessionController.getAllSessions);

// User routes
router.get('/users', adminAuth, userController.getAllUsers);
router.get('/user/:id', adminAuth, userController.getUserById);
router.patch('/user', auth, userController.updateUser);
router.delete('/user', auth, userController.deleteUser);

export default router;