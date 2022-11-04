import express from 'express';
import {indexpage} from '../controllers/adminController.js'
const route = express.Router();

route.get('/',indexpage);

export default route;