import mongoose from 'mongoose';

const wardSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  label: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
});

const WardModel = mongoose.model('Ward', wardSchema);

export default WardModel;
