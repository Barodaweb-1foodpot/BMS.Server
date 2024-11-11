const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const UsersSchema = new mongoose.Schema(
    {
        companyDetail: {
            type: String,
        },
        companyName: {
            type: String,
        },
        email: {
            type: String,
        },
        password: {
            type: String,
        },
        mobile: {
            type: String,
        },
        address: {
            type: String,
        },
        manufacturingLicNo: {
            type: String,
        },
        IsActive: {
            default:true,
            type: Boolean,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("CompanyMaster", UsersSchema);
