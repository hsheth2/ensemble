import now from "right-now";

export default class TimeSync {
	static initialized = false;

	static drift;

	static syncTimeout;
	static syncPM;

	static sync() {
		// console.log("Syncing Time");

		let ds = global.ds;

		let beg = now();
		ds.rpc.make("time", null, l);

		let timeout;
		let cancelled = false;

		function l(err, res) {
			if (cancelled) {
				return;
			}

			clearTimeout(timeout);

			let meow = now();
			let latency = meow - beg;
			// console.log("latency: " + latency);

			if (latency > 300) {
				console.log("The latency is too high. Discarding.");
				return;
			}

			TimeSync.syncPM = latency / 2;

			let drift = res - beg + (latency / 2);
			// console.log("Drift: ", drift);

			if (!TimeSync.drift) {
				TimeSync.drift = drift;
			} else {
				TimeSync.drift = (TimeSync.drift * 10 + drift) / 11;
				// console.log("Rolling average drift: ", TimeSync.drift);
			}

			// console.log("The time is now " + TimeSync.now());
			TimeSync.syncTimeout = null;
		}

		timeout = setTimeout(function () {
			console.log("Time sync request timed out");
			cancelled = true;
		}, 500);
	}

	static now() {
		return now() + TimeSync.drift;
	}

	static startSync() {
		setInterval(TimeSync.sync, 500);
	}

	static init() {
		if (this.initialized) {
			return;
		}
		this.initialized = true;

		this.startSync();
	}
}