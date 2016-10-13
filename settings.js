var settings = {
	username : '',
	password : '',
	tags : ['sunset', 'sunrise', 'cars', 'seattle', 'music', 'festival']
};

if(process.argv.length >= 4) {
	settings.username = process.argv[2];
	settings.password = process.argv[3];
}

if(process.argv.length >= 5) {
	var tagsArray = process.argv.slice(4);
	settings.tags = [...tagsArray];
}

module.exports = settings;