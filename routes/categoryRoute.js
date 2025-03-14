import express from "express";
import { isAdmin, requiresSignIn } from "./../middlewares/authMiddleware.js";
import {
  createCategoryController,
  updateCategoryController,
  getAllCategoryController,
  singleCategoryController,
  deleteCategoryController,
} from "../controllers/categoryController.js";

// router Object
const router = express.Router();

// Create Category
router.post(
  "/create-category",
  requiresSignIn,
  isAdmin,
  createCategoryController
);

// Update Category
router.put(
  "/update-category/:id",
  requiresSignIn,
  isAdmin,
  updateCategoryController
);
//getAll category
router.get("/get-category", getAllCategoryController);

//Single category
router.get("/single-category/:slug", singleCategoryController);

// Delete Category
router.delete(
  "/delete-category/:id",
  requiresSignIn,
  isAdmin,
  deleteCategoryController
);

export default router;
