const adminMiddleware = (req, res, next) => {
  console.log("adminMiddleware called, req.user:", req.user);
  try {
    if (req.user && req.user.role === 'admin') {
      console.log("Admin verified");
      next();
    } else {
      console.log("Access denied in adminMiddleware");
      res.status(403).json({ message: "Access denied: You are not an administrator." });
    }
  } catch (err) {
    console.error("Error in adminMiddleware:", err);
    res.status(500).json({ message: "Internal server error in adminMiddleware" });
  }
};

export default adminMiddleware
/* const adminMiddleware = (req, res, next) => {
  console.log('inside admin middleware req.user = ' + JSON.stringify(req.user))
  console.log('inside admin middleware req.user.role = ' + req.user.role)
  // Check if the user is authenticated and has the 'admin' role
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    // Return a 403 Forbidden error if the user is not an admin
    res.status(403).json({ message: "Access denied: You are not an administrator." });
  }
};

export default adminMiddleware; */