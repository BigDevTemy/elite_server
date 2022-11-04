import express from 'express';
import {indexpage,registerUser} from '../controllers/userController.js'
import {auth} from '../middleware/authMiddleware.js'
const route = express.Router();

route.get('/',auth,indexpage);
route.post('/registeruser',registerUser);
export default route;