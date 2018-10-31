const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, makeANiceEmail } = require('../mail');
const { setCookieWithToken } = require('../utils')

const mutations = {
  
  async createItem(parent, args, ctx, info) {
    if(!ctx.request.userId) {
        throw new Error('You must be logged in to do that');
    }

    const item = await ctx.db.mutation.createItem(
      { 
        data: {
          //This is how we create a relationship between item and user
          user: {
            connect: {
              id: ctx.request.userId,
            }
          },
          ...args,
        },
      }, info)

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
    const where = { where: {id: args.id } };
    // find the item
    const item = await ctx.db.query.item(where, `{id title }`);
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
    setCookieWithToken(ctx, token);
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
   },




   async requestReset(parent, args, ctx, info){
    //1. Check if this is a real user
    const user = await ctx.db.query.user({where: { email: args.email }})
    if (!user) {
      throw new Error(`No such user found for email ${args.email}`)
    }
    //2. Set a reset token and expiry on that user
    const resetToken = (await promisify(randomBytes)(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; //1 hour
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry },
    });
    //3. Email them that reset token
    const mailRes = await transport.sendMail({
      from: 'jared@jared.com',
      to: user.email,
      subject: 'Your Password Reset Token',
      html: makeANiceEmail(`Your Password Reset Token is Here 
      \n\n 
      <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click here to Reset!</a>`),
    });
    //4. Return the message
    return { message: 'Thanks!' };
   },


   

   async resetPassword(parent, args, ctx, info) {
     // 1. check if the passwords match
     if(args.password !== args.confirmPassword) {
       throw new Error('Passwords don\'t match!');
     }
     // 2. check if its a legit reset token
     // 3. check if its expired
     const [user] = await ctx.db.query.users({
       where: {
         resetToken: args.resetToken,
         resetTokenExpiry_gte: Date.now() - 3600000
       }
     });
     if(!user) {
       throw new Error('This token is either invalid or expired');
     }
     // 4. Hash their new password
     const password = await bcrypt.hash(args.password, 10);
     //5. Save the new password to the user and remove old resetToken fields
     const updatedUser = await ctx.db.mutation.updateUser({
       where: {
         email: user.email
       },
       data: {
         password,
         resetToken: null,
         resetTokenExpiry: null,
       }
     })
     //6. Generate JWT
     const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
     //7. Set the JWT cookie
     setCookieWithToken(ctx, token);
     //8. return the new user
    return updatedUser;
   }
  };

module.exports = mutations;

