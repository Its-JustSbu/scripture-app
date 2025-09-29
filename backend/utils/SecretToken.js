import { config } from 'dotenv'
import jwt from 'jsonwebtoken'

config()

const { TOKEN_KEY } = process.env

export default function createSecretToken(id, role) {
  return jwt.sign({ id, role }, TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};