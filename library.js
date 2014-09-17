"use strict";

var plugin = {};

plugin.init = function(app, middleware, controllers, callback) {
	var SocketPlugins = module.parent.require('./socket.io/plugins');
		SocketPlugins.superuser = SocketPlugins.superuser || {};
		SocketPlugins.superuser.squash = squash;
		SocketPlugins.superuser.unsquash = unsquash;

	callback();
};

function squash(socket, data, callback) {
	console.log('squashed');
}

function unsquash(socket, data, callback) {
	console.log('unsquashed');
}

module.exports = plugin;