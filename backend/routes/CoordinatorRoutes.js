import express from 'express';
import {
addCoordinator,
deleteCoordinator,
getCoordinator,
getCoordinatorById,
getCoordinatorById1,
updateCoordinator,
updateProfile
} from '../controllers/ManageCoordinator.js';

const router = express.Router();
router.get('/:id', getCoordinatorById);
router.get('/get/:id', getCoordinatorById1);
router.put('/updateCoordinatorProfile/:id', updateProfile); 

router.get('/', getCoordinator);
router.post('/', addCoordinator);
router.put('/:id', updateCoordinator);
router.delete('/:id', deleteCoordinator);

export default router;
