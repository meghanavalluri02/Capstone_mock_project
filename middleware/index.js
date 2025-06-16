const middlewareObject = {};

middlewareObject.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You are already logged in.");
  res.redirect("/");
};

middlewareObject.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You must be signed in to access that page.");
  res.redirect("/user/signin");
};

module.exports = middlewareObject;
