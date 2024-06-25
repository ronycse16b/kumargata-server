import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true }, // Changed to sku and added unique constraint
    sku: { type: String, required: true, unique: true }, // Changed to sku and added unique constraint
    brand: { type: String,
      default:'Iconic Leather'
     },
    description: { type: String, required: true },
    salePrice: { type: Number, required: true },
    discount: { type: Number, required: true },
    qty: { type: Number, required: true },
    size: [{ type: String }],
    colors: [{ type: String }],
    tag: { type: String },
    slug: { type: String, unique: true }, // Ensuring slug is unique
    images: [{ type: String }],
    visibility: {
      type: String,
      enum: ["published", "hidden"],
    },
    video: {
      type: String,
    },
   
    category: { type: String,
      default:"Leather Shoe"
     },
    features: { type: String },
  },
  { timestamps: true }
);

// Pre-save middleware to generate unique slug from skuproductSchema.pre('save', async function (next) {
  productSchema.pre('save', async function (next) {
    if (this.isModified('productName') || this.isModified('sku')) {
      let baseSlug = slugify(`${this.productName}-${this.sku}`, { lower: true });
      let slug = baseSlug;
      let num = 1;
      while (true) {
        const productWithSlug = await this.constructor.findOne({ slug });
        if (!productWithSlug || productWithSlug._id.equals(this._id)) {
          break;
        }
        slug = `${baseSlug}-${num}`;
        num++;
      }
      this.slug = slug;
    }
    next();
  });


const Product = mongoose.model("Product", productSchema);

export default Product;
