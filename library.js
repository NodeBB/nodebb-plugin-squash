"use strict";

var plugin = {};

plugin.init = function(app, middleware, controllers, callback) {
	app.get('/admin/trollify', middleware.admin.buildHeader, renderAdmin);
	app.get('/api/admin/trollify', renderAdmin);

	callback();
};

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