$(function() {
	console.log('script loaded.');

	const init = () => {
		clock();
		getLocationFromZip(zip);
		geolocationClickHandler();
	};

	const GEONAMES_USER = 'ark234'; // geonames username
	const $location = $('#location'); // location element
	const id = $('#user-id').data('user-id'); // get current user's id
	const zip = $('#location').data('zip'); // get current user's zip code

	// get current data/time using moment
	const $time = $('#time');
	const clock = () => {
		$time.text(moment().format('HH:mm:ss'));
		setTimeout(clock, 1000);
	};

	// send user location to server to be persisted
	const setUserLocation = locationData => {
		$.ajax({
			url: `/users/${id}`,
			method: 'PUT',
			contentType: 'application/json',
			data: JSON.stringify({ locationData })
		})
			.done(data => {
				console.log('setUserLocation response:', data);
				getMagic(data.address.lat, data.address.lng, data.address.placename);
				console.log('==>sending coords to server.');
			})
			.fail((jqxhr, status, errorThrown) => {
				console.log('Error Status:', status);
				console.log('Error Thrown:', errorThrown);
			});
	};

	// get user location name from zip code and send to server
	const getLocationFromZip = zip => {
		console.log('Looking up location name for zip code', zip);
		$.ajax({
			url: `https://secure.geonames.org/postalCodeLookupJSON?
			country=US&
			postalcode=${zip}&
			username=${GEONAMES_USER}`
		})
			.done(data => {
				// render current locatino name to view
				$location.text(data.postalcodes[0].placeName + ', ' + data.postalcodes[0].adminCode1);
				getMagic(data.postalcodes[0].lat, data.postalcodes[0].lng, data.postalcodes[0].placeName);
			})
			.fail((jqxhr, status, errorThrown) => {
				console.log('Error Status:', status);
				console.log('Error Thrown:', errorThrown);
			});
	};

	// get user location from geolocation and send to server
	// const getLocationFromCoords = () => {
	// 	navigator.geolocation.getCurrentPosition(pos => {
	// 		console.log('Getting geolocation! Coords:', pos.coords.latitude, pos.coords.longitude);
	// 		// geolocation provides us latitude and longitude coords
	// 		$.ajax({
	// 			// here we're making ajax request to geonames api to do reverse lookup
	// 			url: `https://secure.geonames.org/findNearbyPlaceNameJSON?
	// 			lat=${pos.coords.latitude}&
	// 			lng=${pos.coords.longitude}&
	// 			username=${GEONAMES_USER}`
	// 		})
	// 			.done(data => {
	// 				// render current location name to view
	// 				// $location.text(data.geonames[0].name);
	// 				// setUserLocation(data.geonames[0]);
	// 			})
	// 			.fail((jqxhr, status, errorThrown) => {
	// 				console.log('Error Status:', status);
	// 				console.log('Error Thrown:', errorThrown);
	// 			});
	// 	});
	// };

	// click handler for geolocation
	const geolocationClickHandler = () => {
		$('#geolocation-btn').click(e => {
			$('#geolocation-btn').css('display', 'none'); // hide button to prevent user from spamming requests
			$('#geo-load').css('display', 'inline'); // show loading message
			navigator.geolocation.getCurrentPosition(pos => {
				console.log('Getting geolocation! Coords:', pos.coords.latitude, pos.coords.longitude);
				$.ajax({
					// here we're making ajax request to geonames api to do reverse lookup
					url: `https://secure.geonames.org/findNearestAddressJSON?
					lat=${pos.coords.latitude}&
					lng=${pos.coords.longitude}&
					username=${GEONAMES_USER}`
				})
					.done(data => {
						$('#geolocation-btn').css('display', 'inline'); // show button after response comes back
						$('#geo-load').css('display', 'none'); // hide loading message
						// render current location name to view
						$location.text(data.address.placename + ', ' + data.address.adminCode1);
						// setUserLocation(data.geonames[0]);
						getMagic(data.address.lat, data.address.lng, data.address.placename);
					})
					.fail((jqxhr, status, errorThrown) => {
						console.log('Error Status:', status);
						console.log('Error Thrown:', errorThrown);
					});
			});
		});
	};

	// send user location to the server to request sunset/sunrise information via axios
	const getMagic = (lat, lng, placename) => {
		// const latitude = locationData.lat;
		// const longitude = locationData.lng;
		// const placeName = locationData.placeName;
		console.log(`Latitude: ${lat}`);
		console.log(`Longitude: ${lng}`);
		console.log(`Place Name: ${placename}`);

		// send location data to server
		$.ajax({
			url: '/magic',
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({
				lat,
				lng,
				placename
			})
		})
			.done(data => {
				// result times are in GMT so we need to convert to UTC local
				console.log('$$$$ ajax result data:', data);
				const sunrise = moment
					.utc(data.sunrise)
					.local()
					.format('HH:mm:ss');
				const sunrise2 = moment
					.utc(data.sunrise)
					.add(1, 'h')
					.local()
					.format('HH:mm:ss');
				const sunset = moment
					.utc(data.sunset)
					.local()
					.format('HH:mm:ss');
				const sunset2 = moment
					.utc(data.sunset)
					.subtract(1, 'h')
					.local()
					.format('HH:mm:ss');
				$('#sunrise').text(`${sunrise} ~ ${sunrise2}`);
				$('#sunset').text(`${sunset2} ~ ${sunset}`);
			})
			.fail((jqxhr, status, errorThrown) => {
				console.log('Error Status:', status);
				console.log('Error Thrown:', errorThrown);
			});
	};

	init();
});
