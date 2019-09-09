const Router = require('koa-router');
const router = new Router();

/**
 * /admin-user
 */
router.get('/',
    async (ctx) => {
        let User =  ctx.mongoose.model(ctx.configure.model.user);
        let res = await User.find({}).exec();
        ctx.good(null,res);
    });
//TODO add router.use to identify one user
router.del('/:username',
    async (ctx) => {
        let User =  ctx.mongoose.model(ctx.configure.model.user);
        let res = await User.remove({username:ctx.params['username']}).exec();
        ctx.good(null,res);
    });
router.get('/:username',
    async (ctx) => {
        let User =  ctx.mongoose.model(ctx.configure.model.user);
        let res = await User.findOne({username:ctx.params['username']}).exec();
        ctx.good(null,res);
    });

module.exports = router;