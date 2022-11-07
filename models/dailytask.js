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
        type:'String',
        
    },
    date:{
        type:'String'
    },
    created_at:{
        type:Number,
        default: new Date()
    }

})


export default mongoose.model('task',dailyTaskSchema)