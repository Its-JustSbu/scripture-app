import { config } from "dotenv";
import jwt from "jsonwebtoken";
import db from "../db/connection.js";

config();

const { TOKEN_KEY } = process.env;

export default function userVerifyToken(req, res) {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ status: false });
  }
  jwt.verify(token, TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      let collections = await db.collection("Users");
      const user = await collections.findById(data.id);
      if (user) return res.json({ status: true, user: user.email });
      else return res.json({ status: false });
    }
  });
};
