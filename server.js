 var express=require('express');
const mustacheExpress=require('mustache-express');
const bodyParser=require('body-parser');
var pg = require('pg');
var conString = "postgres://meenu:Meenu@123@localhost:5432/RestAPI";



require('dotenv').config();//to load all the configuration
//console.log(process.env);
 const app=express();

 const mustache=mustacheExpress();
 mustache.cache=null;
app.engine('mustache',mustache);
app.set('view engine','mustache');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));


app.get('/',(req,res)=>{
  res.send("test");
});

app.get('/student',(req,res)=>{
  res.render('student');
});
app.get('/AllStudent',(req,res)=>{
  var client = new pg.Client(conString);
  console.log("display the record for all students");
  client.connect().then(()=>{
    return client.query(`select * from "Student"`);
    }).then((result)=>{
      console.log(result);
        console.log('-------------------------------------------------------');
        res.render('allStudentData',result);
      }).catch((err)=>{
          console.log(err);
          });

});

app.post('/AllStudent',(req,res)=>{
  var client = new pg.Client(conString);
client.connect().then(()=>{
console.log('conection is successful');
    const sql=`insert into "Student"(s_name,s_username,s_password,s_email) VALUES ($1,$2,$3,$4)`;
  const params=[req.body.name,req.body.username,req.body.password,req.body.email];
  return client.query(sql,params);
}).then((result)=>{
console.log('result?',result);
res.redirect('AllStudent');
}).catch((err)=>{
  console.log(err);
  res.send(err);
});
});



 app.post('/student/delete/:id',(req,res)=>{
const client=new pg.Client(conString);
client.connect().then(()=>{
  const sql=`delete from "Student" where s_id=`+req.params.id;
  console.log(sql);
return client.query(sql);
}).then((result)=>{console.log(result);
res.send('record deleted');
})
.catch((err)=>{console.log(err);})
 });



 app.listen(process.env.PORT,()=>{
   console.log(`server is running at port ${process.env.PORT}..`);
 });
