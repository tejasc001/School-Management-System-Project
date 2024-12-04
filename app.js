// import mysql from 'mysql2'
// import express from 'express';
// import ejsmate from 'ejs-mate';
// import path from 'path';
// import methodOverride from 'method-override'



const mysql = require('mysql2');
const express = require('express');
const ejsmate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const LocalStratergy = require('passport-local');
const User = require('./models/user');
const userRoutes = require('./routes/users');
const mongoose = require('mongoose');
const flash = require('express-flash');
const {isLoggedIn}=require('./public/javascripts/middleware.js');

const app = express();
app.engine('ejs', ejsmate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const dburl='mongodb://127.0.0.1:27017/student'
mongoose.connect(dburl)
    .then(() => {
        console.log(" mongo connection open")
    }).catch((err) => {
        console.log("ERROR");
        console.log(err);
    })


const pool=mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'user',
    database:'student'
}).promise()


const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.currentUser = req.user.name;
        console.log(res.locals.currentUser);
    }
    next();
});



app.get('/index',isLoggedIn,async (req,res)=>{
    const student=await pool.query("select * from student");
    console.log(student[0]);
    const  rr=student[0];
    res.render("index",{student,rr});
})


app.get('/student/:id',async (req,res)=>{
    const id=req.params.id;
    console.log(id);
    const findstudent=await pool.query(`select * from student where std_id = ?`,[id]);
    const ff=findstudent[0];
    console.log(ff);
    const all_details=await pool.query(`select   s.std_id,s.student_name,s.dob,s.gender,s.address,sc.section_name,sd.standard_name
     from student s inner join sat t on(s.std_id=t.std_id) inner join section sc on(t.section_id=sc.section_id) 
     inner join standard sd on(sd.standard_id=t.standard_id) where s.std_id=?`,[id]);
     console.log(all_details[0]);
     const dd=all_details[0];
    res.render("showstudentdetails",{ff,dd});
})


app.get('/upload',(req,res)=>{
    res.render("new")
})

app.post('/upload',async(req,res)=>{
    const studentname=req.body.studentname;
    const gender=req.body.gender;
    const date=req.body.selectedDate;
    const address= req.body.address;
    const section=req.body.section;
    const standard=req.body.standard;
    console.log(studentname +   gender +  address + section + standard +date);
    const result= await pool.query(`insert into student(student_name,dob,gender,address) values(?,?,?,?)`,[studentname,date,gender,address]);
   const stdid=await pool.query(`select std_id from student where student_name = ?`,[studentname]);
   let tt=stdid[0];
   let fstdid=(tt[0].std_id);
   console.log(fstdid);

   const secid=await pool.query(`select section_id from section where section_name = ?`,[section]);
   let ss=secid[0];
   let fsecid=(ss[0].section_id);
   console.log(fsecid);

   const stddid=await pool.query(`select standard_id from standard where standard_name = ?`,[standard]);
   let oo=stddid[0];
   let fstddid=(oo[0].standard_id);
   console.log(fstddid);

await pool.query(`insert into sat(std_id,section_id,standard_id) values(?,?,?)`,[fstdid,fsecid,fstddid]);
    req.flash('success','New Record created');
    res.redirect(`/student/${fstdid}`);
})



app.get('/marks/:id',async (req,res)=>{
    const id=req.params.id;
    const studentname=await pool.query(`select student_name from student where std_id = ? `,[id]);
    let rr=studentname[0];
    let gg=rr[0].student_name;
    console.log(gg);
    res.render("marks",{gg,id});
})


app.post('/marks/:id',async (req,res)=>{
    const id=req.params.id;
    const marks=req.body.marks;
    const subject=req.body.subject;
    const subid=await pool.query(`select sub_id from subject where subject_name =? `,[subject]);
    let io=(subid[0]);
    let qw=io[0].sub_id;
    console.log("subject id is"+qw);

    const gatid=await pool.query(`select allot_id from sat where std_id= ?`,[id]);
    const op=gatid[0];
    const gf=op[0].allot_id;
    console.log("allot _id is"+gf);

    const mi=await pool.query(`insert into marks(allot_id,sub_id,marks) values(?,?,?)`,[gf,qw,marks]);

    const hh=await pool.query(`select   y.std_id,sc.sub_id,sc.subject_name,sc.subject_code,t.marks 
    from subject sc inner join marks t on (sc.sub_id=t.sub_id) 
    inner join sat y on(y.allot_id=t.allot_id) where std_id = ?`,[id]);
    const jj=hh[0];
    //console.log(marks + subject);
    req.flash('success','Marks Inserted');
    res.render("result",{jj,id});
})







app.use('/', userRoutes);



app.use((req, res, next) => {
    // console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})




app.get('/',(req,res)=>{
    res.send("Hi Nigger!");
})




app.use((err,req,res,next)=>{
    console.log(err.stack);
    res.status(500).send("Something Broke");
})


app.listen(3000,()=>{
    console.log("Serving on port 3000");
})