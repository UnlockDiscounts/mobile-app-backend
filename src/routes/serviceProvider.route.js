import express from 'express';

import { signup,login,addService,
  getServices,
  updateService,
  deleteService,
  updateExperience } from '../controllers/serviceProvider.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post("/:providerId/services",verifyToken, addService);          
router.get("/services",getServices);           
router.put("/:providerId/services/:serviceId",verifyToken, updateService); 
router.delete("/:providerId/services/:serviceId",verifyToken, deleteService);
router.put("/:providerId/experience",verifyToken, updateExperience);

export default router;