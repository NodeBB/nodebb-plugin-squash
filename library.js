"use strict";

var plugin = {},
	winston = module.parent.require('winston'),
	user = module.parent.require('./user'),
	groups = module.parent.require('./groups'),
	superusers;

plugin.init = function(app, middleware, controllers, callback) {
	try {
		superusers = require('../nodebb-plugin-superusers/library');
	} catch (e) {
		winston.warn('Please install and activate the SuperUsers plugin in order for this to work.');
		return callback();
	}

	var SocketPlugins = module.parent.require('./socket.io/plugins');
		SocketPlugins.superuser = SocketPlugins.superuser || {};
		SocketPlugins.superuser.squash = squash;
		SocketPlugins.superuser.unsquash = unsquash;

	callback();
};

plugin.getUsersPosts = function(data, callback) {
	data.posts.forEach(function(el, i, arr) {
		//if (parseInt(arr[i].uid, 10) === 
		arr[i].deleted = '1';
	});

	callback(null, data);
};

function squash(socket, data, callback) {
	var uid = socket.uid ? socket.uid : 0;
	superusers.isSuperUser(uid, function(err, isSuperUser) {
		if (!isSuperUser) {
			return callback(new Error('Not Allowed'));
		}

		groups.join('plugins:squash.squashed', data.uid);
		user.setUserField(data.uid, 'squashed', 1, callback);
	});
}

function unsquash(socket, data, callback) {
	var uid = socket.uid ? socket.uid : 0;
	superusers.isSuperUser(uid, function(err, isSuperUser) {
		if (!isSuperUser) {
			return callback(new Error('Not Allowed'));
		}

		groups.leave('plugins:squash.squashed', data.uid);
		user.setUserField(data.uid, 'squashed', 0, callback);
	});
}

module.exports = plugin;