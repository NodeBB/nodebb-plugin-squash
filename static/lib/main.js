"use strict";

(function() {
	$(window).on('action:ajaxify.end', function(ev, data) {
		if (data.url.match(/^user\/([\s\S]*)/)) {
			socket.emit('plugins.superuser.isSuperUser', function(err, isSuperUser) {
				if (isSuperUser) {
					setupSquashButton(data);
				}
			});
		}
	});

	function setupSquashButton(data) {
		$.get(RELATIVE_PATH + '/api/' + data.url, function(data) {
			if (data.isSelf) {
				return;
			}

			$('<a id="squash-btn" href="#" class="btn btn-primary btn-sm"></a>').insertAfter($('#unfollow-btn'));
			$btn = $('#squash-btn');

			if (data.banned) {
				setupSquash();
			} else {
				setupUnsquash();
			}
		});


		function setupSquash() {
			$btn.removeClass('btn-info').addClass('btn-warning').html('Squash');
			$btn.off('click').on('click', function(ev) {
				socket.emit('plugins.superuser.squash');
				setupUnsquash();
				ev.preventDefault();
				return false;
			});
		}

		function setupUnsquash() {
			$btn.removeClass('btn-warning').addClass('btn-info').html('Unsquash');
			$btn.off('click').on('click', function(ev) {
				socket.emit('plugins.superuser.unsquash');
				setupSquash();
				ev.preventDefault();
				return false;
			});
		}
	}
}());