import Inferno from "inferno";
import Component from "inferno-component";
import {fetchMusic, playMusicBuffer} from "./musicManager";

import Session from "./Session";

export default class SessionModal extends Component {
	constructor(props) {
		super(props);

		fetchMusic("/bloop")
			.then(buf => {
				this.bloop = buf;
			});
	}
	state = { passed: false };

	handleClick = () => {
		playMusicBuffer(this.bloop);

		this.setState({
			passed: true
		});
	};

	render(props, state) {
		return <div>
			{ state.passed ? <Session {...props} /> : <div className="modal" role="dialog" style={{display: "block"}}>
					<div className="modal-dialog" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h4 className="modal-title">Unlock Audio</h4>
							</div>
							<div className="modal-body">
								<p>Some platforms require user interaction to enable audio. Please click continue.</p>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-large btn-primary" onClick={this.handleClick}>Continue</button>
							</div>
						</div>
					</div>
				</div>}
		</div>
	}
}