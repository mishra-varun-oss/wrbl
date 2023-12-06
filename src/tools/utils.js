const path = require('path');
const geoip = require('geoip-lite');

const db = require(path.join(__dirname, "./db.js"));

function calcTime(offset) {
    // create Date object for current location
    var d = new Date();

    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    var nd = new Date(utc + (3600000*offset));
    let nd_split = nd.toLocaleString().split(', ');
    let datetime = nd_split.join(' ');

    return datetime;
}

module.exports.get_date = () => {
	let time = calcTime('-4.0');
	return time;
}
module.exports.get_uid = (length) => {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}

module.exports.enter_records = (records) => {
	return new Promise((resolve, reject) => {
		let record_list = [];
		let l = 0;
		records.forEach((record) => {
			let record_items = record.split(';;');
			let [ip_address, blank, date, request, user_agent, status, path] = record_items;
			let ip_geo = geoip.lookup(ip_address);
			let latitude, longitude;
			latitude = longitude = null;
			if (ip_geo) {
				latitude = `'${ip_geo.ll[0]}'`;
				longitude = `'${ip_geo.ll[1]}'`;
			}
			let record_data = { ip_address, date, request, user_agent, status, path, latitude, longitude }
			let q = `INSERT INTO web_traffic VALUES (default, '${ip_address}', '${date}', '${request}', '${user_agent}', '${path}', '${status}', ${latitude}, ${longitude})`;
			db.query(q, (err, results) => {
				if (err) {
					return reject(err);
				}
				l++;
				if (latitude && longitude) {
					record_list.push(record_data);
				}
				if (l == records.length) {
					let obj = { type: 'record_list', records: record_list }
					resolve(obj);
				}
			})
		})
	})
}

