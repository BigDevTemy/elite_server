import users from '../models/users.js'
import planpackage from '../models/plan.js'
import dailytask from '../models/dailytask.js'
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import moment from 'moment';
import discover from '../models/discover.js';
import axios from "axios";



const indexpage = ((req,res)=>{
    res.send('Welcome User to Heroku Server');
})

const checkEmail = ((req,res)=>{
    
    let body =  req.body
    console.log(body.email)
    users.findOne({email:body.email},(err,docs)=>{
        if(err){
            res.status(400).send({
                "message":err,
                "status":false
            })
        }
        else if(docs){
            res.status(400).send({
                "message":"Email already exist",
                "status":false
            })
        }
        else if(!docs){
            res.send({
                "message":"Email is available",
                "status":true
            })
        }
    })
})

function generateAccessToken(email,firstname) {
    const accessToken =  jwt.sign({username:email,firstname:firstname}, process.env.TOKEN_SECRET, { expiresIn: '216000s' });
    const refreshToken = jwt.sign(email, process.env.REFRESH_TOKEN_SECRET,{expiresIn:'1d'});
    return { accessToken:accessToken,refreshToken:refreshToken}
}


  const comparePassword = async (password, hash) => {
    try {
      // Compare password
      console.log('password',password);
      console.log('hash',hash)
      return await bcrypt.compare(password, hash)
    } catch (error) {
      console.log('error',error)
    }
  
    // Return false if error
    return false
  }

const logmessage=((req,res)=>{
    console.log(req.body);
    // res.send({
    //     message:"Successfully Delivered",
    //     status:"success"
    // })
    axios.post('https://backend.smsprotect.io:5000/classify',{},{
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then((response)=>{
        console.log(response)
    })
    .catch((err)=>{
        console.log(err.response)
    })
})

const loginUser = ((req,res)=>{
    let body = req.body
    // let body = req.body
    console.log(body)
    const today = moment().startOf('day')
    // let mydate = new Date();
    //let today = mydate.getDate() + '-' + mydate.getMonth() +'-'+ mydate.getFullYear();
    users.findOne({email:body.email},async (err,docs)=>{
        if(err){
            res.status(400).send({
                'message':err
            })
        }
        else if(docs){
            let checkpassword = await comparePassword(body.password,docs.password);
            
            if(checkpassword){
                const token = generateAccessToken({ email:body.email,username:docs.firstname });
            console.log('mytokendetails',token)
               
                dailytask.find({$and:[{userid:docs._id},
                    {
                        created_at: {
                            $gte: today.toDate(),
                            $lte: moment(today).endOf('day').toDate()
                        }
                }]},(err,docs_task)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        planpackage.findOne({userid:docs._id},(err,docs_plan)=>{
                            res.send({
                                'message':docs,
                                'plan':docs_plan,
                                'task':docs_task,
                                'status':true,
                                'token':token.accessToken,
                                'refresh_token':token.refreshToken
                            })
                        })
                    }
                    
                }).sort({'created_at':-1})
               
                
               
                
            }
            else{
                res.status(400).send({
                    'message':'Invalid login credentials',
                    'status':false
    
                })
            }
        }
        else if(!docs){
            res.status(400).send({
                'message':'Invalid Login Credentials',
                'status':false

            })
        }
    })
})

// async function planFetch(){
//   let result =  await plan.findOne({userid:'990890809'},(err,docs)=>
//     {
//         if(err){
//             return [false,err];
//         }
//         else{
//              return [true,docs];
//         }
//     })

//     return result;

    
// }

const registerUser  = ((req,res)=>{


    const today = moment().startOf('day');
    console.log(req.body.items);
    let body = req.body.items;
   
    let email = body.EmailReg.email
    let password = body.EmailReg.password
    let payment_status = body.Paystack.status
    let status = body.Planpayment.plan_status
    let reference = body.Planpayment.plan_reference
    let gender = body.Gender.gender
    let weight = body.Weight.weight
    let age = body.Age.age
    let firstname = body.Fullname.firstname
    let lastname = body.Fullname.lastname
    let amount = body.Planpayment.planpaymentamount
    let plan_reference = body.Planpayment.plan_reference
    let plan = body.Planpayment.plan
    let plan_status = body.Planpayment.plan_status
    let x = [email,password,payment_status,status,reference,gender,weight,age,firstname,lastname,amount,plan_reference,plan_status,plan]
    // console.log('x',x)
    users.findOne({email:email},async (err,docs)=>{
        if(err){
            res.status(400).send({
                'message':err,
                'status':false
            });
        }
        else if(docs){
            res.status(400).send({
                'message':'Email is already in use',
                'status':false
            })
        }
        else{
            //   const userCreated = new users(body);

            const salt = await bcrypt.genSalt(10);
            let newpassword = await bcrypt.hash(password, salt);
            //   userCreated.save().then((doc) => res.status(201).send(doc));
            let commitment_fee_status 
            if(payment_status == "success"){
                commitment_fee_status="paid"
            }else{
                commitment_fee_status="unpaid"
            }
           
           try{
                 
                const userCreated = await users.create({
                    password:newpassword,
                    reference:reference,
                    status:status,
                    commitment_fee:commitment_fee_status,
                    email:email,
                    email_verified:false,
                    gender:gender,
                    weight:weight,
                    age:age,
                    firstname:firstname,
                    lastname:lastname
                })
                const token = generateAccessToken({ email: email });

                if(status == "success"){
                    let x = [req.body.items.Planpayment.planpaymentamount,req.body.items.Planpayment.plan,req.body.items.Planpayment.plan_reference,req.body.items.Planpayment.plan_status];
                
                    let mydate = new Date();
                    const createPlan = await planpackage.create({
                        userid:userCreated._id,
                        amount:amount,
                        plan_type:plan,
                        payment_reference:plan_reference,
                        plan_status:plan_status,
                        dateofpayment:mydate.getDate() + '-' + mydate.getMonth() +'-'+ mydate.getFullYear(),

                    })
                }

                if(userCreated){
                    
                    dailytask.find({$and:[{userid:userCreated._id},
                        {
                            created_at: {
                                $gte: today.toDate(),
                                $lte: moment(today).endOf('day').toDate()
                            }
                    }]},(err,docs_task)=>{
                        if(err){
                            console.log(err);
                        }
                        else{
                            planpackage.findOne({userid:userCreated._id},(err,docs_plan)=>{
                                console.log(docs_plan)
                                console.log(docs_task)
                                console.log(userCreated)
                                res.status(200).send({
                                    'message':userCreated,
                                    'plan':docs_plan,
                                    'task':docs_task,
                                    'status':true,
                                    'token':token
                                })
                                
                            })
                        }
                        
                    }).sort({'created_at':-1})
                }
                else{
                    res.status(400).send({
                        'message':'Something went wrong',
                        'status':false
                        
                    })
                }
           }
           catch(err){
                console.log(err);
           }


        }
    })
})

const createTask = (async (req,res)=>{
    // let body = req.body.items
    let body = req.body.items
    const today = moment().startOf('day')

    const taskCreated = await dailytask.create({
        userid:body.userid,
        task_title:body.task_title,
        allotted_time:body.allotted_time,
        status:false
    });
    if(taskCreated){
        let todayTasks = await dailytask.find({$and:[{userid:body.userid},
            {created_at: {
            $gte: today.toDate(),
            $lte: moment(today).endOf('day').toDate()
          }}]}).sort({'created_at':-1})

        res.send({
            'message':'Task Created Successfully',
            'todayTask':todayTasks,
            'status':true
        })
    }
    else{
        res.status(400).send({
            'message':'Task creation was unsuccessfu;',
            'status':false
        })
    }
})

const deleteTask = (async(req,res)=>{

      // let body = req.body.items
    let body = req.body.items
    const today = moment().startOf('day')
    dailytask.deleteOne({_id:body._id},async(err,docs)=>{
        if(err){
            res.status(400).send({
                'message':err,
                'status':false
            })
        }
        else if(docs){
            let todayTasks = await dailytask.find({$and:[{userid:body.userid},{created_at: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
              }}]}).sort({'created_at':-1})
            
              res.send({
                'message':'Deletion was Successful',
                'todayTask':todayTasks

              })
            
        }
    })

    
})


const updateTask = (async(req,res)=>{

    // let body = req.body.items
  let body = req.body.items
  const today = moment().startOf('day');

  dailytask.findOneAndUpdate({_id:body._id},{status:body.updatedstatus},async(err,docs)=>{
      if(err){
          res.status(400).send({
              'message':err,
              'status':false
          })
      }
      else if(docs){
          let todayTasks = await dailytask.find({$and:[{userid:body.userid},{created_at: {
              $gte: today.toDate(),
              $lte: moment(today).endOf('day').toDate()
            }}]}).sort({'created_at':-1})
          
            res.send({
              'message':'Update was Successful',
              'todayTask':todayTasks

            })
          
      }
  })

  
})


const refreshUserData = ((req,res)=>{

    let body  = req.body.items
    const today = moment().startOf('day')
    console.log(today.toDate())
    console.log(moment(today).endOf('day').toDate())
    users.findOne({_id:body._id},(err,docs)=>{
        if(err){
            res.status(400).send({
                "message":err,
                "status":false
            })
        }
        else if(docs){
            dailytask.find({$and:[{userid:docs._id},
                {
                    
                    created_at: {
                        $gte: today.toDate(),
                        $lte: moment(today).endOf('day').toDate()
                    }
            }]},(err,docs_task)=>{
                if(err){
                    console.log(err);
                }
                else{
                    planpackage.findOne({userid:docs._id},(err,docs_plan)=>{
                        res.send({
                            'message':docs,
                            'plan':docs_plan,
                            'task':docs_task,
                            'status':true,
                            'token':body.token
                        })
                    })
                }
                
            }).sort({'created_at':-1})
        }
        else{
            // res.status(400).send({
            //     "message":'User doesnt Exit',
            //     "status":false
            // })
        }
    })



})

const aggregateData = (async (req,res)=>{
    let Balance = await discover.aggregate([
        {$match:{category:'Balance'}},
        {
            $group:{
               _id:{id:'$_id',title:'$title',status:'$status',allotted_time:'$allotted_time',type:'$type',level:'$level'},
               
            }
        }
    ])
    let Aerobic = await discover.aggregate([
        {$match:{category:'Aerobic'}},
        {
            $group:{
               _id:{id:'$_id',title:'$title',status:'$status',allotted_time:'$allotted_time',type:'$type',level:'$level'},
               
            }
        }
    ])
    let Flexibility = await discover.aggregate([
        {$match:{category:'Flexibility'}},
        {
            $group:{
               _id:{id:'$_id',title:'$title',status:'$status',allotted_time:'$allotted_time',type:'$type',level:'$level'},
               
            }
        }
    ])
    let Stretching = await discover.aggregate([
        {$match:{category:'Stretching'}},
        {
            $group:{
               _id:{id:'$_id',title:'$title',status:'$status',allotted_time:'$allotted_time',type:'$type',level:'$level'},
               
            }
        }
    ])

    res.send({
        "Balance":Balance,
        "Aerobic":Aerobic,
        "Flexibility":Flexibility,
        "Stretching":Stretching,
        'status':true
    })

   
})

const insightData = ((req,res)=>{
    let body = req.body.selectedDate
   console.log(req.body);
   console.log(body);
  
    let momentum_start = moment(body.split('T')[0]).startOf('day').toDate()
    let momentum_end = moment(body.split('T')[0]).endOf('day').toDate()
  
    let fetchData = dailytask.find({
        created_at: {
            $gte: momentum_start,
            $lte: momentum_end
        }
    
    },(err,docs)=>{
        if(err){
            res.status(400).send({
                "message":err,
                "status":false
            })
        }
        else{
            res.send({
                "message":docs,
                "status":true
            })
        }
    }).sort({created_at:-1})
})


export {indexpage,registerUser,loginUser,createTask,deleteTask,updateTask,refreshUserData,aggregateData,insightData,checkEmail,logmessage}