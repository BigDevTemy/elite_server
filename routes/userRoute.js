import express from 'express';
import {indexpage,registerUser,loginUser} from '../controllers/userController.js'
import {auth} from '../middleware/authMiddleware.js'
const route = express.Router();

route.get('/',indexpage);
route.post('/registeruser',registerUser);
route.post('/loginuser',loginUser);
export default route;