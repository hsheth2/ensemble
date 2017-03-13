import Component from "inferno-component";
import _ from "lodash";

export default class SyncedComponent extends Component {
	path;
	stateKey;
	dsRecord;

	constructor(props, record, path, stateKey) {
		super(props);

		this.path = path;
		this.stateKey = stateKey;

		this.dsRecord = global.ds.record.getRecord(record);
	}

	componentWillMount() {
		if (this.path) {
			this.dsRecord.subscribe(this.path, this._handleDsUpdate, true);
		} else {
			this.dsRecord.subscribe(this._handleDsUpdate, true);
		}
	}

	componentDidUnmount() {
		this.dsRecord.unsubscribe(this._setState);
		this.dsRecord.discard();
		this.dsRecord = null;
	}

	_handleDsUpdate = _.debounce((data) => {
		this.setState({
			[this.stateKey]: data
		});
	}, 16.666666667, {
		leading: true,
		trailing: true
	});

	setRecord = (data, path = this.path) => {
		this.dsRecord.set(path, data);
	};
}