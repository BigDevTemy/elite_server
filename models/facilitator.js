import mongoose from 'mongoose'

const facilitatorSchema = mongoose.Schema({
    firstname:{
        type:'String',  
    },
    lastname:{
        type:'String',
        
    },
    password:{
        type:'String',
    },
   
    status:{
        type:'String',
    },
    
    email:{
        type:'String',
        unique:true,
        lowercase:true,
        required:[true],
        match:[/\S+@\S+\.\S+/, 'is valid']
        
    },
   
 
    created_at:{
        type:Date,
        default: new Date()
    }

})


export default mongoose.model('facilitator',facilitatorSchema)