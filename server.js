var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var cors = require('cors');

app.use(bodyParser.json());
app.use(cors());
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);
app.use(express.static('posters'));

// default route
app.get('/', function(req, res) {
	return res.send({ error: true, message: 'hello' });
});

// connection configurations
var dbConn = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'mysql_123',
	database: 'movie'
});

dbConn.connect();

// Retrieve all users
app.get('/movies', function(req, res) {
	dbConn.query('SELECT * FROM movies', function(error, results, fields) {
		if (error) throw error;
		return res.json({ error: false, data: results, message: 'movies list.' });
	});
});


// Update user with id
app.put('/movie', function(req, res) {
	let movie = req.body.movie;
	let { id, like_count } = movie;
	if (!movie) {
		return res.status(400).send({ error: movie, message: 'Please provide movie' });
	}

	dbConn.query('UPDATE movies SET like_count = ? WHERE id = ?', [like_count, id], function(error, results, fields) {
		if (error) throw error;
		return res.send({ error: false, data: results, message: 'movie has been updated successfully.' });
	});
});

app.listen(5000, function() {
	console.log('App is running on port 5000');
});

module.exports = app;
