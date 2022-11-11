import mongoose from 'mongoose'

const discoverSchema = mongoose.Schema({
    title:{
        type:'String',
        required:[true]
        
    },
    allotted_time:{
        type:'String',
        required:[true]
        
    },
    level:{
        type:'String',
        required:[true]
    },
    category:{
        type:'String'
    },
    status:{
        type:'String'
    },
    created_at:{
        type:Number,
        default: new Date()
    }

})


export default mongoose.model('discover',discoverSchema)