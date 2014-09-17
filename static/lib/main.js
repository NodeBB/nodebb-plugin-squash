"use strict";

(function() {
	var $btn;

	$(window).on('action:plugins.superuser.setupButtons', function(userData) {
		$('<a id="squash-btn" href="#" class="btn btn-primary btn-sm"></a>').appendTo($('div#superuser'));
		$btn = $('#squash-btn');

		if (userData.squashed) {
			setupUnsquash();
		} else {
			setupSquash();
		}

		function setupSquash() {
			$btn.removeClass('btn-info').addClass('btn-warning').html('Squash');
			$btn.off('click').on('click', function(ev) {
				socket.emit('plugins.superuser.squash', {uid:userData.uid});
				setupUnsquash();
				ev.preventDefault();
				return false;
			});
		}

		function setupUnsquash() {
			$btn.removeClass('btn-warning').addClass('btn-info').html('Unsquash');
			$btn.off('click').on('click', function(ev) {
				socket.emit('plugins.superuser.unsquash', {uid:userData.uid});
				setupSquash();
				ev.preventDefault();
				return false;
			});
		}
	});
}());