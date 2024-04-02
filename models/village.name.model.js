
import mongoose from "mongoose";

// Define the schema
const villageSchema = new mongoose.Schema({
  w_no: {
    type: Number,
   
  },
  name: {
    type: String,
    
  }
});

// Create the model
const villageModel = mongoose.model('villageByWards', villageSchema);

export default villageModel;
