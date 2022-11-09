import users from '../models/users.js'
import planpackage from '../models/plan.js'
import dailytask from '../models/dailytask.js'
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
const indexpage = ((req,res)=>{
    res.send('Welcome User to Heroku Server');
})



function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
  }


  const comparePassword = async (password, hash) => {
    try {
      // Compare password
      console.log(password);
      console.log(hash)
      return await bcrypt.compare(password, hash)
    } catch (error) {
      console.log(error)
    }
  
    // Return false if error
    return false
  }

const loginUser = ((req,res)=>{
    let body = req.body
    console.log(body)
    let mydate = new Date();
    let today = mydate.getDate() + '-' + mydate.getMonth() +'-'+ mydate.getFullYear();
    users.findOne({email:body.email},async (err,docs)=>{
        if(err){
            res.status(400).send({
                'message':err
            })
        }
        else if(docs){
            let checkpassword = await comparePassword(body.password,docs.password);
            const token = generateAccessToken({ email: body.email });
            console.log(checkpassword);
            if(checkpassword){
                
                dailytask.findOne({userid:docs._id,date:today},(err,docs_task)=>{
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
                    
                })
               
                
               
                
            }
            else{
                res.status(400).send({
                    'message':'Invalid login credentials 1',
                    'status':false
    
                })
            }
        }
        else if(!docs){
            res.status(400).send({
                'message':'Invalid login credentials 2',
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
                age:body.age
            })
            const token = generateAccessToken({ email: body.email });

            if(body.plan_status && body.plan_status == "success"){
                let mydate = new Date();
                const createPlan = await plan.create({
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
export {indexpage,registerUser,loginUser}