

const mutations = {
  async createItem(parent, args, ctx, info) {
    //TODO: Check if they are logged in
    const item = await ctx.db.createItem({ ...args }, info)
    return item;
  },
  async updateItem(parent, args, ctx, info) {
    const updates = { ...args };
    delete updates.id;
    const itemUpdate = await ctx.db.updateItem({
      data: updates,
      where: {
        id: args.id
      }
    }, 
    info
    )
    return itemUpdate
  },
  async deleteItem( parent, args, ctx, info ) {
    const where = { id: args.id };
    // find the item
    const item = await ctx.db.item(where, `{id title }`);
    // find if they own or have permissions

    // delete it!
    return ctx.db.deleteItem(where, info);
  }
};

module.exports = mutations;
