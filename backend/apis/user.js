const exp=require('express')
const userapp=exp.Router()
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
require('dotenv').config();
const expressAsyncHandler = require('express-async-handler')
userapp.use(exp.json())
userapp.post('/create-user',expressAsyncHandler(async(request,response)=>{
    let usercollection=request.app.get('usercollection')
    let userdetails=request.body;
    let userOfDb=await usercollection.findOne({username:userdetails.username});
    if(userOfDb===null){
        //not present
        let hashpswd=await bcryptjs.hash(userdetails.password,6);
        userdetails.password=hashpswd;
        await usercollection.insertOne(userdetails)
        response.send({message:"Account created successfully"});
    }
    else{
        response.send({message:"Username already exists"});
    }
}))
userapp.post('/login',expressAsyncHandler(async(request,response)=>{
    let usercollection=request.app.get('usercollection')
    let userdetails=request.body;
    let userOfDb=await usercollection.findOne({username:userdetails.username});
    if(userOfDb===null){
        response.send({message:"Invalid user"})
    }
    else{
        let status=await bcryptjs.compare(userdetails.password,userOfDb.password);
        if(status===true){
            let token=jwt.sign(userdetails,process.env.SECRET_KEY,{expiresIn:20});
            response.send({message:`Welcome ${userdetails.username}`,payload:token,userObj:userOfDb});
        }
        else{
            response.send({message:"Incorrect password"});
        }
    }
}))

module.exports=userapp;