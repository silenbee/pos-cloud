const Router = require('koa-router');
const {promisify} = require('util');
const cp = require('child_process');
const fs = require('fs');
const crypto = require('crypto');
const router = new Router();

router.post('/', async (ctx)=>{
	const body = ctx.request.body;
	let file = body['files'];
	if( file )file = file['file'];
	if( !file ){
		ctx.bad('required field file with a file');
		return;
	}
	if( !file['type'].includes('image')  ){
		ctx.bad('file should be image');
		return;
	}
	const tmp = file.path;
	const filedir = ctx.configure.filedir;
	const candidate = [];
	const all = await promisify(fs.readdir)(filedir);
	// TODO add DB support
	all.forEach( (o)=>{
		if( o.includes('.png') )candidate.push(o);
	});
	const debug_get_audio = ctx.query['debug-get-audio'] === 'true';
	const debug = [];

	const cmd = ctx.configure.waveform_compare;
	let ans = null;
	let ansResult = 0.0;
	let curResult = 0.0;
	const threshold = ctx.configure.threshold;
	for(let i = 0 ;i<candidate.length; i++){
		const pic = candidate[i];
		const run = `${cmd} ${filedir}/${pic} ${tmp}`;
		console.log('run:'+run);
		try{
			const {stdout,stderr} = await promisify(cp.exec)(run);
			if( stderr ){
				// FIXME two identical picture causes error
				ctx.err('stderr from waveform_compare',stderr);
			}else {
				console.log('stdout:'+stdout);
				if( debug_get_audio ){
					debug.push({
						stdout:stdout,
						run:run,
						stderr:stderr
					});
				}
				else if( ( curResult =Number.parseFloat( stdout) ) >= threshold ){
					if( curResult < ansResult )continue;
					ans = pic;
					ansResult = curResult;
					if( !ctx.configure['best_result'])break;
				}
			}
		}catch(err){
			ctx.err('error in calling waveform_compare',err);
			debug.push({
				stdout:'-100.0',
				run:run,
				err:err
			});
		}
	}

	if(debug_get_audio){
		if(ctx.query['debug-runtime-error']==='true'){
			ctx.good(null,debug.filter( o=>o['err'] ) );
			return;
		}
		ctx.good(null,debug);
		return;
	}


	if(!ans){
		ctx.bad('this waveform has no matches');
		return ;
	}

	let audio;
	if(ans.includes('png') )audio = ans.replace('.png', '.mp3');
	if(ans.includes('jpg') )audio = ans.replace('.jpg', '.mp3');

	if(ctx.query['get-filename']==='true'){
		ctx.good(null,{filename:audio});
		return;
	}
	ctx.type = audio;
	ctx.body = fs.createReadStream(`${filedir}/${audio}`);
});
router.get('/:filename',async(ctx)=>{
	let filename = ctx.params['filename'];
	if( !filename )return ctx.bad('required url params filename');
	if( !filename.includes('.mp3') )ctx.bad(`invalid filename ${filename}, should contain .png`)
	const filedir = ctx.configure.filedir;
	const fpath = `${filedir}/${filename}`;
	ctx.type = filename;
	ctx.body = fs.createReadStream( fpath);
});

module.exports = router;
