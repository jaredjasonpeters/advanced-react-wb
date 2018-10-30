const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const mutations = {
  
  async createItem(parent, args, ctx, info) {
    //TODO: Check if they are logged in
    const item = await ctx.db.mutation.createItem({ data: {...args}}, info)
    return item;
  },
  async updateItem(parent, args, ctx, info) {
    const updates = { ...args };
    delete updates.id;
    const itemUpdate = await ctx.db.mutation.updateItem({
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
    const item = await ctx.db.mutation.item(where, `{id title }`);
    // find if they own or have permissions

    // delete it!
    return ctx.db.mutation.deleteItem(where, info);
  },
  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    //hash their password
    const hashedPassword = await bcrypt.hash(args.password, 10);
    //create user in database
    const user = await ctx.db.mutation.createUser({
      data: {
        ...args,
        password: hashedPassword,
        permissions: { set: ['USER'] },
      }
    }, info);
    // create the JWT for them
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // we set the jwt as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, //1 year cookie
    });
    //we return user to the Browser
    return user;

  },
  async signin(parent, {email, password}, ctx, info) {
    //1. check if there is a user
    const user = await ctx.db.query.user({ where : {email}})
    if(!user) {
      throw new Error(`No such user for email ${email}`);
    }
    //2. check if password matches
    const valid = await bcrypt.compare(password, user.password)
    if(!valid){
      throw new Error('Invalid Password');
    }
    //3. generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    //4. Set the cookie with the token
    setCookieWithToken(ctx, token)
    //5. return the user
    return user
   },
   signout(parent, args, ctx, info){
    ctx.response.clearCookie('token');
    return { message: 'Goodbye' }
   }
 };

module.exports = mutations;

function setCookieWithToken (ctx, token) {
  ctx.response.cookie('token', token, {
    httpOnly: true, 
    maxAge: 1000 * 60 * 60 * 24 * 365,
  })
};