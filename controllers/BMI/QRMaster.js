const QRMaster = require("../../models/BMI/QRMaster");
const fs = require("fs");
const path = require('path')
const sharp = require('sharp'); 
// const ejs = require('ejs');
const handlebars = require('handlebars');
// require('web-streams-polyfill');
const puppeteer = require('puppeteer');
const QRCode = require('qrcode');

exports.getQRMaster = async (req, res) => {
  try {
    const find = await QRMaster.findOne({ _id: req.params._id }).populate("productName").exec();
    res.json({isOk:true, find});
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.createQRMaster = async (req, res) => {
  try {

    let {productName,
        brandName,
        nameOfAPI,
        batchNo,
        batchSize,
        DOM,
        DOE,
        containerCode,
        GW,
        TW,
        NW,
        IsActive,
        licenceNo,
      } =  req.body
  

    const add = await new QRMaster({
        productName,
        brandName,
        nameOfAPI,
        batchNo,
        batchSize,
        DOM,
        DOE,
        containerCode,
        GW,
        TW,
        NW,
        licenceNo,
        IsActive
      }).save();
      res.status(200).json({ isOk: true, data: add, message: "QR Data Created Successfully" });
    
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.listQRMaster = async (req, res) => {
  try {
    const list = await QRMaster.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listQRMasterByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

    let query = [
      {
        $match: { IsActive: IsActive },
      },

      {
        $facet: {
          stage1: [
            {
              $group: {
                _id: null,
                count: {
                  $sum: 1,
                },
              },
            },
          ],
          stage2: [
            {
              $skip: skip,
            },
            {
              $limit: per_page,
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$stage1",
        },
      },
      {
        $project: {
          count: "$stage1.count",
          data: "$stage2",
        },
      },
    ];
    if (match) {
      query = [
        {
          $match: {
            $or: [
              {
                nameOfAPI: { $regex: match, $options: "i" },
              },
              {
                batchNo: { $regex: match, $options: "i" },
              },
              {
                batchSize: { $regex: match, $options: "i" },
              },
              {
                containerCode: { $regex: match, $options: "i" },
              },
              {
                GW: { $regex: match, $options: "i" },
              },
              {
                TW: { $regex: match, $options: "i" },
              },
              {
                NW: { $regex: match, $options: "i" },
              },
            ],
          },
        },
      ].concat(query);
    }

    if (sorton && sortdir) {
      let sort = {};
      sort[sorton] = sortdir == "desc" ? -1 : 1;
      query = [
        {
          $sort: sort,
        },
      ].concat(query);
    } else {
      let sort = {};
      sort["createdAt"] = -1;
      query = [
        {
          $sort: sort,
        },
      ].concat(query);
    }

    const list = await QRMaster.aggregate(query);

    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.updateQRMaster = async (req, res) => {
  try {
    let fieldvalues = { ...req.body };
    
    const update = await QRMaster.findOneAndUpdate(
      { _id: req.params._id },
      fieldvalues,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeQRMaster = async (req, res) => {
  try {
    const del = await QRMaster.findOneAndRemove({
      _id: req.params._id,
    });
    res.json(del);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.QRMasterLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const QRMastermp = await QRMaster.findOne({ email: email }).exec();
    if (QRMastermp) {
      if (QRMastermp.password !== password) {
        return res.status(200).json({
          isOk: false,
          filed: 1,
          message: "Authentication Failed",
        });
      } else {
        res.status(200).json({
          isOk: true,
          message: "Authentication Successfull",
          data: QRMastermp,
        });
      }
    } else {
      res.status(200).json({
        isOk: false,
        message: " QRMaster not Found",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(200).json({
      isOk: false,
      message: "An error occurred while logging in panel",
    });
  }
};



exports.downloadPDF = async (req, res, next) => {
  try {
    const {qrId} = req.body;  
    const products = await QRMaster.find({_id:qrId})
      .populate('productName')

      if (!products.length) { 
      return res.status(200).json({ message: 'No products found in the given price range.', products: products, isOk: false });
    }

    // Prepare image URLs
    const logoUrl = `${process.env.REACT_APP_API_URL}/uploads/BMI/logo-new.png`;
    console.log(logoUrl)

    const qrUploadDir = path.join(__basedir, 'uploads/BMI');
    if (!fs.existsSync(qrUploadDir)) {
      fs.mkdirSync(qrUploadDir, { recursive: true });
    }
    const qrCodeFilename = `qr-${qrId}.png`;
    const qrCodeFilePath = path.join(qrUploadDir, qrCodeFilename);
    const qrUrl = `${process.env.REACT_APP_API_URL_BMS}/ProductQR/${qrId}`;
    await QRCode.toFile(qrCodeFilePath, qrUrl, { width: 200 });



    // Read and compile the HTML template
    const templateHtml = fs.readFileSync(path.join(__dirname, 'ViewTemplate.html'), 'utf8');
    const template = handlebars.compile(templateHtml, {
      strict: true,
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true
    });
    console.log(products[0].productName)

    const data ={
      productName:products[0].productName.productName,
      licenceNo:products[0].licenceNo,
      GW:products[0].GW,
      containerCode:products[0].containerCode,
      TW:products[0].TW,
      NW:products[0].NW,
      DOM:products[0].DOM,
      DOE:products[0].DOE,
      batchNo:products[0].batchNo,
      specialsStorageCondition:products[0].productName.specialsStorageCondition,
    }

    console.log(data)
    
    const html = template({
      logoUrl,
      
      qrUrl:`${process.env.REACT_APP_API_URL}/uploads/BMI/${qrCodeFilename}`,
      products: data// Use updated product objects with full URLs
    });
    // console.log(html)

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
      timeout: 60000 // Increase timeout to 60 seconds
    });

    const page = await browser.newPage();

    // Set content to the HTML template
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 60000 });
    await page.emulateMediaType('screen');

    // Define the upload directory and filename
    const uploadDir = `${__basedir}/uploads/BMI`// Adjust __dirname if necessary
    const filename = `sticker-${Date.now()}.pdf`; // e.g., catalogue-2024-09-28.pdf
    const filePath = path.join(uploadDir, filename);

    // Ensure the directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory if it doesn't exist
    }

    // Generate PDF and save it to the specified path
    await page.pdf({
      format: 'A4',
      path: filePath, // Save to the specified path
      printBackground: true,
     
      
    });


    console.log(`PDF saved successfully to: ${filename}`);

    await browser.close();

    res.status(200).json({ filename, isOk: true , qrCodeFilename });
    // return
  }
  catch (err) {
    console.error('Error generating PDF:', err);
    next(err);
  }
};



exports.deleteFile = async (req, res) => {
  const { fileName } = req.body; // assuming the file name is passed in the request body

  // Define the file path
  const uploadDir = `${__basedir}/uploads/BMI`
  console.log(uploadDir)
  console.log(fileName)
  const filePath = path.join(uploadDir, fileName);
  console.log(filePath)

  try {
    // Attempt to delete the file asynchronously
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error removing file: ${err}`);
        return;
      }

      console.log(`File ${filePath} has been successfully removed.`);
    });
    // Send success response
    res.status(200).json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    // Handle errors, like if the file doesn't exist
    res.status(500).json({
      success: false,
      message: 'Error deleting file',
      error: error.message,
    });
  }
};