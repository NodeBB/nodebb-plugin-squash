"use strict";

(function() {
	$(window).on('action:plugins.superuser.setupButtons', function(ev, data) {
		$('<a id="squash-btn" href="#" class="btn btn-primary btn-sm"></a>').appendTo($('div#superuser'));
		var $btn = $('#squash-btn'),
			user = data.user;

		if (parseInt(user.squashed,10) === 1) {
			setupUnsquash();
		} else {
			setupSquash();
		}

		function setupSquash() {
			$btn.removeClass('btn-info').addClass('btn-warning').html('Squash');
			$btn.off('click').on('click', function(ev) {
				socket.emit('plugins.superuser.squash', {uid:user.uid});
				setupUnsquash();
				ev.preventDefault();
				return false;
			});
		}

		function setupUnsquash() {
			$btn.removeClass('btn-warning').addClass('btn-info').html('Unsquash');
			$btn.off('click').on('click', function(ev) {
				socket.emit('plugins.superuser.unsquash', {uid:user.uid});
				setupSquash();
				ev.preventDefault();
				return false;
			});
		}
	});
}());