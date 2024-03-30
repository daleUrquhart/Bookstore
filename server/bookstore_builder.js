//db builder

var mysql = require('mysql')
const fs = require('fs');

const csvFilePath = 'public/data.csv';
const csvData = fs.readFileSync(csvFilePath, 'utf-8');
const rows = csvData.trim().split('\n').map(row => row.split(','));

//define the SQL query to insert data into the table
const tableName = 'books'; 
const columns = ['isbn13', 'isbn10', 'title', 'subtitle', 'authors', 'categories', 'thumbnail', 'description', 'published_year', 'average_rating', 'num_pages', 'ratings_count'];
const placeholders = columns.map(() => '?').join(',');
const sql = `INSERT INTO ${tableName} (${columns.join(',')}) VALUES (${placeholders})`;

//create connection
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ThinkSmart#10',
    database: 'bookstore'
})

//connect
con.connect(function(err) {
    if(err){
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log("Connected to MySQL")
})

//insert data
rows.forEach(row => {
    con.query(sql, row, (err, result) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            return;
        }
        console.log('Inserted row:', result.insertId);
    });
});

//close connection
con.end();

//CREATE TABLE user_accounts (user_id INT AUTO_INCREMENT PRIMARY KEY, first_name VARCHAR(255), last_name VARCHAR(255), email VARCHAR(255) UNIQUE, phone VARCHAR(20), balance DECIMAL(10, 2), created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);
