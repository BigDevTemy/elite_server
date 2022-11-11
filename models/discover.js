import mongoose from 'mongoose'

const discoverSchema = mongoose.Schema({
    title:{
        type:'String',
       
        
    },
    allotted_time:{
        type:'String',
      
    },
    asset_url:{
        type:'String',
    },
    type:{
        type:'String'
    },
    level:{
        type:'String',
        
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