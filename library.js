"use strict";

var plugin = {};

plugin.init = function(app, middleware, controllers, callback) {
	app.get('/admin/trollify', middleware.admin.buildHeader, renderAdmin);
	app.get('/api/admin/trollify', renderAdmin);

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


plugin.addAdminNavigation = function(header, callback) {
	header.plugins.push({
		route: '/trollify',
		icon: 'fa-tint',
		name: 'trollify'
	});

	callback(null, header);
};


function renderAdmin(req, res, next) {
	res.render('admin/trollify', {});
}

module.exports = plugin;