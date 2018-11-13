const { forwardTo } = require("prisma-binding");
const { hasPermission } = require("../utils");

const Query = {
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  async users(parent, args, ctx, info) {
    // 1. Check if they are logged in
    if (!ctx.request.userId) {
      throw new Error("You must be logged in!");
    }
    // 2. Check if the user has permissiion to query all the users
    hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"]);
    // 3. If they do, query all the users!
    const users = await ctx.db.query.users({}, info);
    return users;
  },
  async order(parent, args, ctx, info) {
    //1. Make sure they are logged in
    if (!ctx.request.userId) {
      throw new Error("You aren't logged in");
    }
    //2. Query the current order
    const order = await ctx.db.query.order(
      {
        where: { id: args.id }
      },
      info
    );
    //3. Check if they have the permissions to see this order
    const ownsOrder = order.user.id === ctx.request.userId;
    const hasPermissionToSeeOrder = ctx.request.user.permissions.includes(
      "ADMIN"
    );
    if (!ownsOrder || !hasPermission) {
      throw new Error("You can't see this budd!");
    }
    //4. reurn the order
    return order;
  },
  async orders(parent, args, ctx, info) {
    //1. Check if the user is signed in
    if (!ctx.request.userId) {
      throw new Error("You must be logged in to see this");
    }
    const { userId } = ctx.request;
    //2. Query all the users orders
    const orders = await ctx.db.query.orders(
      {
        where: {
          user: {
            id: userId
          }
        }
      },
      info
    );
    return orders;
  },
  me(parent, args, ctx, info) {
    //check if there is a current userId
    if (!ctx.request.userId) return null;
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId }
      },
      info
    );
  }
};

module.exports = Query;
