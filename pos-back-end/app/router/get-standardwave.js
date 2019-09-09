const Router = require('koa-router');
const {promisify} = require('util');
const cp = require('child_process');
const fs = require('fs');
const crypto = require('crypto');
const router = new Router();
const db=require('./dbConfig')

router.post('/', async (ctx)=>{
	const body = ctx.request.body;
    let ckey=body.character;
    console.log(ckey);
    let query=()=>{
        return new Promise((reslove,reject)=>{
            db.query("select waveAddress from charinfo where charName = '"+ckey+"'",(err,data)=>{
                if(err){
                    console.log(err);
                    reject(err);
                }
                else{
                    console.log(data)
                    reslove(data[0])
                }
            })
        })
    }

    let res=await query();
    ctx.body=res;
});


module.exports = router;
