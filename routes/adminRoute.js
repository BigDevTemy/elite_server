import express from 'express';
import {indexpage,createCategory,createLevel,createDiscovery,allDiscovery,createAdmin,createRole, loginAdmin,createTask, createFacilitator,allfacilitator} from '../controllers/adminController.js'
import {auth} from '../middleware/authMiddleware.js'
//import { createTask } from '../controllers/userController.js';
const route = express.Router();

route.get('/',indexpage);
route.post('/createadmin',createAdmin);
route.post('/loginadmin',loginAdmin);
route.post('/createrole',createRole);
route.post('/create/category',createCategory);
route.post('/create/level',createLevel);
route.post('/create/discovery',createDiscovery);
route.get('/all/discovery',auth,allDiscovery);
route.post('/create/task',createTask);
route.post('/create/facilitator',createFacilitator)
route.get('/allfacilitator',allfacilitator)
export default route;