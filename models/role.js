import mongoose from 'mongoose'

const roleSchema = mongoose.Schema({
    rolename:{
        type:'String',
        required:[true],
        
    },

    created_at:{
        type:Date,
        default: new Date()
    }

})


export default mongoose.model('role',roleSchema)