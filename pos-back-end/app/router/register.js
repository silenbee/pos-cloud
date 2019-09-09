const Router = require('koa-router');
const router = new Router();

/**
 * /register
 */
router.post('/',
    async (ctx) => {
        let body = ctx.request.body.fields;
        if (!body['username'] || !body['password']) {
            ctx.bad('lack field');
            return;
        }
        let User = await ctx.mongoose.model(ctx.configure.model.user);
        let user = await new User(User.newInstance(body));
        try{
            let res = await user.save();
            ctx.good(null, res);
        }
        catch (err){
            ctx.bad(null,err);
        }
    });

module.exports = router;
