// Importing bcrypt library for encrypting passwords
const bcrypt = require("bcrypt");

// Importing the User model
const User = require("../models/user");

// Importing the transporter for sending emails
const transporter = require("../utils/transporter");

// Importing the EMAIL_ID from the configuration file
const { EMAIL_ID } = require("../utils/config");

const userController = {
  // API for registering users
  register: async (req, res) => {
    try {
      // Destructuring the request body
      const { firstName, lastName, email, password, salaryPerMonth } = req.body;

      // Checking if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.json({ message: "User with this email already exists" });
      }

      // Encrypting the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Creating a new user
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        salaryPerMonth,
      });

      // Saving the user to the database
      await user.save();

      // Sending email
      transporter.sendMail({
        from: EMAIL_ID,
        to: email,
        subject: "Activate your account",
        text: `Click here to reset your password: http://localhost:3000/users/activate/${user._id}`,
      });

      // Sending a success response
      res.status(201).json({
        message:
          "Your account has been created successfully. Check your email to activate your account.",
        user,
      });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to Activate user profile
  activateUser: async (req, res) => {
    try {
      // Fetching the id from url params
      const { id } = req.params;

      // Checking if the id is valid
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      // Updating the user status to active
      user.isActive = true;
      await user.save();

      // Sending a success response
      res.status(200).send({ message: "User activated successfully" });
    } catch (error) {
      // Sending an error response
      res.status(500).send({ message: error.message });
    }
  },
};

module.exports = userController;
