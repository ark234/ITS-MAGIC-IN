$(function() {
	console.log('script loaded.');

	const init = () => {
		getLocationFromZip(zip);
		clock();
	};

	const GEONAMES_USER = 'ark234'; // geonames username
	const $location = $('#location'); // location element
	const id = $('#user-id').data('user-id'); // get current user's id
	const zip = $('#location').data('zip'); // get current user's zip code

	// get current data/time using moment
	const $time = $('#time');
	const clock = () => {
		$time.text(moment().format('MMM Do YYYY, h:mm:ss a'));
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
			})
			.fail((jqxhr, status, errorThrown) => {
				console.log('Error Status:', status);
				console.log('Error Thrown:', errorThrown);
			});
	};

	// get user location name from zip code
	const getLocationFromZip = zip => {
		console.log('Looking up location name for zip code', zip);
		$.ajax({
			url: `http://api.geonames.org/postalCodeLookupJSON?
			country=US&
			postalcode=${zip}&
			username=${GEONAMES_USER}`
		})
			.done(data => {
				// render current locatino name to view
				$location.text(data.postalcodes[0].placeName + ', ' + data.postalcodes[0].adminCode1);
				getMagic(data.postalcodes[0]);
			})
			.fail((jqxhr, status, errorThrown) => {
				console.log('Error Status:', status);
				console.log('Error Thrown:', errorThrown);
			});
	};

	const getLocationFromCoords = () => {
		navigator.geolocation.getCurrentPosition(pos => {
			// geolocation provides us latitude and longitude coords
			$.ajax({
				// here we're making ajax request to geonames api to do reverse lookup
				url: `http://api.geonames.org/findNearbyPlaceNameJSON?
				lat=${pos.coords.latitude}&
				lng=${pos.coords.longitude}&
				username=${GEONAMES_USER}`
			})
				.done(data => {
					// render current location name to view
					// $location.text(data.geonames[0].name);
					// setUserLocation(data.geonames[0]);
				})
				.fail((jqxhr, status, errorThrown) => {
					console.log('Error Status:', status);
					console.log('Error Thrown:', errorThrown);
				});
		});
	};

	// send user location to the server to request sunset/sunrise information via axios
	const getMagic = locationData => {
		const latitude = locationData.lat;
		const longitude = locationData.lng;
		const placeName = locationData.placeName;
		console.log(`Latitude: ${latitude}`);
		console.log(`Longitude: ${longitude}`);
		console.log(`Place Name: ${placeName}`);

		// send location data to server
		$.ajax({
			url: '/magic',
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({
				latitude,
				longitude,
				placeName
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
