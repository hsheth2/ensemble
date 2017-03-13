import Inferno from 'inferno';
import Component from 'inferno-component';
import TimeSync from "./timesync";
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			timeSyncAccuracy: -1,
			connectionStatus: "undefined"
		};

		this.tsInt = setInterval(() => {
			this.setState({
				timeSyncAccuracy: TimeSync.syncPM
			});
		}, 1000);

		// WS.socket.addEventListener("open", this.handleConnect);
		// WS.socket.addEventListener("close", this.handleDisconnect);
	}

	handleConnect = () => {
		this.setState({
			connectionStatus: "connected"
		});
	};

	handleDisconnect = () => {
		this.setState({
			connectionStatus: "disconnected"
		});
	};

	componentWillUnmount() {
		// WS.socket.removeEventListener("open", this.handleConnect);
		// WS.socket.removeEventListener("close", this.handleDisconnect);
	}
	render() {
		return (
			<div>
				<div className="header">
					<div className="container"><h1>Ensemble</h1></div>
				</div>
				<div className="App">
					Time sync: ±{ Math.round(this.state.timeSyncAccuracy) } ms | Connection status: { this.state.connectionStatus }
					<div className="container">
						{ this.props.children }
					</div>
				</div>
			</div>
		);
	}
}

export default App;
