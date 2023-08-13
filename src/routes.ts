import express from "express";
import { GalleryControllers, AuthControllers } from "./controllers/Main";
import isAuthenticatedMiddleware from "./middleware/Auth";

const router = express.Router();
router.get("/", AuthControllers.welcome);
router.post("/login", AuthControllers.loginUser);
router.post("/register", isAuthenticatedMiddleware, AuthControllers.registerUser);
router.get("/logout", isAuthenticatedMiddleware, AuthControllers.logoutUser);

router.get("/photos", GalleryControllers.getFiles);
router.post("/photo/:main_index", isAuthenticatedMiddleware, GalleryControllers.setFile);
router.post("/photo/update/:public_id", isAuthenticatedMiddleware, GalleryControllers.updateFile);
router.delete("/photo/:public_id", isAuthenticatedMiddleware, GalleryControllers.deleteFile);

export default router;
