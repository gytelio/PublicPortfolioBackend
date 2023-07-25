import express, { type Request, type Response, type NextFunction, type Router } from "express";
import { getUsers, setFile, updateFile, deleteFile, getFiles } from "./controllers/DatabaseController";

const router: Router = express.Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get("/posts", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getUsers(req, res, next);
  } catch (err) {
    next(err);
  }
});

router.post("/photo", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await setFile(req, res, next);
  } catch (err) {
    next(err);
  }
});

router.post("/photo/update/:public_id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await updateFile(req, res, next);
  } catch (err) {
    next(err);
  }
});

router.delete("/photo/:public_id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteFile(req, res, next);
  } catch (err) {
    next(err);
  }
});

router.get("/photos", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getFiles(req, res, next);
  } catch (err) {
    next(err);
  }
});

export default router;
