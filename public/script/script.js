$(function() {
	console.log('script loaded.');

	// get current data/time using moment
	const $time = $('#time');
	setInterval(() => {
		$time.text(moment().format('MMM Do YYYY, h:mm:ss a'));
	}, 1000);

	// get current user's id
	const id = $('#user-id').data('user-id');
	console.log('* user id:', id);

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

	const $location = $('#location');
	const coords = navigator.geolocation.getCurrentPosition(pos => {
		// geolocation provides us latitude and longitude coords
		$.ajax({
			// here we're making ajax request to geonames api to do reverse lookup
			url: `http://api.geonames.org/findNearbyPlaceNameJSON?
			lat=${pos.coords.latitude}&
			lng=${pos.coords.longitude}&
			username=ark234`
		})
			.done(data => {
				// render current location name to view
				$location.text(data.geonames[0].name);
				setUserLocation(data.geonames[0]);
			})
			.fail((jqxhr, status, errorThrown) => {
				console.log('Error Status:', status);
				console.log('Error Thrown:', errorThrown);
			});
	});
});
