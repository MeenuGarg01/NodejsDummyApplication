 var express=require('express');
const mustacheExpress=require('mustache-express');
const bodyParser=require('body-parser');
var pg = require('pg');
var conString = "postgres://meenu:Meenu@123@localhost:5432/RestAPI";
var session = require('express-session');


require('dotenv').config();//to load all the configuration
//console.log(process.env);
 const app=express();

 const mustache=mustacheExpress();
 mustache.cache=null;
app.engine('mustache',mustache);
app.set('view engine','mustache');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({ secret: 'cookie_secret',
                  resave: true,
                  saveUninitialized: true}));

app.get('/',(req,res,next)=>{
  if (req.session.views) {
      req.session.views++;
      res.setHeader('Content-Type', 'text/html');
      res.write('<p>views: ' + req.session.views + '</p>');
      res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>');
      res.end();
    } else {
      req.session.views = 1;
      res.end('welcome to the session demo. refresh!');
    }
});

app.get('/StudentSignUp',(req,res)=>{
  res.render('StudentSignUp');
});


app.post('/StudentSignUpConfirmationPage',(req,res)=>{
  var client = new pg.Client(conString);
client.connect().then(()=>{
console.log('conection is successful');
    const sql=`insert into "Student"(s_fullname,s_username,s_password,s_email,s_address) VALUES ($1,$2,$3,$4,$5)`;
  const params=[req.body.fullname,req.body.username,req.body.password,req.body.email,req.body.address];
  return client.query(sql,params);
}).then((result)=>{
console.log('result?',result);
res.render('StudentSignUpConfirmationPage');
}).catch((err)=>{
  console.log(err);
  res.send(err);
});
});


app.get('/AllStudent',(req,res)=>{
  var client = new pg.Client(conString);
  console.log("display the record for all students");
  client.connect().then(()=>{
    return client.query(`select * from "Student" order by s_id desc`);
    }).then((result)=>{
      console.log(result);
        console.log('-------------------------------------------------------');
        res.render('allStudentData',result);
      }).catch((err)=>{
          console.log(err);
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

app.get('/student/edit/:id',(req,res)=>{
  const client =new pg.Client(conString);
  client.connect().then(()=>{
  const sql=`select * from "Student" where s_id=$1`;
  const params=[req.params.id];
  return client.query(sql,params);
}).then((result)=>{
  console.log(result);
  res.render('StudentEdit',result.rows[0]);
}).catch((err)=>{console.log('error',err);
res.send(err);}
);
});

app.post('/student/edit/:id',(req,res)=>{
  const client=new pg.Client(conString);
  client.connect().then(()=>{
    const sql=`update "Student" set s_username=$1, s_email=$2, s_password=$3 where s_id=$4;`;
    const params=[req.body.username,req.body.email,req.body.password,req.params.id];
    console.log(sql);
    console.log(params);
    return client.query(sql,params);
  }).then((result)=>{
    console.log(result);
    //app.get('/AllStudent');
res.redirect('/AllStudent');
  }).catch((error)=>{
    console.log(error);
  });

});


 app.listen(process.env.PORT,()=>{
   console.log(`server is running at port ${process.env.PORT}..`);
 });
