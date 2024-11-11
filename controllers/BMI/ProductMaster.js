const ProductMaster = require("../../models/BMI/ProductMaster");
const fs = require("fs");

exports.getProductMaster = async (req, res) => {
  try {
    const find = await ProductMaster.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.createProductMaster = async (req, res) => {
  try {

    let {  productName, productCode, CASNo,specialsStorageCondition,IsActive} = req.body;  
   
    const productCodeexist = await ProductMaster.findOne({
      productCode: req.body.productCode,
    }).exec();

    if (productCodeexist) {
      return res.status(200).json({
        isOk: false,
        message: "Product Code already exists",
      });
    } 

    const add = await new ProductMaster({
        productName, productCode, CASNo,specialsStorageCondition,IsActive
      }).save();
      res.status(200).json({ isOk: true, data: add, message: "Company Created Successfully" });
    
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.listProductMaster = async (req, res) => {
  try {
    const list = await ProductMaster.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listProductMasterByParams = async (req, res) => {
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
                productName: { $regex: match, $options: "i" },
              },
              {
                productCode: { $regex: match, $options: "i" },
              },
              {
                CASNo: { $regex: match, $options: "i" },
              },
              {
                specialsStorageCondition: { $regex: match, $options: "i" },
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

    const list = await ProductMaster.aggregate(query);

    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.updateProductMaster = async (req, res) => {
  try {
    let fieldvalues = { ...req.body };
    
    const update = await ProductMaster.findOneAndUpdate(
      { _id: req.params._id },
      fieldvalues,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeProductMaster = async (req, res) => {
  try {
    const del = await ProductMaster.findOneAndRemove({
      _id: req.params._id,
    });
    res.json(del);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.ProductMasterLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const ProductMastermp = await ProductMaster.findOne({ email: email }).exec();
    if (ProductMastermp) {
      if (ProductMastermp.password !== password) {
        return res.status(200).json({
          isOk: false,
          filed: 1,
          message: "Authentication Failed",
        });
      } else {
        res.status(200).json({
          isOk: true,
          message: "Authentication Successfull",
          data: ProductMastermp,
        });
      }
    } else {
      res.status(200).json({
        isOk: false,
        message: " ProductMaster not Found",
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
