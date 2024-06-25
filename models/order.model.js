import mongoose from "mongoose";
// Define the counter schema
const counterSchema = new mongoose.Schema({
  _id: { type: String, },
  seq: { type: Number, default: 0 }
});

// Create the Counter model
const Counter = mongoose.model('Counter', counterSchema);

// Define the order schema
const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  address: {
    type: String,
   
  },
  deliveryCharge: {
    type: Number,
   
  },
  image: {
    type: String,
   
  },
  mobile: {
    type: String,
   
  },
  name: {
    type: String,
   
  },
  paymentMethod: {
    type: String,
   
  },
  price: {
    type: Number,
   
  },
  productName: {
    type: String,
   
  },
  note: {
    type: String,
  },
  sku: {
    type: String,
   
  },
  qty: {
    type: Number,
   
  },
  size: {
    type: String,
   
  },
  total: {
    type: Number,
   
  },
  status: {
    type: String,
    default: 'processing'
  }
}, {
  timestamps: true
});

// Pre-save hook to set order number
orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      // Find the counter document and increment the sequence number
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'orderCounter' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      // Generate the order number
      const serialNumber = counter.seq.toString().padStart(2, '0');
      this.orderNumber = `IL-${serialNumber}-${this.mobile}`;

      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Create the Order model
const Order = mongoose.model('Order', orderSchema);

// Export the models
export default Order
