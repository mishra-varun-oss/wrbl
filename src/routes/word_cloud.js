const fs = require('fs');
const path = require('path');
const express = require('express');
const { createCanvas } = require("canvas");
const cloud = require("d3-cloud");

const router = express.Router();

const word_data = require(path.join(__dirname, "../tools/word_cloud.js"));

router.get('/', (req, res) => {
	res.render('wordcloud');
})

router.get('/get-data', (req, res) => {
	let width = req.query.width;
	let height = req.query.height;
	const word = word_data.map(function(d) {
		return {text: d, size: 10 + Math.random() * 50};
	});

	cloud().size([width, height])
	.canvas(() => createCanvas(width, height))
	.words(word)
	.padding(3)
	.rotate(() => Math.random() * 0)
	.font("Arial")
	.fontSize(d => d.size)
	.text((d) => { return d.text })
	.on("end", words => res.send(words))
	.start();
})

module.exports = router;
