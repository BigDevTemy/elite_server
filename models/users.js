import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    firstname:{
        type:'String',
        
    },
    lastname:{
        type:'String',
        
    },
    password:{
        type:'String',
        required:[true]
    },
    reference:{
        type:'String',
        required:[true]
    },
    status:{
        type:'String',
    },
    commitment_fee:{
        type:'String',
        
    },
    email:{
        type:'String',
        unique:true,
        lowercase:true,
        required:[true],
        match:[/\S+@\S+\.\S+/, 'is valid']
        
    },
    email_verified:{
        type:'String', 
    },
    gender:{
        type:'String',
        
    },
    weight:{
        type:'String',
    },
    created_at:{
        type:Number,
        default: new Date()
    }

})


export default mongoose.model('user',userSchema)