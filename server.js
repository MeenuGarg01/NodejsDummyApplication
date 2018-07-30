 var express=require('express');
const mustacheExpress=require('mustache-express');

require('dotenv').config();//to load all the configuration
//console.log(process.env);
 const app=express();

 const mustache=mustacheExpress();
 mustache.cache=null;
app.engine('mustache',mustache);
app.set('view engine','mustache');

app.use(express.static('public'));

app.get('/',(req,res)=>{
res.send("test");
});

app.get('/student',(req,res)=>{
res.render('student');
});
 app.listen(process.env.PORT,()=>{
   console.log(`server is running at port ${process.env.PORT}..`);
 });
