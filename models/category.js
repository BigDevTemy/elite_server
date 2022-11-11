import mongoose from 'mongoose'

const categorySchema = mongoose.Schema({
    name:{
        type:'String',
        
    },
    status:{
        type:'String',
        
    },
   
    created_at:{
        type:Number,
        default: new Date()
    }

})


export default mongoose.model('category',categorySchema)