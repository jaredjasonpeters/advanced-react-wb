const Query = {
  async items(parent, args, ctx, info) {
    const items = await ctx.db.items()
    return items
  },
  async item(parent, args, ctx, info) {
    const item = await ctx.db.item({id: args.id})
    return item
  }
};

module.exports = Query;
