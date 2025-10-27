import express from 'express';

import { signup,login,addService,
  getServices,
  updateService,
  deleteService,
  updateExperience } from '../controllers/serviceProvider.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post("/:providerId/services", addService);          
router.get("/services", getServices);           
router.put("/:providerId/services/:serviceId", updateService); 
router.delete("/:providerId/services/:serviceId", deleteService);
router.put("/:providerId/experience", updateExperience);

export default router;