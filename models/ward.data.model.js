import mongoose from "mongoose";

const wardDataSchema = new mongoose.Schema(
  {
    sn: {
      type: Number,
    },
    union: {
      type: String,
      default: "৪নং কুমарগাতা ইউনিয়ন পরিষদ"
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
      type: Number,
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
    qrCode: {
      type: String,
    },
    potibondhi: {
      type: String,
    },
    gov_vata: {
      type: String,
    },
    ward: {
      type: Number
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

// Pre-save hook to automatically set serial number and holding
wardDataSchema.pre('save', async function (next) {
  if (!this.sn) {
    // Find the document with the highest serial number for the current ward
    const latestSNDoc = await this.constructor.findOne({ ward: this.ward }, {}, { sort: { sn: -1 } });

    // If there are no documents for the current ward, start from 0
    const latestSN = latestSNDoc ? latestSNDoc.sn : 0;

    // Increment the serial number based on the ward
    this.sn = latestSN + 1;
  }

  if (!this.holding) {
    // Find the document with the highest holding number within the same ward
    const latestHoldingDoc = await this.constructor.findOne({ ward: this.ward }, {}, { sort: { holding: -1 } });

    // If there are no documents for the current ward, start from 0
    const latestHolding = latestHoldingDoc ? latestHoldingDoc.holding : 0;

    // Increment the holding number based on the ward
    this.holding = latestHolding + 1;
  }

  next();
});

const WardDataModel = mongoose.model("assesments-data", wardDataSchema);
export default WardDataModel;
