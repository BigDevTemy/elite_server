import users from '../models/users.js'
import bcrypt from 'bcryptjs'
const indexpage = ((req,res)=>{
    res.send('Welcome User to Heroku Server');
})


const registerUser  = ((req,res)=>{

const body = req.body;

    console.log(req.body);
    res.send({
        'message':'Saved',
        'status':true
    })
    return false;
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
              const userCreated = new users(body);


              const salt = await bcrypt.genSalt(10);
              userCreated.password = await bcrypt.hash(userCreated.password, salt);
              userCreated.save().then((doc) => res.status(201).send(doc));


        }
    })
})
export {indexpage,registerUser}