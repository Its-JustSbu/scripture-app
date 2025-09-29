import { Router } from "express";
import db from "../db/connection.js";
import createSecretToken from "../utils/SecretToken.js";
import bcrypt from "bcrypt";
import userVerifyToken from "../utils/AuthMiddleware.js";
import { ObjectId } from "mongodb";

const users = Router();

users.get("/getall/:id", async (req, res) => {
  try {
    const query = { _id: { $ne: new ObjectId(req.params.id) } };
    let collections = await db.collection("Users");
    let results = await collections.find(query).toArray();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Error getting users", error });
  }
});

users.get("/:id", async (req, res) => {
  try {
    let collections = await db.collection("Users");
    let result = await collections.findOne({
      _id: new ObjectId(req.params.id),
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error getting user", error });
  }
});

users.post("/verifyToken", userVerifyToken);

users.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let collections = await db.collection("Users");
    const user = await collections.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Incorrect password or email" });
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(401).json({ message: "Incorrect password or email" });
    }

    const token = createSecretToken(user._id, user.role);

    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      token: token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging in user", error, success: false });
  }
});

users.post("/register", async (req, res) => {
  try {
    let { firstname, lastname, phone, email, password, notification } =
      req.body;

    const role = "user";
    password = await bcrypt.hash(password, 12);
    const createdAt = new Date().toISOString();

    let collections = await db.collection("Users");
    const existingUser = await collections.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    await collections.insertOne({
      firstname,
      lastname,
      phone,
      email,
      password,
      role,
      createdAt,
      notification,
    });

    res
      .status(200)
      .json({ message: "User signed up successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

users.patch("/changepassword", async (req, res) => {
  try {
    const { email, password, newpassword } = req.body;

    if (!password || !newpassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let collections = await db.collection("Users");
    let user = await collections.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const newHashedPassword = await bcrypt.hash(newpassword, 12);
    const query = { email: email };
    const updateDocument = {
      $set: {
        password: newHashedPassword,
      },
    };

    await collections.updateOne(query, updateDocument);
    res
      .status(200)
      .json({ message: "Password updated successfully", success: true });
  } catch (err) {
    res.status(500).json({ message: "Error updating password", err });
  }
});

users.patch("/", async (req, res) => {
  try {
    const { email, firstname, lastname, phone } = req.body;
    if (!email || !firstname || !lastname || !phone) {
      return res.json({ message: "All fields are required" });
    }

    let collections = await db.collection("Users");
    let user = await collections.findOne({ email });
    if (!user) {
      return res.json({ message: "User not found" });
    }

    const query = { email: email };
    const updateDocument = {
      $set: {
        firstname: firstname,
        lastname: lastname,
        phone: phone,
      },
    };

    const result = await collections.updateOne(query, updateDocument);
    res.status(200).json({ message: "User updated successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
});

users.patch("/updatepermissions/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const { role } = req.body;

    let collections = await db.collection("Users");

    const updateDocument = {
      $set: {
        role: role,
      },
    };

    await collections.updateOne(query, updateDocument);
    res
      .status(200)
      .json({ message: "User role updated successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Error updating role of user", error });
  }
});

users.patch("/batch", async (req, res) => {
  try {
    const query = { role: "admin" };
    const { message } = req.body;

    let collections = await db.collection("Users");
    let users = await collections.find(query).toArray();

    users.forEach(async (user) => {
      user.notification.push({
        id: user.notification[user.notification.length - 1].id + 1,
        message: message,
      });

      const updateDocument = {
        $set: {
          notification: user.notification,
        },
      };

      await collections.updateOne(query, updateDocument);
    });
    
    res
      .status(200)
      .json({ message: "Admins notified", success: true });
  } catch (error) {
    res.status(500).json({ message: "Error notifying admins", error });
  }
});

users.patch("/notify/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const { message } = req.body;

    let collections = await db.collection("Users");
    let user = await collections.findOne(query);

    user.notification.push({
        id: user.notification[user.notification.length - 1].id + 1,
        message: message,
    });

    const updateDocument = {
      $set: {
        notification: user.notification,
      },
    };

    const result = await collections.updateOne(query, updateDocument);
    res.status(200).json({ message: "User notified", success: true });
  } catch (error) {
    res.status(500).json({ message: "Error notifying user", error });
  }
});

users.delete("/notify/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const { notification } = req.body;

    let collections = await db.collection("Users");

    const updateDocument = {
      $set: {
        notification: notification,
      },
    };

    await collections.updateOne(query, updateDocument);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Error reading notification", error });
  }
});

users.delete("/:id", async (req, res) => {
  try {
    let query = { _id: new ObjectId(req.params.id) };
    let collections = await db.collection("Users");
    const user = await collections.findOne(query);
    if (!user) {
      return res.json({ message: "User not found" });
    }
    let result = await collections.deleteOne(query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

export default users;