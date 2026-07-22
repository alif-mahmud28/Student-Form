const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));
app.get("/",(req,res)=>{

    res.sendFile(path.join(__dirname,'public','index.html'));

})
app.get("/showstudents",(req,res)=>{

    res.sendFile(path.join(__dirname,'public','show_details.html'));

})

const db= mysql.createConnection({
   host:"localhost",
   user:'root',
   password:'',
   database :'Student_info'

})
db.connect((err)=>{
    if(err){console.log('Error connecting to the database:',err)


    }
    else{
        console.log('Connected to the database');
        
    }
})

app.post('/addStudent',(req,res)=>{
    const {first_name,last_name,department,student_id,session,semester,blood_group,dob,mobile,email,password,permanent_address,present_address
    }=req.body;
    console.log(req.body);
    bcrypt.hash(password,saltRounds,(err, hash) =>{
     if(err){
        console.log("Error hashing password",err);
     }else{
        const query='INSERT INTO student (first_name,last_name,department,student_id,session,semester,blood_group,dob,mobile,email,password,permanent_address,present_address) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';
    db.query(query,[first_name,last_name,department,student_id,session,semester,blood_group,dob,mobile,email,hash,permanent_address,present_address],(err,result)=>{
        if(err){
            console.log("Error  Inserting data",err);
            res.status(500).send("Error  Inserting data");
        }else{
              console.log("Inserted data successfully");
            res.status(200).send("Inserting data");
        }
        
    })
     }
    })
   
})

app.get('/getinfo', (req, res) => {

    const query = 'SELECT * FROM student';

    db.query(query, (err, result) => {

        if (err) {
            console.log('Error fetching data from the database:', err);
            res.status(500).send('Error fetching data from the database');
        } else {
            console.log('Data fetched successfully');
            console.log(result);
            res.status(200).json(result);
        }

    });

});





const PORT = 4000;
app.listen(PORT,()=>{

    console.log(`Server is running on port ${PORT}`);


})