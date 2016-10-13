var Nightmare = require('nightmare'),
	nightmare = Nightmare({show: true, waitTimeout: 85000}),
	async 	  = require('async'),
	instagram = require('./settings');

var login = function() {
	nightmare
		.cookies.clearAll()
		.viewport(768, 1024)
		.useragent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2838.0 Safari/537.36')
		.goto('https:/instagram.com/accounts/login/')
		.wait('input[name="username"]')
		.type('input[name="username"]', instagram.username)
		.type('input[name="password"]', instagram.password)
		.click('button')
		.wait(function() {
			return document.querySelectorAll('article').length > 2;
		})
		.run(function(err, nightmare) {
			if (err) {
				console.log(err);
				nightmare.end();
			}
			console.log('Logged In!.');
			startUrlLoop();
		});
};

var startUrlLoop = function() {
	var urls = instagram.tags.map(function(tag) {
		return 'https://www.instagram.com/explore/tags/' + tag + '/';
	});
	async.eachSeries(urls, loadTag, function(err){
		if(err) {
			console.log(err);
		}
		console.log('Finished URL loop');
		nightmare.end();
	});
};

var loadImage = function(imageUrl, done) {
	var randomTime = Math.floor(Math.random() * (81000 - 52000 + 1)) + 52000;  // Between 52-81 seconds
	nightmare.goto(imageUrl)
		.wait('a._ebwb5')
		.exists('span._soakw.coreSpriteHeartOpen')
		.then(function(elementExists){
			if(elementExists){
				nightmare.wait(randomTime)
					.click('a._ebwb5')
					.then(function(){
						console.log("Done liking after " + randomTime + " ms");
						done();
					}).catch(function(err) {
						console.log(err);
						done();
					});
			} else {
				console.log("This photo has already been liked");
				done();
			}
		}).catch(function(err){
			console.log(err);
			done();
		});
};

var loadTag = function(url, finished) {
	console.log("Navigating to " + url);
	nightmare.goto(url)
	.wait('a._8mlbc')
	.evaluate(function(selector){
		var pictureLinks = [];
		var aLinks = document.querySelectorAll(selector);
		aLinks.forEach((a) => {
			pictureLinks.push(a.href);
		});
		return pictureLinks;
	}, 'a._8mlbc')
	.then(function(picLinks){
		async.eachSeries(picLinks, loadImage, function(err){
			if(err) {
				console.log(err);
			}
			finished();
		});
	}).catch(function(err){
		console.log(err);
		finished();
	});
};

login();