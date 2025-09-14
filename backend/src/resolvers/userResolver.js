/* import jwt from "jsonwebtoken";
import Joi from "joi";
import User from "../models/User.js";

// Joi schema for input validation
const userSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const userResolvers = {
  Query: {
    users: async (_, __, { user }) => {
      if (!user) throw new Error("Authentication required.");
      try {
        return await User.find();
      } catch (err) {
        throw new Error("Error fetching users: " + err.message);
      }
    },
    user: async (_, { id }, { user }) => {
      if (!user) throw new Error("Authentication required.");
      try {
        const foundUser = await User.findById(id);
        if (!foundUser) throw new Error("User not found.");
        return foundUser;
      } catch (err) {
        throw new Error("Failed to fetch user.");
      }
    },
  },

  Mutation: {
    createUser: async (_, { input }) => {
      const { error } = userSchema.validate(input);
      if (error) throw new Error(error.details[0].message);
      
      try {
        const user = new User(input);
        return await user.save();
      } catch (err) {
        if (err.code === 11000) {
          throw new Error("Email address is already in use.");
        }
        throw new Error("Failed to create user: " + err.message);
      }
    },

    updateUser: async (_, { id, input }, { user }) => {
      if (!user) throw new Error("Authentication required.");
      if (user.userId !== id) throw new Error("Unauthorized access. You can only update your own profile.");

      try {
        const updatedUser = await User.findByIdAndUpdate(id, input, { new: true });
        if (!updatedUser) throw new Error("User not found for update.");
        return updatedUser;
      } catch (err) {
        throw new Error("Failed to update user: " + err.message);
      }
    },

    deleteUser: async (_, { id }, { user }) => {
      if (!user) throw new Error("Authentication required.");
      if (user.userId !== id) throw new Error("Unauthorized access. You can only delete your own profile.");
      
      try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) throw new Error("User not found for deletion.");
        return true;
      } catch (err) {
        throw new Error("Failed to delete user: " + err.message);
      }
    },
    
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("Invalid credentials");

      const isMatch = await user.comparePassword(password);
      if (!isMatch) throw new Error("Invalid credentials");

      const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "3h",
      });

      return { token, user };
    },
  },
}; */

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Joi from "joi";

// Joi schema for input validation
const userSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const userResolvers = {
  Query: {
    users: async (_, __, { user }) => {
      if (!user) throw new Error("Authentication required.");
      try {
        return await User.find();
      } catch (err) {
        throw new Error("Error fetching users: " + err.message);
      }
    },
    user: async (_, { id }, { user }) => {
      if (!user) throw new Error("Authentication required.");
      try {
        const foundUser = await User.findById(id);
        if (!foundUser) throw new Error("User not found.");
        return foundUser;
      } catch (err) {
        throw new Error("Failed to fetch user.");
      }
    },
  },

  Mutation: {
    createUser: async (_, { input }) => {
      console.log(`input = ${input}`);

      const { error } = userSchema.validate(input);
      if (error) throw new Error(error.details[0].message);

      try {
        const { email, password } = input;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error("Email address is already in use.");
        }

        // The password will be hashed by the pre('save') hook in the User model.
        /* const newUser = new User(input); */
        const newUser = new User({
          ...input,
          role: input.role || "customer", // default to 'user' if not provided
        });

        const user = await newUser.save();

        // Generate a token for the new user
        const token = jwt.sign(
          { userId: user.id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "3h" }
        );

        // Return the AuthPayload object with the token and user
        return { token, user };

      } catch (err) {
        if (err.code === 11000) {
          throw new Error("Email address is already in use.");
        }
        throw new Error("Failed to create user: " + err.message);
      }
    },

    updateUser: async (_, { id, input }, { user }) => {
      if (!user) throw new Error("Authentication required.");
      if (user.userId !== id) throw new Error("Unauthorized access. You can only update your own profile.");
      if (input.password) {
        const salt = await bcrypt.genSalt(10);
        input.password = await bcrypt.hash(input.password, salt);
      }
      try {
        const updatedUser = await User.findByIdAndUpdate(id, input, { new: true });
        if (!updatedUser) throw new Error("User not found for update.");
        return updatedUser;
      } catch (err) {
        throw new Error("Failed to update user: " + err.message);
      }
    },

    deleteUser: async (_, { id }, { user }) => {
      if (!user) throw new Error("Authentication required.");
      if (user.userId !== id) throw new Error("Unauthorized access. You can only delete your own profile.");

      try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) throw new Error("User not found for deletion.");
        return true;
      } catch (err) {
        throw new Error("Failed to delete user: " + err.message);
      }
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("Invalid credentials");

      const isMatch = await user.comparePassword(password);
      if (!isMatch) throw new Error("Invalid credentials");

      const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "3h",
      });

      return { token, user };
    },
  },
};