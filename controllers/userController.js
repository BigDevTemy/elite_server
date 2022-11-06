import users from '../models/users.js'
import plan from '../models/plan.js'
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
const indexpage = ((req,res)=>{
    res.send('Welcome User to Heroku Server');
})

function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
  }

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
            res.status(400).send(err);
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
export {indexpage,registerUser}