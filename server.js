 var express=require('express');
const mustacheExpress=require('mustache-express');
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
 app.listen(8002,()=>{console.log("server is running at port 8002..")});
