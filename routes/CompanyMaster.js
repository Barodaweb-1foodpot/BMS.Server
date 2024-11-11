const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createCompanyMaster,
  listCompanyMaster,
  listCompanyMasterByParams,
  getCompanyMaster,
  updateCompanyMaster,
  removeCompanyMaster,
  CompanyMasterLogin,
} = require("../controllers/BMI/CompanyMaster");
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
router.post("/auth/create/CompanyMaster", catchAsync(createCompanyMaster));

router.get("/auth/list/CompanyMaster", catchAsync(listCompanyMaster));

router.post("/auth/listByparams/CompanyMaster", catchAsync(listCompanyMasterByParams));

router.get("/auth/get/CompanyMaster/:_id", catchAsync(getCompanyMaster));

router.put("/auth/update/CompanyMaster/:_id", catchAsync(updateCompanyMaster));

router.delete("/auth/remove/CompanyMaster/:_id", catchAsync(removeCompanyMaster));

router.post("/companyLogin", catchAsync(CompanyMasterLogin));

module.exports = router;
