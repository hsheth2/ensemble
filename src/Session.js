import Inferno from "inferno";
import SyncedComponent from "./SyncedComponent";
import TimeSync from "./timesync";
import config from "./config";

import {fetchMusic, playMusicBuffer} from "./musicManager";

export default class Session extends SyncedComponent {
	constructor(props) {
		super(props, "sessions/" + props.params.session, null, "data");
		this.record = this.dsRecord;
		let session = this.session = props.params.session;

		let prefix = "sessions/" + session;

		this.state = {
			data: {
				queue: [],
				currentlyPlaying: false
			}
		};

		global.ds.event.subscribe(prefix + "/start_dl", (filename) => {
			console.log("start downloading");

			fetchMusic("/audio?id=" + filename)
				.then((buf) => this.musicBuf = buf);
		});

		global.ds.event.subscribe(prefix + "/start_playing", (starttime) => {
			console.log("start thinking about playing");

			setTimeout(() => {
				playMusicBuffer(this.musicBuf);
			}, starttime - TimeSync.now());
		});

		this.record.whenReady((record) => {
			let startedAt = record.get("startedAt");
			if (startedAt) {
				fetchMusic("/audio?id=" + record.get("currentlyPlaying.filename"))
					.then((buf) => {
						console.log("Fetched late audio");
						let currTime = TimeSync.now();
						playMusicBuffer(buf, (currTime - startedAt) / 1000);
					});
			}
		})
	}

	// handleUpdateQueue = ({data}) => {
	// 	try {
	// 		data = JSON.parse(data);
	// 	} catch (e) {
	//
	// 	}
	//
	// 	if (data.t !== "UPQ") {
	// 		return;
	// 	}
	//
	// 	this.setState({
	// 		queue: data.d
	// 	});
	//
	// 	console.log(data);
	//
	// 	fetchMusic("/audio?id=" + data.d[data.d.length - 1].filename)
	// 		.then(playMusicBuffer);
	// };

	addSong = (e) => {
		e.preventDefault();

		let id = this.songName.value.toUpperCase();

		fetch(config.api + "/session/" + this.props.params.session, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({query: this.songName.value}),
		});
		this.songName.value = "";
	};

	render(props, state) {
		return <div>
			Session ID: <code>{props.params.session}</code>

			<br /><br />

			{ this.currentlyPlaying ? <div>Currently playing: { state.data.currentlyPlaying.name }</div> : null}

			<ul className="list-group">
				{ state.data.queue.map((e) => {
					console.log(e);
					return <li className="list-group-item" key={e.id}>{e.name}</li>
				}) }
			</ul>

			{ state.data.currentlyPlaying ? <div>Currently playing: { state.data.currentlyPlaying.name }</div> : null}

			<form className="form" onSubmit={this.addSong}>
				<div className="input-group">
					<input type="text" className="form-control" placeholder="Song Title" ref={(e) => {
						this.songName = e;
					}}/>
					<span className="input-group-btn">
		            <button className="btn btn-custom" type="submit">Add Song</button>
		        </span>
				</div>
			</form>

			<br/>

			<button className="btn btn-custom" onClick={() => location.assign("/")}>Leave</button>
		</div>
			;
	}
}