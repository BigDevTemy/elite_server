import mongoose from 'mongoose'

const adminSchema = mongoose.Schema({
    firstname:{
        type:'String',
        required:[true],
        
    },
    lastname:{
        type:'String',
        required:[true],
        
    },
    password:{
        type:'String',
        required:[true]
    },
    roleid:{
        type:'String',
        required:[true]
    },
    
    status:{
        type:'String',
        required:[true],
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
    
    created_at:{
        type:Date,
        default: new Date()
    }

})


export default mongoose.model('admin',adminSchema)