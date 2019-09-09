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
	const tmp = file.path;
	const input = await promisify(fs.readFile)(tmp);
	let hash = crypto.createHash('md5');
	hash.update(input );
	hash = hash.digest('hex');
	const filedir = ctx.configure.filedir;
	const audio = `${hash}.mp3`;
	const waveform = `${hash}.png`;

	let audioPath = `${filedir}/${audio}`;
    let waveformPath = `${filedir}/${waveform}`;
    let can='fileChromagram -i'
	await promisify(fs.copyFile)(tmp, audioPath);
	const cmd = `${ctx.configure.audio2waveform2} ${can} ${audioPath}`;
	try{
		await promisify(cp.exec)(cmd);
	}catch(err){
		ctx.err(err);
		ctx.bad('failed to convert audio to waveform',{
			hash:hash,
		});
		return;
	}
	if(ctx.query['get-filename']==='true'){
		ctx.good(null,{filename:waveform});
		return;
	}
	ctx.type = waveform;
	ctx.body = fs.createReadStream(waveformPath);
});
router.get('/:filename',async(ctx)=>{
	let filename = ctx.params['filename'];
	if( !filename )return ctx.bad('required url params filename');
	if( !(filename.includes('.png')|| filename.includes('.jpg')) )return ctx.bad(`invalid filename ${filename}`);
	const filedir = ctx.configure.filedir;
	const fpath = `${filedir}/${filename}`;
	ctx.type = filename;
	ctx.body = fs.createReadStream( fpath);
});



module.exports = router;
