import express from 'express';
import {indexpage,registerUser,loginUser,createTask} from '../controllers/userController.js'
import {auth} from '../middleware/authMiddleware.js'
const route = express.Router();

route.get('/',indexpage);
route.post('/registeruser',registerUser);
route.post('/loginuser',loginUser);
route.post('/createTask',auth,createTask);
export default route;