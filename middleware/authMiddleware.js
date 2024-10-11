const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");


async function authMiddleware(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) { 
    return res.status(StatusCodes.UNAUTHORIZED).json({message: "Authentication invalid"});
  }
  //Extracts the token from the Authorization header
const token = authHeader.split(" ")[1];
  // console.log(authHeader)
  // console.log(token)
    
  try {
                //Verifies the token with the secret key and extracts username and userid from the payload.
                //const { username, userid } = jwt.verify(token,process.env.JWT_SECRET);

   const {username, userid}  = jwt.verify(token, "jwt_secret");
   //return res.status(StatusCodes.OK).json({data})
   req.user ={username, userid}
   next()
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized account", message: "invalid Authentication " });
  }
}
module.exports = authMiddleware