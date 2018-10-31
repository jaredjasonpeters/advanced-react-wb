const { forwardTo } = require('prisma-binding')
const { hasPermission } = require('../utils')

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  async users(parent, args, ctx, info) {
    // 1. Check if they are logged in
    if (!ctx.request.userId) {
      throw new Error('You must be logged in!')
    }
    // 2. Check if the user has permissiion to query all the users
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);
    // 3. If they do, query all the users!
    const users = await ctx.db.query.users({}, info)
    return users
  },
  me(parent, args, ctx, info) {
    //check if there is a current userId
    if(!ctx.request.userId) return null
    return ctx.db.query.user({
      where: { id: ctx.request.userId },
    }, info);
  }
};

module.exports = Query;
