import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    userid:{
        type:'String',
        required:[true]
        
    },
    plan_type:{
        type:'String',
        required:[true]
        
    },
    dateofpayment:{
        type:'String',
        required:[true]
    },
    payment_reference:{
        type:'String',
        required:[true]
    },
    plan_status:{
        type:'String'
    },
    expirydate:{
        type:'String',
        
    },
    amount:{
        type:'String',
        
    },
    created_at:{
        type:Number,
        default: Date.now
    }

})


export default mongoose.model('user',userSchema)