import users from '../models/users.js'
import plan from '../models/plan.js'
import bcrypt from 'bcryptjs'
const indexpage = ((req,res)=>{
    res.send('Welcome User to Heroku Server');
})


const registerUser  = ((req,res)=>{

    const body = req.body.data;

    // console.log(req.body.data.email);
    // res.send({
    //     'message':'Saved',
    //     'status':true,
    //     'data':req.body
    // })
    // return false;
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
            if(req.body.data.status == "success"){
                commitment_fee_status="paid"
            }else{
                commitment_fee_status="unpaid"
            }
            // let gender,weight,age,plan,plan_status,planpaymentamount,plan_reference;
            
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

            if(body.plan.status && body.plan_status == "success"){
                const createPlan = await plan.create({
                    userid:userCreated._id,
                    amount:body.planpaymentamount,
                    plan_type:body.plan,
                    payment_reference:body.plan_reference,
                    plan_status:body.plan_status,
                    dateofpayment:Date.now,

                })
            }

            if(userCreated){
                res.send({
                    'message':'User successfully created',
                    'data':userCreated
                })
            }
            else{
                res.send({
                    'message':'Something went wrong',
                    
                })
            }


        }
    })
})
export {indexpage,registerUser}