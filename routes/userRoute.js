import express from 'express';
import {indexpage,registerUser,loginUser,createTask,deleteTask,updateTask,refreshUserData,aggregateData} from '../controllers/userController.js'
import {auth} from '../middleware/authMiddleware.js'
const route = express.Router();

route.get('/',indexpage);
route.post('/registeruser',registerUser);
route.post('/loginuser',loginUser);
route.post('/createTask',auth,createTask);
route.post('/deleteTask',auth,deleteTask);
route.post('/updateTask',auth,updateTask);
route.post('/refreshdata',auth,refreshUserData);
route.get('/aggregate',aggregateData);
export default route;