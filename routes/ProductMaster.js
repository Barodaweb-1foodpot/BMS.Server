const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createProductMaster,
  listProductMaster,
  listProductMasterByParams,
  getProductMaster,
  updateProductMaster,
  removeProductMaster,
  userLoginAdmin,
} = require("../controllers/BMI/ProductMaster");
const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/userImages");
  },
  filename: (req, file, cb) => {
    // const ext = file.mimetype.split("/")[1];
    // cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: multerStorage });
router.post("/auth/create/ProductMaster", catchAsync(createProductMaster));

router.get("/auth/list/ProductMaster", catchAsync(listProductMaster));

router.post("/auth/listByparams/ProductMaster", catchAsync(listProductMasterByParams));

router.get("/auth/get/ProductMaster/:_id", catchAsync(getProductMaster));

router.put("/auth/update/ProductMaster/:_id", catchAsync(updateProductMaster));

router.delete("/auth/remove/ProductMaster/:_id", catchAsync(removeProductMaster));


module.exports = router;
