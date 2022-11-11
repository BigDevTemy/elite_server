import express from 'express';
import {indexpage,createCategory,createLevel} from '../controllers/adminController.js'
const route = express.Router();

route.get('/',indexpage);
route.post('/create/category',createCategory);
route.post('/create/level',createLevel);

export default route;