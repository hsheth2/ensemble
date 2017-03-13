import Inferno from "inferno";
import config from "./config";
import Component from "inferno-component";

function checkStatus(response) {
	if (response.status >= 200 && response.status < 300) {
		return response
	} else {
		let error = new Error(response.statusText);
		error.response = response;
		throw error
	}
}

export default class Home extends Component {
	router;
	constructor(props, {router}) {
		super(props);
		this.router = router;
	}

	handleSubmit = (e) => {
		e.preventDefault();

		let id = this.code.value.toUpperCase();

		fetch(config.api + "/session/" + id)
			.then(checkStatus)
			.then(r => r.text())
			.then(r => {
				this.router.push("/session/" + id);
			})
			.catch(() => {
				alert("error");
			});
	};

	handleCreate = () => {
		fetch(config.api + "/session/create/")
			.then(r => r.json())
			.then(r => {
				console.log(r);
				this.router.push("/session/" + r.key);
			});
	}

	render() {
		return <div>
			<form action="" className="form" onSubmit={this.handleSubmit}>
				<div className="input-group">
					<input type="text" className="form-control" placeholder="Code" ref={(e) => {
						this.code = e;
					}}/>
					<span className="input-group-btn">
		            <button className="btn btn-custom" type="submit">Join Session</button>
		        </span>
				</div>
			</form>
			<br/>
			<button className="btn btn-block btn-custom" onClick={this.handleCreate}>Create Session</button>
		</div>
	}
}