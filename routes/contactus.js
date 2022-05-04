/** @format */

const express = require("express");
const router = express.Router();

const contactusController = require("../controllers/contactusController");

router.get("/", contactusController.getAllMessages);
router.get("/:id", contactusController.getSingleMessage);
router.post("/", contactusController.addMessage);

module.exports = router;
