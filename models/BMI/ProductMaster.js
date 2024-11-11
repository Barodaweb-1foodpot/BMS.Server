const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const UsersSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
        },
        productCode: {
            type: String,
        },
        CASNo: {
            type: String,
        },
        specialsStorageCondition: {
            type: String,
        },
        
        IsActive: {
            default:true,
            type: Boolean,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ProductMaster", UsersSchema);
