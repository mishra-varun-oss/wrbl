const fs = require('fs');
const http = require('http');
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const body_parser = require('body-parser');
const session = require('express-session');
const ws = require('ws');

const app = express();

const public_directory = path.join(__dirname, "../public");
const views_directory = path.join(__dirname, "../templates/views");

//const post = require(path.join(__dirname, "./routes/post.js"));
//const analytics = require(path.join(__dirname, "./routes/analytics.js"));
const word_cloud = require(path.join(__dirname, "./routes/word_cloud.js"));

//const utils = require(path.join(__dirname, "./tools/utils.js"));
//const db = require(path.join(__dirname, "./tools/db.js"));
const configs = require(path.join(__dirname, "./tools/configs.js"));
console.log(configs.src_config_obj);
require('dotenv').config(configs.src_config_obj);

app.set('view engine', '.hbs');
app.set('views', views_directory);

app.use(express.static(public_directory));
app.use(body_parser.json());
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));
app.use(session({ 
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true
}))

//app.use('/post', post);
app.use('/wordcloud', word_cloud);
//app.use('/analytics', analytics);
app.get('/', (req, res) => {
	res.send('Welcome to Wrbl!');
/*
	let q = `SELECT COUNT(*) FROM web_traffic`;
	db.query(q, (err, results) => {
		if (err) throw err;
		let r = results[0]['COUNT(*)'];
		res.render('index', { count: r });
	})
*/
})

const server = http.createServer(app);
/*
const wss = new ws.Server({ noServer: true, path: '/analytics' });

wss.on('connection', (ws, req) => {
	ws.on('message', (data) => {
		let m = JSON.parse(data);

		if (m.type == 'request') {
			let file_path = path.join(process.env.NGINX_LOG_PATH, 'wrblnyc.access.log');
			fs.readFile(file_path, (err, data) => {
				if (err) throw err;
				let records = data.toString().split("\n");
				if (records.length > 0) {
					utils.enter_records(records)
					.then((obj) => {	
						if (obj.records.length > 0) {
							fs.truncate(file_path, 0, () => { ws.send(JSON.stringify(obj)) })
						} else {
							let obj = { type: 'record_list', updated: true }
							ws.send(JSON.stringify(obj));
						}
					})
				} else {
					let obj = { type: 'record_list', updated: true }
					ws.send(JSON.stringify(obj));
				}
			})
		}
	})
})

server.on('upgrade', (request, socket, head, client) => {
	wss.handleUpgrade(request, socket, head, (ws) => {
		wss.emit('connection', ws, request, client);
	});
});
*/
const port = process.env.PORT;
server.listen(port, (err) => {
	if (err) {
		console.log(err);
	}
	console.log(`wrbl.nyc is up on port ${port}!`);
})
