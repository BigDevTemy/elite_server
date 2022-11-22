import users from '../models/users.js'
import planpackage from '../models/plan.js'
import dailytask from '../models/dailytask.js'
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import moment from 'moment';
import discover from '../models/discover.js';



const indexpage = ((req,res)=>{
    res.send('Welcome User to Heroku Server');
})

const checkEmail = ((req,res)=>{
    let Email = req.body.data.email
    console.log(Email)
    console.log(req.body.data)
    users.findOne({email:Email},(err,docs)=>{
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

function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '216000s' });
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

const loginUser = ((req,res)=>{
    let body = req.body.items
    
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
            const token = generateAccessToken({ email:body.email });
            
            if(checkpassword){
               
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
                                'token':token
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
                'message':'Invalid Email Address',
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

    const body = req.body.data;
    
   
   // console.log(req.body);
    // res.send({
    //     'message':'Saved',
    //     'status':true,
    //     'data':req.body
    // })
    //return false;


    users.findOne({email:body.email},async (err,docs)=>{
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
                let password = await bcrypt.hash(body.password, salt);
            //   userCreated.save().then((doc) => res.status(201).send(doc));
            let commitment_fee_status 
            if(body.status == "success"){
                commitment_fee_status="paid"
            }else{
                commitment_fee_status="unpaid"
            }
           
           try{
                 
            const userCreated = await users.create({
                password:password,
                reference:body.reference,
                status:body.status,
                commitment_fee:commitment_fee_status,
                email:body.email,
                email_verified:false,
                gender:body.gender,
                weight:body.weight,
                age:body.age,
                firstname:body.firstname,
                lastname:body.lastname
            })
            const token = generateAccessToken({ email: body.email });

            if(body.plan_status && body.plan_status == "success"){
                let mydate = new Date();
                const createPlan = await planpackage.create({
                    userid:userCreated._id,
                    amount:body.planpaymentamount,
                    plan_type:body.plan,
                    payment_reference:body.plan_reference,
                    plan_status:body.plan_status,
                    dateofpayment:mydate.getDate() + '-' + mydate.getMonth() +'-'+ mydate.getFullYear(),

                })
            }

            if(userCreated){
                res.send({
                    'message':'User successfully created',
                    'data':userCreated,
                    'status':true,
                    'token':token
                })
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
        let todayTasks = await dailytask.find({
            created_at: {
              $gte: today.toDate(),
              $lte: moment(today).endOf('day').toDate()
            }
          }).sort({'created_at':-1})
        res.send({
            'message':'Task Created Successfully',
            'todayTasks':todayTasks,
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
            res.status(400).send({
                "message":'User doesnt Exit',
                "status":false
            })
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
    let body = req.body.items
   let x =  moment(body.date).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  
    let fetchData = dailytask.find({
        created_at: {
            $gte: moment(body.date).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
            $lte: moment(body.date).endOf('day').toDate()
            
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
    })
})


export {indexpage,registerUser,loginUser,createTask,deleteTask,updateTask,refreshUserData,aggregateData,insightData,checkEmail}