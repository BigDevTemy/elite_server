import users from '../models/users.js'
import planpackage from '../models/plan.js'
import dailytask from '../models/dailytask.js'
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
        'Message':"Welcome User",
        "status":true
    })
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


export {indexpage,createCategory,createLevel,createDiscovery,allDiscovery}