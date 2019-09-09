/**
 *   For log see schema/log
 *   Created by xs at 2018/3/21
 */
"use strict";
const Router = require('koa-router');
const router = new Router();

router.get('/',async (ctx) =>{
    let Log = ctx.mongoose.model(ctx.configure.model.log);
    try{
        let log = await Log.find().exec();
        ctx.good(null,log);
    }catch (err){
        ctx.bad(null,err);
    }
});

module.exports = router;

