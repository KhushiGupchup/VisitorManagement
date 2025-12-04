const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { addVisitor } = require("../controllers/visitorController");

router.post("/add", upload.single("photo"), addVisitor);

module.exports = router;
