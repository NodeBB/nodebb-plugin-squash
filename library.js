"use strict";

var plugin = {},
	winston = module.parent.require('winston'),
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

function squash(socket, data, callback) {
	var uid = socket.uid ? socket.uid : 0;
	superusers.isSuperUser(uid, function(err, isSuperUser) {
		if (!isSuperUser) {
			return callback(new Error('Not Allowed'));
		}

		console.log('squashed');
	});
}

function unsquash(socket, data, callback) {
	var uid = socket.uid ? socket.uid : 0;
	superusers.isSuperUser(uid, function(err, isSuperUser) {
		if (!isSuperUser) {
			return callback(new Error('Not Allowed'));
		}

		console.log('unsquashed');
	});
}

module.exports = plugin;