const CompanyMaster = require("../../models/BMI/CompanyMaster");
const fs = require("fs");

exports.getCompanyMaster = async (req, res) => {
  try {
    const find = await CompanyMaster.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.createCompanyMaster = async (req, res) => {
  try {

   

      let { companyDetail, companyName, email,password,mobile,address,manufacturingLicNo, IsActive } = req.body;  
    const emailExists = await CompanyMaster.findOne({
      email: req.body.email,
    }).exec();

    if (emailExists) {
      return res.status(200).json({
        isOk: false,
        message: "Email already exists",
      });
    } else {
      const add = await new CompanyMaster({
        companyDetail, companyName, email,password,mobile,address,manufacturingLicNo, IsActive
      }).save();
      res.status(200).json({ isOk: true, data: add, message: "Company Created Successfully" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.listCompanyMaster = async (req, res) => {
  try {
    const list = await CompanyMaster.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listCompanyMasterByParams = async (req, res) => {
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
                companyName: { $regex: match, $options: "i" },
              },
              {
                mobile: { $regex: match, $options: "i" },
              },
              {
                email: { $regex: match, $options: "i" },
              },
              {
                manufacturingLicNo: { $regex: match, $options: "i" },
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

    const list = await CompanyMaster.aggregate(query);

    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.updateCompanyMaster = async (req, res) => {
  try {
    
    let fieldvalues = { ...req.body };
    
    const update = await CompanyMaster.findOneAndUpdate(
      { _id: req.params._id },
      fieldvalues,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeCompanyMaster = async (req, res) => {
  try {
    const del = await CompanyMaster.findOneAndRemove({
      _id: req.params._id,
    });
    res.json(del);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.CompanyMasterLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const CompanyMastermp = await CompanyMaster.findOne({ email: email }).exec();
    if (CompanyMastermp) {
      if (CompanyMastermp.password !== password) {
        return res.status(200).json({
          isOk: false,
          filed: 1,
          message: "Authentication Failed",
        });
      } else {
        res.status(200).json({
          isOk: true,
          message: "Authentication Successfull",
          data: CompanyMastermp,
        });
      }
    } else {
      res.status(200).json({
        isOk: false,
        message: " CompanyMaster not Found",
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
