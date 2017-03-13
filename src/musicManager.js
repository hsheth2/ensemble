import config from "./config";

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

export function fetchMusic(path) {
	return fetch(config.api + path)
		.then(r => r.arrayBuffer())
		.then(ab => {
			return new Promise((resolve, reject) => {
				audioCtx.decodeAudioData(ab, function(buffer) {
					resolve(buffer);
				}, reject);
			});
		});
}

export function playMusicBuffer(buf, offset = 0) {
	let source = audioCtx.createBufferSource();
	source.buffer = buf;
	source.connect(audioCtx.destination);
	source.start(0, offset);
}