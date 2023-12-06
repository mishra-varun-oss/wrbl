window.onload = () => {
	console.log(screen.width, window.innerHeight);
	let svg = document.querySelector("svg");
	let view_width = 700;
	let view_height = 700;
	if (screen.width < 700) {
		view_width = screen.width;
		view_height = window.innerHeight;
	} 
	svg.setAttribute('viewBox', `0 0 ${view_width} ${view_height}`);

	fetch(`/wordcloud/get-data?width=${view_width}&height=${view_height}`)
	.then(response => response.json())
	.then((data) => {
		//console.log(data);
		let svg_width = svg.getAttribute('viewBox').split(" ")[2];
		let svg_height = svg.getAttribute('viewBox').split(" ")[3];
		let text_group = document.querySelector("#text_group");
		text_group.setAttribute('transform', `translate(${svg_width / 2}, ${svg_height / 2})`);
		let svgNS = "http://www.w3.org/2000/svg";
		
		for (let i = 0; i < data.length; i++) {
			let word = data[i];
			
			let text = document.createElementNS(svgNS, 'text');
			text.style.textAnchor = 'middle';
			text.style.padding = `${word.padding}px`;
			text.style.fontSize = `${word.size}px`;
			text.style.fontFamily = word.font;
			//text.setAttribute('font-size', `${word.size}px`);
			//text.setAttribute('font-family', word.font);
			text.setAttribute('transform', `translate(${word.x}, ${word.y}) rotate(${word.rotate})`);
			text.setAttribute('fill', getRandomColor());
			//text.setAttribute('x', word.x0);
			//text.setAttribute('y', word.y0);
			text.textContent = word.text;

			text_group.appendChild(text);
		}
	})
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
