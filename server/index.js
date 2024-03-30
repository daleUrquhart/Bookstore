// Packages
const nodemailer = require('nodemailer')
const mysql = require('mysql')
const path = require('path');
const express = require('express');
const session = require('express-session');
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080', // Change this to match your Express server port
      changeOrigin: true,
    })
  );
};

// Create mysql connection
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ThinkSmart#10',
    database: 'bookstore'
})

// Connect to mysql
con.connect(function(err) {
    if(err){
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log("Connected to MySQL")
})

// Create mail connection
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'daleurquhart1@gmail.com',
        pass: 'mqzl pjeg uvlt tikg' //app password for NodeMailer
    }
})

// App
const app = express();
const staticDir = path.join(__dirname, '../client/public');
const jsDir = path.join(__dirname, '../client/src');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', path.join(__dirname, 'views')); // Set the views directory

app.use(session({
    secret: 'd8992cab1566f94df3a10256697622d435cc1e28361cbf68d83e2fcf3c5aa9f2', // Secret key to sign the session ID cookie
    resave: false, // Whether to save the session for every request, even if it's not modified
    saveUninitialized: false, // Whether to save uninitialized sessions
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // Session duration in milliseconds (e.g., 1 day)
      httpOnly: true, // Ensures that the session cookie is not accessible via client-side JavaScript
      secure: false, // If true, the cookie will only be sent over HTTPS
      sameSite: 'strict', // Restricts the cookie to be sent only with "same-site" requests
    },
  }));

app.use(express.static(staticDir));// Static route
app.use('/js', express.static(path.join(jsDir)));// JS route

// Index route
app.get('/', (req, res) => res.sendFile(path.join(staticDir, 'index.html')))

// Books route
app.get('/books', (req, res) => res.sendFile(path.join(staticDir, 'books.html')))

// Contact route
app.get('/contact', (req, res) => res.sendFile(path.join(staticDir, 'contact.html')))

// Sign up route
app.get('/signup', (req, res) => res.sendFile(path.join(staticDir, 'signup.html')))

// Sign in route
app.get('/signin', (req, res) => res.sendFile(path.join(staticDir, 'signin.html')))

// Account management route
app.get('/signin', (req, res) => res.sendFile(path.join(staticDir, 'signin.html')))

// Gets book data from mysql and sends it to client
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

// Takes mail data from client, then builds and sends email
app.post('/mailman', (req, res) => {
    console.log('Sending mail')
    // Get post data
    const { message, phone, email, first, last } = req.body;

    // Build mail data
    var mailOptions = {
        from: 'daleurquhart1@gmail.com',
        to: 'daleurquhart1@gmail.com',
        subject: `${first} ${last}, ${email}, ${phone}`,
        text: message
    }

    // Send mail
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.error('Error sending email:', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Email sent successfully');
            res.status(200).send('Email sent successfully');
        }
    });
});

/*
BELOW CODE NEEDS TESTING
*/

// Adds an account
app.post('/addaccount', (req, res) => {
    // Get post data and make query
    const { first_name, last_name, email, phone, username, password, balance, code, usercode } = req.body;

    if (code !== usercode) {
        console.error('Verification codes do not match.');
        res.status(400).json({ message: 'Verification codes do not match.' });
        return;
    }

    const sql = `INSERT INTO user_accounts (first_name, last_name, email, phone, username, password, balance) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    // Add account to table
    con.query(sql, [first_name, last_name, email, phone, username, password, balance], (err, result) => {
        if (err) {
            console.error('Error adding account: ', err);
            if (err.code === 'ER_DUP_ENTRY') {
                if (err.sqlMessage.includes('email')) {
                    res.status(400).json({ message: 'Duplicate email.' });
                } else if (err.sqlMessage.includes('username')) {
                    res.status(400).json({ message: 'Duplicate username.' });
                } else {
                    res.status(500).json({ message: 'Internal Server Error' });
                }
            } else {
                res.status(500).json({ message: 'Internal Server Error' });
            }
            return;
        }
        console.log('Account added successfully');
        res.status(200).json({ message: 'Account added successfully' });
    });
});


// Takes mail data from client, then builds and sends email
app.post('/verify_email', (req, res) => {
    console.log('Sending mail');
    // Generate verification code
    var code = Math.floor(100000 + Math.random() * 900000);
    code = code.toString(); 
    const { email } = req.body;

    // Build mail data
    var mailOptions = {
        from: 'daleurquhart1@gmail.com',
        to: email,
        subject: `${code}`,
        text: "In the subject, is your verification code."
    }

    // Send mail
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.error('Error sending email:', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Email sent successfully');
            // Send verification code back to client
            res.status(200).json({ code: code, message: 'Email sent successfully' });
        }
    });
});

// Route to handle updating an account
app.put('/updateaccount/:id', (req, res) => {
    const accountId = req.params.id;
    const { first_name, last_name, email, phone, balance } = req.body;
    const sql = `UPDATE user_accounts SET first_name = ?, last_name = ?, email = ?, phone = ?, balance = ? WHERE user_id = ?`;
    acc_con.query(sql, [first_name, last_name, email, phone, balance, accountId], (err, result) => {
        if (err) {
            console.error('Error updating account:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('Account updated successfully');
        res.status(200).send('Account updated successfully');
    });
});

// Route to handle user login and session creation
app.post('/login', (req, res) => {
    const { email, password, code, usercode } = req.body;

    // Check if the email, password, and verification code are provided
    if (!email || !password || !code || !usercode) {
        return res.status(400).send('Email, password, code, and usercode are required');
    }

    // Verify user code
    if (code !== usercode) {
        console.log("BAD AUTH CODE")
        return res.status(401).send('Invalid verification code');
    }

    // Auth and login
    con.query('SELECT * FROM user_accounts WHERE email = ?', [email], (err, result) => {
        if (err) {
            console.error('Error retrieving user details:', err);
            return res.status(500).send('Internal Server Error');
        } 

        // Check if user exists
        if (result.length === 0) {
            return res.status(401).send('Invalid email or password');
        }

        // Validate password
        const user = result[0];
        if (password !== user.password) {
            console.log("BAD PASS")
            return res.status(401).send('Invalid email or password');
        }

        // Start a session for the authenticated user
        req.session.user = { userId: user.user_id, email: user.email, username: user.username };
        console.log("SIGNED IN SUCCESFULLY")
        res.status(200).json({ message: 'Signed in successfully' });
    });
});

// Route to get email by username
app.get('/email/:username', (req, res) => {
    const { username } = req.params;

    // Check if username is provided
    if (!username) {
        return res.status(400).send('Username is required');
    }

    // Query the database to retrieve email by username
    con.query('SELECT email FROM user_accounts WHERE username = ?', [username], (err, result) => {
        if (err) {
            console.error('Error retrieving email by username:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Check if username exists
        if (result.length === 0) {
            return res.status(404).send('Username not found');
        }

        // Return the email associated with the username
        const email = result[0].email;
        res.status(200).json({ email });
    });
});

// Route to search for user accounts
app.get('/searchaccounts', (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).send('Bad Request: Missing search query');
    }

    const searchQuery = '%' + query + '%'; //wildcard characters for partial search
    const sql = 'SELECT * FROM user_accounts WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ?';
    con.query(sql, [searchQuery, searchQuery, searchQuery, searchQuery], (err, results) => {
        if (err) {
            console.error('Error searching user accounts:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results);
    });
});

app.get('/accountdetails/:id', (req, res) => {
    const userId = req.params.id;

    // Implement logic to fetch detailed information about a specific user account
    const sql = 'SELECT * FROM user_accounts WHERE user_id = ?';
    con.query(sql, userId, (err, result) => {
        if (err) {
            console.error('Error fetching user account details:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (result.length === 0) {
            return res.status(404).send('User account not found');
        }
        res.json(result[0]);
    });
});

app.post('/passwordreset', (req, res) => {
    const { email } = req.body;

    // Implement logic to initiate password reset process
    // For example, you can generate a reset token and send it to the user's email
    const resetToken = generateResetToken(); // Implement function to generate reset token
    sendResetEmail(email, resetToken); // Implement function to send reset email

    // Return a success message indicating that the reset process has been initiated
    res.status(200).send('Password reset initiated successfully');
});

//route to handle user logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error logging out:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/index');
    });
});

app.post('/passwordreset', (req, res) => {
    const { email } = req.body;
    const resetToken = generateResetToken();
    sendResetEmail(email, resetToken); 

    res.status(200).send('Password reset initiated successfully');
});

app.put('/changepassword/:id', (req, res) => {
    const userId = req.params.id;
    const { oldPassword, newPassword } = req.body;
    const sql = 'UPDATE user_accounts SET password = ? WHERE user_id = ? AND password = ?';
    con.query(sql, [newPassword, userId, oldPassword], (err, result) => {
        if (err) {
            console.error('Error changing password:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (result.affectedRows === 0) {
            return res.status(401).send('Incorrect old password');
        }
        res.status(200).send('Password changed successfully');
    });
});

app.get('/userprofile/:id', (req, res) => {
    const userId = req.params.id;
    const sql = 'SELECT * FROM user_accounts WHERE user_id = ?';
    con.query(sql, userId, (err, result) => {
        if (err) {
            console.error('Error fetching user profile:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (result.length === 0) {
            return res.status(404).send('User not found');
        }
        // Return user profile data
        res.json(result[0]);
    });
});

app.post('/feedback', (req, res) => {
    const { userId, feedback } = req.body;
    const sql = 'INSERT INTO feedback (user_id, feedback_text) VALUES (?, ?)';
    con.query(sql, [userId, feedback], (err, result) => {
        if (err) {
            console.error('Error submitting feedback:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).send('Feedback submitted successfully');
    });
});

const PORT = process.env.PORT || 8080; // Use the provided PORT or default to 80880
app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`);
});