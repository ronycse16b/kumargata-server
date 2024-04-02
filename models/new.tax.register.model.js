import mongoose from "mongoose";

const registerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    sn:{
        type: Number,
    },
   
    holding: {
      type: Number,
      required: true,
    },
    ward: {
      type: Number,
      required: true,
    },
   
    villageName: {
      type: String,
      required: true,
    },
    due:{
        type: Number,
        default: 0,
    },
    cor: {
      type: Number,
    },
    checkbox: [{
        year: String,
        total: String
      }],
  },
  {
    timestamps: true,
  }
);

const NewTaxModel = mongoose.model("tax-register-data", registerSchema);

export default NewTaxModel;
