const EventEmitter = require("events");
const Song = require('./song');
const mp3Duration = require("mp3-duration");

module.exports = class Room {
	constructor(id) {

		this.key = id;
		this.queue = [];
		this.currentSong = null;
		this.startedAt = null;


		console.log(this.key);
		this.record = global.ds.record.getRecord("sessions/" + this.key);
		// refresh clients every 5 sec
		var self = this;
		var refreshId = setInterval(() => {
			if (self.currentSong == null) {
				console.log("no songs in queue; skipping update");
				return;
			}
			console.log("we need to update the client on the song position");
			var currentTime = Date.now();
			var updateOffset = 1000; // 1 sec
	    }, 2000);
	    
	    //self.addSong('My Way Calvin Harris');
	}
	
	addSong(query) {
		var song = new Song(query, foo.bind(this));

		function foo(song) {
			console.log(song);
			this.queue.push(song);
			this.record.set("queue", this.queue);
			if (this.queue.length == 1 && this.currentSong === null) {
				console.log("emitting start_dl");
				global.ds.event.emit("sessions/" + this.key + "/start_dl", song.filename);
				setTimeout(() => { this.track_playback(); }, 2000);
			}
		}
	}
	
	track_playback() {
		console.log("staring playback");
		var self = this;

		if (this.queue.length === 0) {
			console.error("OUCH");
			return;
		}
		
		// wait for track to finish playback
		var song = this.queue[0];
		self.currentSong = song;
		self.startedAt = Date.now() + 8000;

		this.record.set("currentlyPlaying", song);
		this.record.set("startedAt", this.startedAt);

		this.removeSong(song.id);
		
		// wait to get duration of song
		mp3Duration("audio/" + song.filename, (err, duration) => {
			if (err) {
				throw err;
			}

			global.ds.event.emit("sessions/" + this.key + "/start_playing", this.startedAt);
			
			// waits for duration of song
			setTimeout(() => {
				console.log("song should be finished");

				// starts running when song is over
				self.currentSong = null;
				self.startedAt = null;
				
				setTimeout(function() { self.track_playback(); }, 2000);
			}, duration * 1000);
		})
	}
	
	removeSong(songID) {
		for (var i = 0; i < this.queue.length; i++) {
			if (this.queue[i].id == songID) {
				this.queue.splice(i, 1);

				this.record.set("queue", this.queue);
				
				return;
			}
		}
	}
}
