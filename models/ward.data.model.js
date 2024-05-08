import mongoose from "mongoose";

const wardDataSchema = new mongoose.Schema(
  {
    sn: {
      type: Number,
    },
    union: {
      type: String,
      default: "১৪নং দৌলখাঁড় ইউনিয়ন পরিষদ"
    },
    cor: {
      type: Number,
    },
    motherName: {
      type: String,
     
    },
    dateOfBirth: {
      type: Date,
     
    },
    marriedStatus: {
      type: String,
     
    },
    nid: {
      type: Number,
      
    },
    fatherName: {
      type: String,
    },
    holding: {
      type: String,
    },
    house: {
      type: String,
    },
    houseName: {
      type: String,
    },
    male: {
      type: Number,
    },
    female: {
      type: Number,
    },
    mobile: {
      type: Number,
    },
    due: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
    },
    profession: {
      type: String,
    },
    villageName: {
      type: String,
    },
    qrCode:{
        type:String,
    },
    potibondhi:{
        type:String,
    },
    gov_vata:{
        type:String,
    },
    ward: {
         type:Number
    },
    yearMullayon: {
      type: Number,
    },
    checkbox: [{
      year: String,
      total: String,
      discount: String
    }],
    user: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true
  }
);

// Pre-save hook to automatically set serial number
wardDataSchema.pre('save', async function(next) {
  if (!this.sn) {
    // Find the document with the highest serial number for the current ward
    const latestDoc = await this.constructor.findOne({ ward: this.ward }, {}, { sort: { sn: -1 } });
    
    // If there are no documents for the current ward, start from 0
    const latestSN = latestDoc ? latestDoc.sn : 0;

    // Increment the serial number based on the ward
    if (this.ward === 1) {
      this.sn = latestSN + 1;
    } else if (this.ward === 2) {
      // Check if the current document is a correction (black start)
      if (this.cor) {
        // If it's a correction, set the serial number to 1 for the second ward
        this.sn = 1;
      } else {
        // If it's not a correction, increment the serial number for the second ward
        this.sn = latestSN + 1;
      }
    } else {
      // Handle other wards if needed
    }
  }
  next();
});

const WardDataModel = mongoose.model("assesments-data", wardDataSchema);
export default WardDataModel;
