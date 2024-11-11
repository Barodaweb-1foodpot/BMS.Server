const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const UsersSchema = new mongoose.Schema(
    {
        productName: {
            type: Schema.Types.ObjectId,
            ref: "ProductMaster",
        },
        brandName: {
            type: String,
        },
        nameOfAPI: {
            type: String,
        },
        batchNo: {
            type: String,
        },
        batchSize: {
            type: String,
        },
        DOM: {
            type: String,
        },
        DOE: {
            type: String,
        },
        containerCode: {
            type: String,
        },
        GW: {
            type: String,
        },
        TW: {
            type: String,
        },
        NW: {
            type: String,
        },
        licenceNo:{
            type: String,
        },
        
        IsActive: {
            default:true,
            type: Boolean,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("QRMaster", UsersSchema);
