const express = require('express');

const router = express.Router();
const { validateBody } = require("../../utils");
const { schemas } = require("../../models/user");

const ctrl = require('../../controllers/auth-controller')
const { authenticate } = require("../../middlewares/index");
const { upload } = require('../../middlewares/index')




router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.get("/verify/:verificationToken", ctrl.verify);

router.post(
  "/resend-verification-email",
  validateBody(schemas.resendEmail),
  ctrl.resendVerificationEmail
);

router.post('/login', validateBody(schemas.loginSchema), ctrl.login)
router.get("/current", authenticate, ctrl.getCurrent);
router.post("/logout", authenticate, ctrl.logout);
router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),

  ctrl.updateAvatar,
  
);

router.patch(
  "/:id",
  authenticate,
  validateBody(schemas.updateSubscriptionSchema),
  ctrl.changeSubscription);




module.exports = router;