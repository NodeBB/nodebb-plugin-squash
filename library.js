"use strict";

var plugin = {},
	winston = module.parent.require('winston'),
	async = module.parent.require('async'),
	user = module.parent.require('./user'),
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
	var userCache = {},
		posts = [];

	async.eachSeries(data.posts, function(post, next) {
		var postUid = parseInt(post.uid, 10);

		if (postUid === parseInt(data.uid, 10) || parseInt(post.deleted, 10) === 1) {
			posts.push(post);
			return next();
		} else if (typeof userCache[postUid] !== 'undefined') {
			if (userCache[postUid] === 0) {
				posts.push(post);
			}

			return next();
		} else {
			user.getUserField(postUid, 'squashed', function(err, squashed) {
				squashed = squashed ? parseInt(squashed, 10) : 0;

				if (squashed === 0) {
					posts.push(post);
				}

				userCache[postUid] = squashed;
				return next();
			});
		}
	}, function(err) {
		data.posts = posts;
		callback(err, data);
	});
};

plugin.modifyUids = function(data, callback) {
	user.getUserField(data.uidFrom, 'squashed', function(err, squashed) {
		var squashed = squashed ? parseInt(squashed, 10) : 0;
		if (squashed) {
			data.uidsTo = [];
		}

		callback(err, data);
	});
};

function squash(socket, data, callback) {
	var uid = socket.uid ? socket.uid : 0;
	superusers.isSuperUser(uid, function(err, isSuperUser) {
		if (!isSuperUser) {
			return callback(new Error('Not Allowed'));
		}

		user.setUserField(data.uid, 'squashed', 1, callback);
	});
}

function unsquash(socket, data, callback) {
	var uid = socket.uid ? socket.uid : 0;
	superusers.isSuperUser(uid, function(err, isSuperUser) {
		if (!isSuperUser) {
			return callback(new Error('Not Allowed'));
		}

		user.setUserField(data.uid, 'squashed', 0, callback);
	});
}

module.exports = plugin;