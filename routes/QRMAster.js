const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createQRMaster,
  listQRMaster,
  listQRMasterByParams,
  getQRMaster,
  updateQRMaster,
  removeQRMaster,
  userLoginAdmin,
  downloadPDF,
  deleteFile
} = require("../controllers/BMI/QRMaster");
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
router.post("/auth/create/QRMaster", catchAsync(createQRMaster));

router.get("/auth/list/QRMaster", catchAsync(listQRMaster));

router.post("/auth/listByparams/QRMaster", catchAsync(listQRMasterByParams));

router.get("/auth/get/QRMaster/:_id", catchAsync(getQRMaster));

router.put("/auth/update/QRMaster/:_id", catchAsync(updateQRMaster));

router.delete("/auth/remove/QRMaster/:_id", catchAsync(removeQRMaster));

router.post('/auth/downloadfile',catchAsync(downloadPDF))


router.post('/auth/delete-file', catchAsync(deleteFile));

module.exports = router;
