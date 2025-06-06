import express from "express";
import {
  forgotPasswordControllers,
  loginController,
  registerController,
  testController,
  updateProfileController,
  getOrdersController,
  getAllOrdersControllers,
  orderStatusController,
} from "../controllers/authController.js";
import { isAdmin, requiresSignIn } from "../middlewares/authMiddleware.js";

// router Object
const router = express.Router();

// routing
// Register || METHOD POST
router.post("/register", registerController);

// LOGIN || POST
router.post("/login", loginController);

//Forgot Password || POST
router.post('/forgot-password',forgotPasswordControllers);

// test Routes
router.get("/test", requiresSignIn, isAdmin, testController);

// Protected  User routes auth
router.get("/user-auth", requiresSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// Protected Admin route auth
router.get("/admin-auth", requiresSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// update profile
router.put('/profile', requiresSignIn, updateProfileController);


// Orders
router.get('/orders', requiresSignIn, getOrdersController);


// All orders
router.get('/all-orders', requiresSignIn, isAdmin, getAllOrdersControllers);



// order status update
router.put(
  "/order-status/:orderId",
  requiresSignIn,
  isAdmin,
  orderStatusController
);

export default router;
