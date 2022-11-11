import express from 'express';
import {indexpage,createCategory,createLevel,createDiscovery,allDiscovery} from '../controllers/adminController.js'
const route = express.Router();

route.get('/',indexpage);
route.post('/create/category',createCategory);
route.post('/create/level',createLevel);
route.post('/create/discovery',createDiscovery);
route.get('/all/discovery',allDiscovery);
export default route;