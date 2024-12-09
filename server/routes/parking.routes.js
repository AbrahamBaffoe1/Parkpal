// server/routes/parking.routes.js
import express from 'express';
import { 
  getAllParkingSpots,
  createParkingSpot,
  updateParkingSpot,
  deleteParkingSpot
} from '../controllers/parking.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/spots', getAllParkingSpots);

// Protected routes
router.use(protect);
router.post('/spots', createParkingSpot);
router.put('/spots/:id', updateParkingSpot);
router.delete('/spots/:id', deleteParkingSpot);

export default router;