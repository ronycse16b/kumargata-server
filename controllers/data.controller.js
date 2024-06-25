import asyncHandler from "express-async-handler";
import Product from "../models/product.model.js";
import uploadImage from "../utils/uploadImage.js";
import deleteImage from "../utils/deleteImage.js";
import Order from "../models/order.model.js";
import Banner from "../models/banner.model.js";

const addProduct = asyncHandler(async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new Error("No files uploaded");
    }

    const imageUrls = await Promise.all(
      req.files.map((file) => uploadImage(file))
    );
    const productData = {
      ...req.body,
      images: imageUrls,
      tags: req.body.tag ? req.body.tag.split(",") : [],
    };
    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;

    let product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // If new images are uploaded, delete the old images
    if (req.files && req.files.length > 0) {
      for (const url of product.images) {
        await deleteImage(url); // Delete old images
      }

      const imageUrls = await Promise.all(
        req.files.map((file) => uploadImage(file))
      );
      req.body.images = imageUrls;
    }

    req.body.tags = req.body.tag ? req.body.tag.split(",") : product.tags;

    // Updating the product with new data
    product = await Product.findByIdAndUpdate(productId, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const addBanner = asyncHandler(async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new Error("No files uploaded");
    }

    // Fetch existing banner images
    const existingBanner = await Banner.findOne({});
    if (existingBanner) {
      // Delete existing images from Firebase Storage
      await Promise.all(existingBanner.images.map(deleteImage));

      // Remove existing images from the database
      await Banner.deleteMany({});
    }

    // Upload new images
    const imageUrls = await Promise.all(
      req.files.map((file) => uploadImage(file))
    );

    // Save new images to the database
    const bannerImages = { images: imageUrls };
    const newImages = new Banner(bannerImages);
    await newImages.save();

    res.status(201).json(newImages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const getBanner = asyncHandler(async (req, res) => {
  try {
    const data = await Banner.find({});
    if (data) {
      res.json({
        images: data,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});
const getOrders = asyncHandler(async (req, res) => {
  try {
    const processingOrders = await Order.find({ status: "processing" }).sort({
      createdAt: -1,
    });
    const otherOrders = await Order.find({
      status: { $ne: "processing" },
    }).sort({ createdAt: -1 });
    const data = [...processingOrders, ...otherOrders];

    res.json({ orders: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getProducts = asyncHandler(async (req, res) => {
  try {
    const page = req.query.page || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 12; // Default limit to 10 if not provided
    const skip = (page - 1) * limit;

    const [products, totalProducts] = await Promise.all([
      Product.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(),
    ]);

    res.json({
      total: totalProducts,
      skip: skip,
      limit: limit,
      products: products,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const getSingleProduct = asyncHandler(async (req, res) => {
  try {
    const singleProduct = await Product.findOne({ slug: req.params.slug });
    if (singleProduct) {
      res.json({
        data: singleProduct,
      });
    } else {
      res.status(404).json({
        message: "Product not found",
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});
const SingleProductForUpdate = asyncHandler(async (req, res) => {
  try {
    const singleProduct = await Product.findById(req.params.id);
    if (singleProduct) {
      res.json({
        data: singleProduct,
      });
    } else {
      res.status(404).json({
        message: "Product not found",
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    // Delete images from Firebase Storage
    for (const url of product.images) {
      await deleteImage(url);
    }

    await product.remove();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

const confirmOrderMake = asyncHandler(async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    if (order) {
      res.json({
        data: order,
        message: "order has been submitted",
      });
    } else {
      res.status(404).json({
        message: "fail make order",
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const id = req.params.id;

  try {
    // Find the order by id
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status === "Completed" || status === "Confirm") {
      order.note = "";
      order.status = status;
      const updatedOrder = await order.save();
      return res.status(200).json(updatedOrder);
    }

    // Update the status and optionally the note
    order.status = status;
    if (note) {
      order.note = note; // Assuming 'notes' is an array field in your Order schema
    } // Save the updated order
    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.log("Error updating order status:", error.message);
    res.status(500).json({ message: "Error updating order status " });
  }
});

export {
  addProduct,
  getProducts,
  getSingleProduct,
  confirmOrderMake,
  addBanner,
  getBanner,
  deleteProduct,
  updateProduct,
  SingleProductForUpdate,
  getOrders,
  updateOrderStatus,
};
