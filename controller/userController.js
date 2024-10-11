const dbConnection = require('../db/dbConfig') // Import the database connection
const bcrypt = require('bcrypt');
const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken');
//const bodyParser = require('body-parser');




// Register function
const register= async (req, res) => {
   const { username, first_name, last_name, email, password } = req.body;

    // // Check for empty fields
    if (!username || !first_name || !last_name || !email || !password) {
         return res.status(StatusCodes.BAD_REQUEST).json({ error: "All fields are required." });
         
    }

    try {
           // Check if user already exists
        const [usertable] = await dbConnection.query('SELECT * FROM usertable WHERE username = ? OR email = ?', [username, email]);
                 
            if (usertable.length > 0) {
                return res.status(StatusCodes.BAD_REQUEST).send("Username or email already exists");
            }
    

             //salt 
             const salt = await bcrypt.genSalt(10)

            // Hash the password before saving
           const hashedPassword = await bcrypt.hash(password, salt);


           if ( password.length <= 8 ) {
            return res.status(StatusCodes.BAD_REQUEST).json({msg: "Password must be at least  8 character. " });
           }



        // Insert new user into the database
        await dbConnection.query('INSERT INTO usertable (username, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)', [username, first_name, last_name, email, hashedPassword]);
        res.status(StatusCodes.CREATED).send("User registered successfully");
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(StatusCodes.	INTERNAL_SERVER_ERROR).send("Error registering user");
    }
};





async function login(req, res) {
    const { email, password } = req.body;

    // // Check for empty fields
    if ( !email || !password) {
         return res.status(StatusCodes.BAD_REQUEST).json({ msg: "All fields are required." });
         
    }

  try {
       // Check if user already exists
       const [usertable] = await dbConnection.query('SELECT username, userid,password FROM usertable WHERE email = ?', [ email]);
      
       
        // If no user found, respond with an error
        if (usertable.length === 0) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid  email or password" });
        }


          
        // Verify the password
        const isMatch = await bcrypt.compare(password, usertable[0].password);
        if (!isMatch) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid  email or password." });
        }
       
        // Create JWT token

        username=usertable[0].username
        userid= usertable[0].userid
        const token = jwt.sign({ username, userid }, 'jwt_secret', { expiresIn: '1h' });
        res.status(StatusCodes.OK).json({ msg: "Login successful", token });


  } catch (error) {
    console.error('Error registering user:', err);
        res.status(StatusCodes.	INTERNAL_SERVER_ERROR).send("An error occurred.");
    
  }


}









function checkUser(req, res) {
    
          //res.send(" To check user account is successful")
          const  username = req.user.username
          const  userid = req.user.userid
          return res.status(StatusCodes.OK).json({ msg: "Valid user", username, userid });


          
    //     // Retrieves and responds with the username and user ID from the request object.
    //     try {
    //      const { username, userid } = req.user;
    //      if (!username || !userid) {
    //        // Handle cases where req.user might not have the required properties
    //        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized", message: "User information missing" });
    //      }
    //      return res.status(StatusCodes.OK).json({ msg: "Valid user", username, userid });
    //    } catch (error) {
    //      console.log("Error in checkUser:", error.message);
    //      return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized", message: "Authentication invalid" });
    //    }
       
       
    //    }
}



// Export the controller functions
module.exports = { register, login, checkUser}