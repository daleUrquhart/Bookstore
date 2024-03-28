//packages
const http = require('http');
const fs = require('fs');
const nodemailer = require('nodemailer')
const mysql = require('mysql')
const path = require('path');
const express = require('express');

//create mysql connection
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ThinkSmart#10',
    database: 'bookstore'
})

//connect to mysql
con.connect(function(err) {
    if(err){
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log("Connected to MySQL")
})

//create mail connection
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'daleurquhart1@gmail.com',
        pass: 'mqzl pjeg uvlt tikg' //app password for NodeMailer
    }
})

//app
const app = express();
const staticDir = path.join(__dirname, 'public');

//routes:
app.use(express.static(staticDir));

app.get('/', (req, res) => {
    res.sendFile(path.join(staticDir, 'index.html'));
})

app.get('/books', (req, res) => {
    res.sendFile(path.join(staticDir, 'books.html'));
})

app.get('/contact', (req, res) => {
    res.sendFile(path.join(staticDir, 'contact.html'));
})

app.get('/booksfetch', (req, res) => {
    const sql = 'SELECT title, authors, categories, description FROM books';
    con.query(sql, (err, results) => {
        if (err) {
            console.error('Error retrieving data from MySQL:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});

app.get('/mailman', (req, res) => {
    //mail data
    var mailOptions = {
        from:       'daleurquhart1@gmail.com',
        to:         'daleurquhart1@upei.ca',
        subject:    first + " " + last + ", " + email,
        text:       searchTerm
    }

    transporter.sendMail(mailOptions, function(err, info){
        if(err) console.log(err)
        else    console.log('email sent to ' + info.repsonse)
    })  
});

const PORT = process.env.PORT || 8080; // Use the provided PORT or default to 80880
app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`);
});

