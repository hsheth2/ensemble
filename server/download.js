const fs = require('fs');
const child_process = require('child_process');
const ytstream = require('youtube-audio-stream');

global.cache = {};

var CMD = 'server/yt.sh';

function getSong(query, callback) {
	if (query in global.cache) {
		var id = global.cache[query];
		callback(null, "audio/"+ id + ".mp3");
		
		return;
	}
	
	child_process.execFile(CMD, [query], (error, stdout, stderr) => {
	  if (error) {
	    throw error;
	  }
	  console.log(stdout);
	  
	  if (stdout.indexOf("exists, skipping") >= 0) {
	  	var kwd = "[ffmpeg] Post-process file ";
	  	console.log("file already downloaded");
	  } else {
		  var kwd = "[ffmpeg] Destination: ";
	  }
	  var pos = stdout.indexOf(kwd);
	  var id = stdout.substring(pos + kwd.length, pos + kwd.length + 11);
	  console.log(id);
	  
	  callback(null, "audio/"+ id + ".mp3");
	  global.cache[query] = id;
	});
}

// getSong('My Way Calvin Harris', function(err, id) {});
// getSong('Under the Bridge', function(err, id) {});
// getSong('Don\'t Wanna Know Maroon 5', function(err, id) {});

module.exports = {
	getSong: getSong
};
