const exp=require('express')
const app=exp();
const userApi=require('./apis/user')
require('dotenv').config();
const cors=require('cors');
app.use(exp.json());
app.use(cors());
const mclient=require('mongodb').MongoClient;
mclient.connect(process.env.DATABASE_URL)
.then((client)=>{
    let database=client.db('userlist');
    let usercollection=database.collection('user');
    console.log("Database connection success");
    app.set('usercollection',usercollection);
})
.catch((error)=>{
    console.log(error);
})
app.use('/user',userApi);
app.listen(process.env.PORT,()=>{
    console.log("Server listening to PORT ",process.env.PORT);
})