const router = require('./app/router.js');
const fs = require('fs');
const http=require('http');
const https = require('https');
const mount = require('koa-mount');

const Router = require('koa-router');
//const router = new Router();


const app = require('./app/koa.js');
const KoaBody = require('koa-body');

app
    .use(KoaBody({
        multipart:true
    }))
    //.use(router.routes());
    //.use(router.allowedMethods());
let port = app.context.configure.server.port;
let {name,version} = require('./package.json');
app.use( 
		mount('/pos/api/v0', router.routes() )
		);
app.use( 
		mount('/pos', require('../pos-front-end').app ) 
		);


if(!module.parent){
	port = 81;
	//port = port||80;
	if( process.argv.length>=3 ){
		let arg = process.argv[2];
		port = Number.parseInt( arg );
		if( !Number.isInteger(port) || !(port>0&&port<65536) ){
			console.error(`port not available ${arg}`);
			process.exit(1);
		}
	}
	console.log(`${(new Date()).toString()} ${name} ${version} listening on ${port}`);
	app.listen(port);
	const opt = {
		pfx: fs.readFileSync('../../hotpot.club.pfx'),
		passphrase:'z84553677'
	}
	http.createServer(opt, app.callback()).listen(443);
	console.log(`${(new Date()).toString()} ${name} ${version} listening on ${443}`);
}
else{
	module.exports = {
		name:name,
		version:version,
		app:app
	}
}
