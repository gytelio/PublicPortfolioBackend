import { Request, Response, NextFunction } from "express";
import { databasePool } from "../app";
import { savePhoto, updatePhoto, deletePhoto, getPhotos } from "../models/Photos";

export const getUsers = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  try {
    const sql = "SELECT * FROM users";
    const result = await databasePool.execute(sql);
    res.send(result); // Send the result as a response
  } catch (err) {
    res.status(500).send({ message: `Internal Server Error.\n\n${err}` });
  }
};

export const setFile = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
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
};

export const updateFile = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
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
};

export const deleteFile = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
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
};

export const getFiles = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  try {
    const result = await getPhotos();
    console.log(`Returning ${result?.length} photos from the db`);
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: `Internal Server Error.\n\n${err}` });
  }
};
