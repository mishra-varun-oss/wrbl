const path = require('path');
const express = require('express');
const geoip = require('geoip-lite');
const useragent = require('useragent');

const router = express.Router();

const db = require(path.join(__dirname, "../tools/db.js"));
const utils = require(path.join(__dirname, "../tools/utils.js"));

router.post('/', async (req, res) => {
	try {
		//NEED TYPE ADD TYPE COLUMN FOR DIFFERENT MESSAGE TYPES
		console.log(req.body);
		let username = req.body.username;
		let organization = req.body.organization;

		let ip_add = req.body.ip_address;
		const clientIp = req.headers['x-forwarded-for'];

		let ip_info = geoip.lookup(clientIp);
		let lat, long;
		if (ip_info) {
			lat = ip_info.ll[0];
			long = ip_info.ll[1];
		}

		let content = `${username} has logged in!`;
		let date = utils.get_date();
		let uid = utils.get_uid();

		var userAgent = req.get('user-agent');
		const parsedUserAgent = useragent.parse(userAgent);
		const formattedUserAgent = parsedUserAgent.toString();

		let q = `INSERT INTO posts VALUES (default, '', '${content}', '${date}', '${username}', '${uid}', '${lat}', '${long}', '${formattedUserAgent}', '${ip_add}', '${clientIp}', 0, '${organization}')`;
		db.query(q, (err, results) => {
			if (err) throw err;
			console.log('signed in!');
			res.end();
		})
	} catch(e) {
		console.log(e);
	}
})

module.exports = router;
