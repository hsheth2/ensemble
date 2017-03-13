const shortid = require('shortid');
const download = require('./download');

module.exports = class Song {
	// constructor(name, artist, album) {
	// 	this.name = name;
	// 	this.artist = artist;
	// 	this.album = album;
	// 	download.getSong(name + " " + artist, (err, fname) => {
	// 		if (err) {
	// 			throw err;
	// 		}
	// 		this.filename = fname;
	// 	});
	// }
	
	constructor(name, callback = function(){}) {
		this.id = shortid.generate();
		this.albumImage = null;
		this.filename = null;
		this.name = name;
		this.artist = "Unknown";
		this.album = "Unknown";
		
		var self = this;
		download.getSong(name, (err, fname) => {
			if (err) {
				throw err;
			}
			
			self.filename = fname.split("/")[1];
			
			callback(this);
		});
	}
}
