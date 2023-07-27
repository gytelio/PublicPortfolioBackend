import { Request, Response, NextFunction } from "express";
import { savePhoto, updatePhoto, deletePhoto, getPhotos } from "../models/Photos";
import { register, login } from "../models/Auth";
import { IUser } from "../interfaces/Auth";
import jwt from "jsonwebtoken";

export class AuthControllers {
  static async welcome(req: Request, res: Response, _next: NextFunction): Promise<void> {
    res.send("gytelio productions");
  }
  static async loginUser(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      if (!req.body) {
        throw new Error("No input");
      }
      const loginInfo = req.body as IUser;
      const success = await login(loginInfo);
      if (success) {
        console.log("Succesfully logged in");
        const accessToken = jwt.sign({ email: loginInfo.email }, process.env.ACCESS_TOKEN!, {
          expiresIn: 5 * 60 * 60,
        });
        res.cookie("jwt", accessToken, { maxAge: 5 * 60 * 60 * 1000 });
        res.json({ user: loginInfo.email });
      } else {
        console.log("Wrong password");
        throw new Error("Wrong password");
      }
    } catch (err) {
      res.status(500).send({ message: `Internal Server Error.\n\n${err}` });
    }
  }
  static async logoutUser(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      res.clearCookie("jwt");  
      res.send(200);
    } catch (err) {
      res.status(500).send({ message: `Internal Server Error.\n\n${err}` });
    }
  }
  static async registerUser(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      if (!req.body) {
        throw new Error("No input");
      }
      const registerInfo = req.body as IUser;
      await register(registerInfo);
      console.log("Succesfully registered user");
      res.sendStatus(200);
    } catch (err) {
      res.status(500).send({ message: `Internal Server Error.\n\n${err}` });
    }
  }
}

export class GalleryControllers {
  static async setFile(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      if (!req.files || !req.files.file) {
        res.status(400).send("No file uploaded");
        return;
      }
      const photos = req.files.file;
      const saved = await savePhoto(photos);
      console.log("Succesfully saved to cloud and database");
      res.send(saved);
    } catch (err) {
      res.status(500).send({ message: `Internal Server Error.\n\n${err}` });
    }
  }
  static async updateFile(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      if (!req.files || !req.files.file || !req.params.public_id) {
        res.status(400).send("No file uploaded");
        return;
      }
      const photos = Array.isArray(req.files.file) ? req.files.file[0] : req.files.file;
      const updated = await updatePhoto(photos, req.params.public_id);
      console.log("Succesfully updated cloud and database");
      res.send(updated);
    } catch (err) {
      res.status(500).send({ message: `Internal Server Error.\n\n${err}` });
    }
  }
  static async deleteFile(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      if (!req.params.public_id) {
        res.status(400).send("No file uploaded");
        return;
      }
      const deleted = await deletePhoto(req.params.public_id);
      console.log("Succesfully deleted from cloud and database");
      res.send(deleted);
    } catch (err) {
      res.status(500).send({ message: `Internal Server Error.\n\n${err}` });
    }
  }
  static async getFiles(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const result = await getPhotos();
      console.log(`Returning ${result?.length} photos from the db`);
      res.send(result);
    } catch (err) {
      res.status(500).send({ message: `Internal Server Error.\n\n${err}` });
    }
  }
}

