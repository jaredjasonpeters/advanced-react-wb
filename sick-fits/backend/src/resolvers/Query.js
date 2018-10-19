const Query = {
  async items(parent, args, ctx, info) {
    const items = await ctx.db.items()
    return items
  }
};

module.exports = Query;
