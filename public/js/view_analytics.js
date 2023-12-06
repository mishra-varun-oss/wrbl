const record_input  = document.querySelector("#record_input");
const table_container = document.querySelector("#table_container");
table_container.style.display = "none";
// Initialize the Google Map
let map, infoWindow;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2, // Adjust the zoom level as needed for your use case
        center: { lat: 0, lng: 0 }, // Center the map at the globe
        mapTypeId: 'terrain', // Use satellite view for the globe
	styles: [
	    {
                featureType: 'administrative.country',
                elementType: 'geometry.stroke',
                stylers: [
                    {
                        color: '#ff0000' // Change the border color of countries
                    }
                ]
            }
	]
    });
    infoWindow = new google.maps.InfoWindow();
}

// Function to create a marker with a custom color
function createMarker(latitude, longitude, content) {
	let color = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
	const marker = new google.maps.Marker({
		position: { lat: latitude, lng: longitude },
		map: map,
		icon: {
			path: google.maps.SymbolPath.CIRCLE,
			fillColor: color,
			fillOpacity: 0.8,
			strokeWeight: 0,
			scale: 7.5
		},
	});

	marker.addListener('mouseover', () => {
		infoWindow.setContent(content);
		infoWindow.open(map, marker);
	})

	marker.addListener('click', () => {
		infoWindow.setContent(content);
		infoWindow.open(map, marker);
	})
	
	google.maps.event.addListener(map, 'click', () => {
		infoWindow.close();
	})

	marker.addListener('mouseout', () => {
		infoWindow.close();
	})
}

function set_markers(list) {
	let c = 0;
	list.forEach((record) => {
		c++;
		if (record.latitude && record.longitude) {
			let content = `
				<p>${record.ip_address}</p>
				<p>Date and Time: ${record.date}</p>
				<p>Request type: ${record.request}</p>
				<p>User Agent: ${record.user_agent}</p>
				<p>Path accessed: ${record.path}</p>
			`	
			createMarker(record.latitude, record.longitude, content);
		}
	})
}

window.onload = () => {
	initMap();
	fetch('/analytics/get_records')
	.then(response => response.json())
	.then((data) => {
		if (data.success) {
			set_markers(data.records);
		}
	})
}

const socket = new WebSocket("wss://wrbl.nyc/analytics");

function request_records() {
	let o = { type: 'request' };
	socket.send(JSON.stringify(o));
	setTimeout(request_records, 5000);
}

socket.addEventListener("open", () => {
	console.log('connected!');
	request_records();
})

socket.addEventListener("message", (event) => {
	let m = JSON.parse(event.data);

	if (m.type == 'record_list') {
		if (!m.updated) {
			let records_tbody = document.querySelector("#records_tbody");
			let list = m.records;
			list.forEach((record) => {
				console.log(record);
				let content = `
					<p>${record.ip_address}</p>
					<p>Date and Time: ${record.date}</p>
					<p>Request type: ${record.request}</p>
					<p>User Agent: ${record.user_agent}</p>
					<p>Path accessed: ${record.path}</p>
				`	
				createMarker(Number(record.latitude), Number(record.longitude), content);
			})
		}
	}
})

