import { databasePool } from "../app";
import crypto from "crypto";
import { IUser } from "../interfaces/Auth";
import { RowDataPacket } from "mysql2";

export const login = async (auth: IUser): Promise<boolean> => {
  try {
    const { email, password } = auth;
    const query = "SELECT password FROM users WHERE email = ?";
    const [rows] = await databasePool.query<RowDataPacket[]>(query, [email]);
  
    if (Array.isArray(rows) && rows.length === 1) {
      const storedPassword = rows[0].password;
      const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
  
      return hashedPassword === storedPassword;
    } else {
      return false;
    }
  } catch (err) {
    console.error("Error during login:", err);
    throw err;
  }
};
  
export const register = async (auth: IUser): Promise<boolean> => {
  try {
    const { email, password } = auth;
    const emailCheckQuery = "SELECT COUNT(*) AS count FROM users WHERE email = ?";
    const [emailCheckResults] = await databasePool.query<RowDataPacket[]>(emailCheckQuery, [email]);
    const emailCheckResult = emailCheckResults[0];
  
    const emailExists = emailCheckResult.count > 0;
  
    if (emailExists) {
      throw new Error("Email already exists");
    }
  
    const query = "INSERT INTO users (email, password, created) VALUES (?, ?, NOW())";
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
  
    await databasePool.query(query, [email, hashedPassword]);
    return true;
  } catch (err) {
    console.error("Error during registration:", err);
    throw err;
  }
};

