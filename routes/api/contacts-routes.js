const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/contacts-controller");

const { validateBody } = require("../../utils");
const { schemas } = require("../../models/contacts");
const { isValidId, authenticate } = require("../../middlewares");

router.get("/", authenticate, ctrl.getAllContacts);

router.get("/:id", authenticate, isValidId, ctrl.getContactsById);

router.post(
  "/",
  authenticate,
  validateBody(schemas.addSchema),
  ctrl.addContact
);

router.delete("/:id", authenticate, isValidId, ctrl.deleteContacts);

router.put(
  "/:id",
  authenticate,
  isValidId,
  validateBody(schemas.addSchema),
  ctrl.updateContacts
);
router.patch(
  "/:id/favorite",
  authenticate,
  isValidId,
  validateBody(schemas.updateSchema),
  ctrl.updateStatusContact
);

module.exports = router;
