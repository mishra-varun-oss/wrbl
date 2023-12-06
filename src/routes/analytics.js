const fs = require('fs');
const path = require('path');
const express = require('express');

const router = express.Router();

const login = require(path.join(__dirname, "../middleware/login.js"))
const db = require(path.join(__dirname, "../tools/db.js"));
const configs = require(path.join(__dirname, "../tools/configs.js"));

require('dotenv').config(configs.src_config_obj);

router.get('/', (req, res) => {
	res.render('login');
})

router.post('/login', (req, res) => {
	//username and permission information from jalfry
	let u = req.body.username;
	let p = req.body.permission;

	//store user information in session
	req.session.username = u;
	req.session.role = p;
	req.session.loggedin = true;

	//redirect user to the application
	res.send({ url: `https://wrbl.nyc/analytics/view` });
})

router.use(login.login_check);

router.get('/logout', (req, res) => {
	req.session.destroy();
	res.redirect('/analytics?logout=true');
})

router.get('/view', (req, res) => {
	let q = `SELECT * FROM web_traffic ORDER BY id DESC`;
	db.query(q, (err, results) => {
		if (err) throw err;
		res.render('view_analytics', { username: req.session.username, record: results, api_key: process.env.GOOGLE_MAPS_API_KEY });
	})
})

router.get('/get_records', (req, res) => {
	let q = `SELECT * FROM web_traffic ORDER BY id DESC`;
	db.query(q, (err, results) => {
		if (err) throw err;
		let list = [];
		results.forEach((result) => {
			let obj = {
				id: result.id,
				ip_address: result.ip_address,
				date: result.date,
				request: result.request,
				user_agent: result.user_agent,
				path: result.path,
				status: result.status,
				latitude: result.latitude,
				longitude: result.longitude
			}
			list.push(obj);
		})
		res.send({ success: true, records: list });
	})
})

module.exports = router;
