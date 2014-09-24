"use strict";

var plugin = {},
	winston = module.parent.require('winston'),
	async = module.parent.require('async'),
	user = module.parent.require('./user'),
	groups = module.parent.require('./groups'),
	meta = module.parent.require('./meta'),
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

plugin.getUsersTopics = function(data, callback) {
	var uids = [],
		topics = data.topics;

	topics.forEach(function(el) {
		if (uids.indexOf(el.uid) === -1) {
			uids.push(el.uid);
		}
	});

	user.getMultipleUserFields(uids, ['squashed'], function(err, usersData) {
		var users = {},
			filteredTopics = [];

		uids.forEach(function(uid, idx) {
			users[uid] = usersData[idx].squashed;
		});

		topics.forEach(function(topic, idx) {
			if (parseInt(data.uid, 10) === parseInt(topic.uid, 10) || parseInt(topic.deleted, 10) === 1) {
				filteredTopics.push(topic);
			} else {
				var squashed = users[topic.uid] ? parseInt(users[topic.uid], 10) : 0;

				if (squashed === 0) {
					filteredTopics.push(topic);
				}
			}
		});

		data.topics = filteredTopics;

		callback(err, data);
	});

};

plugin.getUsersPosts = function(data, callback) {
	var uids = [],
		posts = data.posts;

	posts.forEach(function(el) {
		if (el && el.uid && uids.indexOf(el.uid) === -1) {
			uids.push(el.uid);
		}
	});

	user.getMultipleUserFields(uids, ['squashed'], function(err, usersData) {
		var users = {},
			filteredPosts = [];

		uids.forEach(function(uid, idx) {
			users[uid] = usersData[idx].squashed;
		});

		posts.forEach(function(post, idx) {
			if (post.uid) {
				if (parseInt(data.uid, 10) === parseInt(post.uid, 10) || parseInt(post.deleted, 10) === 1) {
					filteredPosts.push(post);
				} else {
					var squashed = users[post.uid] ? parseInt(users[post.uid], 10) : 0;

					if (squashed === 0) {
						filteredPosts.push(post);
					}
				}
			} else {
				console.log('temporary... figuring out why posts dont have uids? ', post);
			}
		});

		data.posts = filteredPosts;

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
	isSuperUser(uid, function(err, isSuperUser) {
		if (!isSuperUser) {
			return callback(new Error('Not Allowed'));
		}

		user.setUserField(data.uid, 'squashed', 1, callback);
	});
}

function unsquash(socket, data, callback) {
	var uid = socket.uid ? socket.uid : 0;
	isSuperUser(uid, function(err, isSuperUser) {
		if (!isSuperUser) {
			return callback(new Error('Not Allowed'));
		}

		user.setUserField(data.uid, 'squashed', 0, callback);
	});
}

function isSuperUser(uid, callback) {
	var group = meta.config['superuser:groupname'] || '';

	groups.isMember(uid, group, callback);
}

module.exports = plugin;