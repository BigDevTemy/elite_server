import users from '../models/users.js'
import planpackage from '../models/plan.js'
import dailytask from '../models/dailytask.js'
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import moment from 'moment';
import Cloudinary from 'cloudinary'
import discover from '../models/discover.js';

Cloudinary.config({
    cloud_name:'dgabmeacq',
    api_key:'557461256887664',
    api_secret:'ynduulzzjmpTXh5kGV_akLtOH2E'
})


// Cloudinary.v2.uploader.upload(uploadStr,{
//     overwrite:true,
//     invalidate:true
// },
// function (error,result){
//     if(error){
//             console.log('Error uploaded')
//     }
//     else{
//         console.log('uploaded')
//     }
// })

const indexpage = (req,res)=>{
    res.json({
        'Message':"Welcome User",
        "status":true
    })
}

const createCategory = (async (res,req)=>{
    let createDiscover = await discover.create({
        
    })
})



export {indexpage}