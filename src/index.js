import 'whatwg-fetch'

import Inferno from 'inferno';
import {Router, Route, IndexRoute} from 'inferno-router';
import createBrowserHistory from 'history/createBrowserHistory';
import deepstream from "deepstream.io-client-js";

import App from './App';
import Home from "./Home";
import Session from "./Session";
import SessionModal from "./SessionModal";
import config from "./config";

import timesync from "./timesync";

import './index.css';

const browserHistory = createBrowserHistory();

const ds = deepstream(config.deepstream);

const routes = (
	<Router history={ browserHistory }>
		<Route component={ App }>
			<IndexRoute component={ Home }/>
			<Route path="/session/:session" component={ SessionModal }/>
		</Route>
	</Router>
);

let rendered = false;
ds.login({username: "client"}, () => {

	if (rendered) {
		return;
	}
	rendered = true;

	timesync.init();

	Inferno.render(
		routes,
		document.getElementById('app')
	);
});

global.ds = ds;
