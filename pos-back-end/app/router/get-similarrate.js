const Router = require('koa-router');
const {promisify} = require('util');
const cp = require('child_process');
const fs = require('fs');
const crypto = require('crypto');
const router = new Router();
const db=require('./dbConfig')

router.post('/', async (ctx)=>{
	const body = ctx.request.body;
    let src1=body.src1;
    let src2=body.src2;
    var curResult;
    console.log('src1:'+src1)
    console.log('src2:'+src2)

    const cmd = `${ctx.configure.getsimilarrate} ${src1} ${src2}`;
	try{
        const {stdout,stderr}=await promisify(cp.exec)(cmd);
        if( stderr ){
            // FIXME two identical picture causes error
            ctx.err('stderr from waveform_compare',stderr);
        }else {
            console.log('stdout:'+stdout);
            if( ( curResult =Number.parseFloat( stdout) ) >= 0 ){
                curResult=Number.parseFloat( stdout)*100
            }
        }
	}catch(err){
		ctx.err(err);
		ctx.bad('failed to convert audio to waveform',{
			hash:src1,
		});
		return;
    }
    
	ctx.body = {rate:curResult};

});


module.exports = router;
