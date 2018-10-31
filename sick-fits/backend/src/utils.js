function hasPermission(user, permissionsNeeded) {
  const matchedPermissions = user.permissions.filter(permissionTheyHave =>
    permissionsNeeded.includes(permissionTheyHave)
  );
  if (!matchedPermissions.length) {
    throw new Error(`You do not have sufficient permissions

      : ${permissionsNeeded}

      You Have:

      ${user.permissions}
      `);
  }
}

function setCookieWithToken (ctx, token) {
  ctx.response.cookie('token', token, {
    httpOnly: true, 
    maxAge: 1000 * 60 * 60 * 24 * 365,
  })
};

exports.hasPermission = hasPermission;
exports.setCookieWithToken = setCookieWithToken;
