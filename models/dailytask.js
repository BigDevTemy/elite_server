import mongoose from 'mongoose'

const dailyTaskSchema = mongoose.Schema({
    
    userid:{
        type:'String',
        
    },
    
    task_title:{
        type:'String',
        required:[true]
    },
    allotted_time:{
        type:'String',
    },
    status:{
        type:Boolean,
        
    },
    date:{
        type:'String'
    },
    created_at:{
        type:Date,
        default: new Date()
    }

})


export default mongoose.model('task',dailyTaskSchema)