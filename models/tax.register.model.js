import mongoose from "mongoose";

const taxSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    union: {
      type: String,
      default: "১৪নং দৌলখাঁড় ইউনিয়ন পরিষদ",
    },
    holding: {
      type: Number,
      required: true,
    },
    fatherName: {
      type: String,
      required: true,
    },

    villageName: {
      type: String,
      required: true,
    },
    cor: {
      type: Number,
    },
    total: {
      type: Number,
    },
    discount:{
      type: Number,

    },
    year: [String],

    houseName: {
      type: String,
    },

    qr: {
      type: String,
    },

    mobile: {
      type: Number,
      require: true
    },
    sn: {
      type: Number,
    },
    due: {
      type: Number,
    },
    ward: {
      type: Number,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TaxModel = mongoose.model("tax-pay", taxSchema);

export default TaxModel;
