
import express from 'express'
import bodyParser from 'body-parser'
import userRouter from './routes/userRoute.js'
import adminRouter from './routes/adminRoute.js'
import cors from 'cors'
import logger from 'morgan'
import dotenv from 'dotenv'
import mongoose from 'mongoose';

dotenv.config();
var app = express();

mongoose.connect(process.env.MONGO_URI,{
  useNewUrlParser:true,
  useUnifiedTopology:true
})
.then(()=>{
  console.log('Successfully Connected to Database')
})
.catch((error)=>{
  console.log('Database Connection Error');
  console.error(error)
  process.exit(1);
})


const port = process.env.PORT || 5000;



app.use(logger('dev'));
app.use(bodyParser.json({limit:"50mb"}));
app.use(bodyParser.urlencoded({limit:"50mb",extended:true, parameterLimit:50000}));

app.use(cors());

const corsOptions={
    origin:true,
    credentials:true
}
app.options('*',cors(corsOptions));
app.use('/users',userRouter);
app.use('/admin',adminRouter);

app.use(function(req, res, next) {
    res.status(404).json({
      message: "No such route exists"
    })
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    res.status(err.status || 500).json({
      message: "Error Message"
    })
  });

app.listen(port,function(){
    console.log(`App is listening on port ${port}`)
})

