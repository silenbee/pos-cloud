// mount global router

const Router = require('koa-router');
const router = new Router();
const configure = require('../configure');

/**
 * COR controls for options
 */
router.options('/*',(ctx)=>{
	ctx.set('Access-Control-Allow-Headers','Content-Type');
    ctx.set('Access-Control-Allow-Origin','*');
    ctx.set('Access-Control-Allow-Methods','POST, GET, OPTIONS, DELETE, PUT');
    ctx.set('Access-Control-Max-Age','86400');//in second for one day
    ctx.body = '';
});


router.use('/*', async(ctx,next)=>{
		ctx.set('Access-Control-Allow-Origin','*');//must set
		const body = ctx.request.body;
		let file = body['files'];
		let req = ctx.request;
		req = `${(new Date()).toString()} ${req.method} on ${req.host}${req.url} `;
		let bodystr = body['fields'];
		if(bodystr)bodystr = JSON.stringify(bodystr);
		if( bodystr && bodystr!=='{}' ){
			req += `with body ${bodystr}`;
		}

		if(file){
			req += 'with files : ';
			for( let k in file ){
				let f = file[k];
				req += 
				` key:${k} name:${f.name} size:${f.size/1024}Kib type:${f.type}`;
			}
		}
		await next();

		let res;
		if( res = ctx.body['path'] ){
			res = `send file ${res}`;
		}
		else {
			res = JSON.stringify(ctx.body).substr(0,100);
		}
		req += ` with res.body ${res}`;
		ctx.debug(req);


		//ctx.debug(ctx.request.body);
		/**
		 * log to Db
		 *
		 */
//FIXME
if(configure.enableDbLog){
	console.log( ctx.request);
	req = `${req.method} on ${req.host}${req.url} with body `+ JSON.stringify(req['body']['fields']);
	await next();
	let res = JSON.stringify(ctx.body);
	let log = new Log(Log.newInstance(req,res));
	log.save();
}
});

/*
 * this is an alive check
 */
router.get('/how-are-you', async(ctx)=>{
	ctx.good('i am fine, thank you, and you?');
});

// TODO USE FS.READDIR to auto load router
//router.use('/login',require('./router/login').routes());
//router.use('/register',require('./router/register').routes());
//router.use('/log',require('./router/log').routes());
router.use('/get-audio',require('./router/get-audio').routes());
router.use('/get-audio1',require('./router/get-audio1').routes());
router.use('/get-waveform',require('./router/get-waveform').routes());
router.use('/get-waveform2',require('./router/get-waveform2').routes());
router.use('/get-standardwave',require('./router/get-standardwave').routes());
router.use('/get-similarrate',require('./router/get-similarrate').routes());


module.exports = router;
