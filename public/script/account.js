$(function() {
	console.log('update.js loaded');

	/***************** UPDATE ACCOUNT ******************/
	$('#account-update-form').submit(e => {
		e.preventDefault(); // prevent default action on submit
		$.ajax({
			url: e.target.getAttribute('action'),
			type: 'put',
			dataType: 'json',
			data: $(e.target).serialize()
		})
			.done(data => {
				console.log('Account updated.');
				window.location.href = '/users/home';
			})
			.fail((jqxhr, status, errorThrown) => {
				console.log('Error Status:', status);
				console.log('Error Thrown:', errorThrown);
			});
	});

	/***************** DELETE ACCOUNT ******************/
	$('#account-del-btn').click(e => {
		e.preventDefault(); // prevent default action on click
		const id = $(e.target).data('user-id');
		const result = confirm('Are you sure you want to permanently delete this account?');
		if (result) {
			$.ajax({
				url: `/users/account/${id}`,
				method: 'DELETE'
			})
				.done(data => {
					window.location.href = '/users/logout';
				})
				.fail((jqxhr, status, errorThrown) => {
					console.log('Error Status: status');
					console.log('Error Thrown:', errorThrown);
				});
		}
	});
});
