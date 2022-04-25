const { Router } = require("express");
const server = require("../app");
const router = Router();

const {
  createOperation,
  captureOrder,
  getOperations,
  editOperation,
} = require("../controllers/operations");

// router.get("/:id", getOperations);
// router.put("/", editOperation);
router.post("/create-order", createOperation);
router.get("/capture-order", captureOrder);

module.exports = router;
