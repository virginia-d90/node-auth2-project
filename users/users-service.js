module.exports = {
    isValid,
  };
  
  function isValid(req, res, next) {
      const {username, password} = req.body
    if(username && password && typeof password === "string"){
        next()
    } else {
        res.status(400).json({message: "shape of data is incorrect"})
    }
  }