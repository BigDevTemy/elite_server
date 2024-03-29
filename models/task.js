import mongoose from 'mongoose'

const taskSchema = mongoose.Schema({
    title:{
        type:'String',
        required: [true, "Required"]
    },
    duration:{
        type:'String',
        required: [true, "Required"]
    },

    participants:[{userid:"String", name:"String",emailaddress:'String',status:Boolean}],
    coach:{
        type:"String",
        required: [true, "Required"]
    },
    coachid:{
        type:"String",
        required: [true, "Required"]
    },
    category:{
        type:"String",
        required: [true, "Required"]
    },
    created_at:{
                type:Date,
                default: new Date()
            },
    updated: { type: Date, default: Date.now }
})

export default mongoose.model('taskmanager', taskSchema)