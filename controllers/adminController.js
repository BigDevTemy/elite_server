import users from '../models/users.js'
import planpackage from '../models/plan.js'
import dailytask from '../models/dailytask.js'
import admin from '../models/admin.js'
import role from '../models/role.js'
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import moment from 'moment';
import Cloudinary from 'cloudinary'
import discover from '../models/discover.js';
import category from '../models/category.js';
import level from '../models/level.js';

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
        'Message':"Welcome Adminer",
        "status":true
    })
}

const createAdmin = (req,res)=>{
    let fname = req.body?.fname
    let lname = req.body?.lname
    let password = req.body?.password
    let email = req.body?.email

    if(fname && lname && password && email){
        admin.findOne({email:email},async(err,docs)=>{
            if(err){
                res.status(401).send({'error':err})
            }
            else if(docs){
                res.status(401).send({
                    'message':'Email adready in use',
                    'status':false
                })
            }
            else if(!docs){
                const salt = await bcrypt.genSalt(10);
                let newpassword = await bcrypt.hash(password, salt);
                const adminCreated = await admin.create({
                    password:newpassword,
                    status:"active",
                    
                    email:email,
                    email_verified:false,
                    firstname:fname,
                    lastname:lname
                })
                res.send({
                    "message":'Admin Created',
                    "status":true,
                    "admin":adminCreated
                })
            }
        })
    }
    else{
        res.status(401).send({
            "message":"NO DATA"
        })
    }

    
}

const createRole = (req,res)=>{
    let rolename = req.body?.rolename
    
    if(rolename){
        role.findOne({rolename:rolename},async(err,docs)=>{
            if(err){
                res.status(401).send({'error':err})
            }
            else if(docs){
                res.status(401).send({
                    'message':'rolename not unique',
                    'status':false
                })
            }
            else if(!docs){
                
                const roleCreated = await role.create({
                    rolename:rolename,
                    
                })
                res.send({
                    "message":'Role Created',
                    "status":true,
                    "role":roleCreated
                })
            }
        })
    }
    else{
        res.status(401).send({
            "message":"NO DATA"
        })
    }

    
}


const createCategory = (async (req,res)=>{
    let body = req.body

    console.log(body)
    let createcategory = await category.create({
        name:body.name,
        status:body.status
    })

    if(createcategory){
        res.send({
            'message':'Category Created',
            'data':createCategory,
            'status':true
        })
    }
    else{
        res.send({
            'message':'Category Error',
            'status':false
        })
    }
})

const createLevel = (async (req,res)=>{
    let body = req.body
    let createlevel = await level.create({
        name:body.name,
        status:body.status

    })

    if(createlevel){
        res.send({
            'message':'Level Created',
            'data':createlevel,
            'status':true
        })
    }
    else{
        res.send({
            'message':'Level Created Error',
            'status':false
        })
    }
})


const createDiscovery = (async (req,res)=>{
    let creatediscovery = await discover.create({
        "asset_url":req.body.asset_url,
        "title":req.body.title,
        "allotted_time":req.body.allotted_time,
        "type":req.body.type,
        "level":req.body.level,
        "category":req.body.category,
        "status":req.body.status

    })

    if(creatediscovery){
        res.send({
            "message":"Discovery Successfully Created",
            "status":true
        })
    }
    else{
        res.status(400).send({
            "message":"Discovery Creation Failed",
            "status":false
        })
    }
   
})

const allDiscovery = async (req,res)=>{
    let alldata_beginner = await discover.find({level:'Beginner'}).sort({'created_at':-1}).limit(3);
    let alldata_intermidiate = await discover.find({level:'Intermidiate'}).sort({'created_at':-1}).limit(3);
    let alldata_Pro = await discover.find({level:'Pro'}).sort({'created_at':-1}).limit(3);

    if(alldata_beginner){
        res.send({
            "message":"Data Successfully Fetched",
            "data":{
                'beginners':alldata_beginner,
                'intermidiate':alldata_intermidiate,
                'pro':alldata_Pro
            },
            "status":true
        })
    }
    else{
        res.send({
            "message":"Fetch Failed",
            "data":null,
            "status":false

        })
    }
    
}


export {indexpage,createCategory,createLevel,createDiscovery,allDiscovery,createAdmin,createRole}