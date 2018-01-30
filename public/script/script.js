$(function() {
	console.log('script loaded.');

	const init = () => {
		getLocationFromZip(zip);
		clock();
	};

	// geonames username
	const GEONAMES_USER = 'ark234';
	// location element
	const $location = $('#location');
	// get current user's id
	const id = $('#user-id').data('user-id');
	// get current user's zip code
	const zip = $('#location').data('zip');
	// get today's date
	const today = moment().format('YYYY-MM-DD');

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
			type: 'PUT',
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
			url: `http://api.geonames.org/postalCodeLookupJSON?country=US&postalcode=${zip}&username=${GEONAMES_USER}`
		}).done(data => {
			// render current locatino name to view
			$location.text(data.postalcodes[0].placeName + ', ' + data.postalcodes[0].adminCode1);
			getMagic(data.postalcodes[0]);
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
		console.log(`Today's Date: ${today}`);

		$.ajax({
			url: '/magic',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({
				latitude,
				longitude,
				placeName,
				today
			})
		})
			.done(data => {
				// result times are in GMT so we need to convert to UTC local
				const sunrise = moment
					.utc(data.results.sunrise)
					.local()
					.format('h:mm:ss a');
				const sunrise2 = moment
					.utc(data.results.sunrise)
					.add(1, 'h')
					.local()
					.format('h:mm:ss a');
				const sunset = moment
					.utc(data.results.sunset)
					.local()
					.format('h:mm:ss a');
				const sunset2 = moment
					.utc(data.results.sunset)
					.subtract(1, 'h')
					.local()
					.format('h:mm:ss a');
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
