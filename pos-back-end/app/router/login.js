const Router = require('koa-router');
const router = new Router();

/**
 * /login
 */
router.post('/',
    async (ctx) => {
        let body = ctx.request.body.fields;
        let User = ctx.mongoose.model(ctx.configure.model.user);
        try {
            let res = await User.findOne({
                username: body['username'],
                password: body['password']
            }).exec();
            if (!res) {
                ctx.bad('user not found');
            }
            else {
                ctx.good(`welcome ${body.username}`, res);
            }
        }
        catch (err){
            ctx.bad(null,err);
        }
    });
module.exports = router;
