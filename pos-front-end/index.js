const serve = require('koa-static');
const Koa = require('koa');
const app = new Koa();
const opt = {
	maxage: 1000 * 60 * 60 * 2//in millisecond for 2 hrs
}
app.use( serve(`${__dirname}/public/app`,opt) );
app.use( serve(`${__dirname}/node_modules`,opt) );
app.use( serve(`${__dirname}/public`,opt) );

let {name,version} = require('./package.json');
//console.log(__dirname);

if(!module.parent){    //判断是被require 还是直接调用
	let port = 8081;
	if( process.argv.length>=3 ){  // argv1=path argv2=file
		let arg = process.argv[2];
		port = Number.parseInt( arg );
		if( !Number.isInteger(port) || !(port>0&&port<65536) ){
			console.error(`port not available ${arg}`);
			process.exit(1);
		}
	}
	console.log(`${name} ${version} listening on ${port}`);
	app.listen(port);
}
else{
  module.exports = {
		name:name,
		version:version,
		app:app
	}
}
