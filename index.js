const express = require("express");
const path = require("path");
const fs = require("fs");
const bodyparser= require('body-parser');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/contactZenith', {useNewUrlParser: true});
const port = 8000;
const nodemailer = require("nodemailer");

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static'))     //  For serving static files
app.use(express.urlencoded())

// PUG SPECIFIC STUFF
app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', path.join(__dirname, 'views')) // Set the views directory
 
// ENDPOINTS
app.get('/', (req, res)=>{
    res.status(200).render('index.pug');
})

app.get('/services', (req, res)=>{
  
  res.status(200).render('services.pug');
})

app.get('/paid', (req, res)=>{
  
  res.status(200).render('paid.pug');
})


app.get('/seo', (req, res)=>{
  
  res.status(200).render('seo.pug');
})

app.get('/web', (req, res)=>{
  
  res.status(200).render('web.pug');
})


//schema
const contactSchema = new mongoose.Schema({
  first: String,
  last: String,
  contact: String,
  email: String,
  company: String
});

const contact = mongoose.model('contact', contactSchema);

app.post('/', (req, res)=>{
  var myData = new contact(req.body);
  myData.save().then(()=>{
       res.status(200).render('index.pug');

       const output=`<p>You have a new contact</p>
       <h2>Contact details are below</h2>
       <ul>
       <li> Name:<b> ${req.body.first} ${req.body.last} </b></li>
       <li>Contact:<b> ${req.body.contact} </b></li>
       <li>Email:<b> ${req.body.email} </b></li>
       <li>Company:<b> ${req.body.company} <b/></li>
      </ul>
      `
    
      var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'vikasyadav281998@gmail.com',
        pass: '8108785088'
      }
    });
    
    var mailOptions = {
      from: 'vikasyadav281998@gmail.com',
      to: 'vikasyadav280998@gmail.com',
      subject: 'Sending Email using Node.js',
      html: output
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
      }).catch(()=>{
      res.status(400).send("item was not saved to the database")
      })
})


// START THE SERVER
app.listen(port, ()=>{
    console.log(`The application started successfully on port ${port}`);
});