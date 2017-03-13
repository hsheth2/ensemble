global.Promise = require("bluebird");
const Koa = require('koa');
const Router = require("koa-router");
const cors = require('kcors');
const bodyParser = require('koa-bodyparser');
const uws = require("uws");
const http = require("http");
const path = require("path");
const microtime = require("microtime");
const search = require("./search");
const child_process = require('child_process');
const fs = require('fs');
const deepstream = require("deepstream.io-client-js");
const shortid = require('shortid');
const Room = require('./room');

const app = new Koa();
app.use(cors());
app.use(bodyParser());

const router = new Router();

router.get("/", async function (ctx, next) {
	ctx.body = "API server root";
});

router.get("/search", async function (ctx, next) {
	ctx.body = await search.trackName({name: ctx.request.query.trackName});
});

function generateID() {
	return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5).toUpperCase();
}

router.get("/session/create", async function (ctx, next) {
	var id;

	do {
		id = generateID();
	} while (id in global.rooms);

	var r = new Room(id);

	global.rooms[r.key] = r;
	ctx.body = {key: r.key};

	ds.record.getRecord("sessions/" + id).set({
		queue: []
	});
});

router.get("/session/:id", async function (ctx, next) {
	if (!(ctx.params.id in global.rooms)) {
		ctx.status = 404;
	} else {
		ctx.body = "ok";
	}
});

router.get("/session/:id/queue", async function (ctx, next) {
	if (!(ctx.params.id in global.rooms)) {
		console.log(global.rooms)
		console.log(ctx.params)
		ctx.status = 404;
	} else {
		ctx.body = global.rooms[ctx.params.id].queue;
	}
});

router.post("/session/:id", async function (ctx, next) {
	console.log(ctx.request.body.query);
	global.rooms[ctx.params.id].addSong(ctx.request.body.query);
	ctx.body = "Woot woot";
});

router.delete("/session/:id", async function (ctx, next) {
	global.rooms[ctx.params.id].removeSong(ctx.request.query.id);
});

router.get("/audio", async function (ctx, next) {
	let safePath = path.normalize(ctx.query.id).replace(/^(\.\.[\/\\])+/, '');
	ctx.body = fs.createReadStream(path.join("audio", safePath));
});

router.get("/bloop", async function (ctx, next) {
	ctx.body = fs.createReadStream("public/bloop.wav");
})

app.use(router.routes());
app.use(router.allowedMethods());

const server = http.createServer(app.callback());


server.listen(8080, function () {
	console.log("listening!");
	global.rooms = {};
});

const ds = global.ds = deepstream("localhost:6020").login({"username": "server"}, () => {
	console.log("connected to deepstream");
});

console.log("clearing audio database");
child_process.exec("rm -f audio/*", [], (error, stdout, stderr) => {
	if (error) {
		throw error;
	}
	console.log(stdout);
});
