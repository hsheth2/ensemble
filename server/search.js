let LastfmAPI = require('lastfmapi');

require('dotenv').config()

let lfm = new LastfmAPI({
    'api_key' : process.env.LAST_FM_API_KEY,
    'secret' : process.env.LAST_FM_SECRET
});

module.exports = {
	trackName: function(track, callback) {
		lfm.track.search({track: ""}, function(err, res) {
			
		});
	},
};

