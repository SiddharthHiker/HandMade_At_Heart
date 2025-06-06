import mongoose from 'mongoose';
import productModel from "../models/productModel.js";
import categoryModel from '../models/categoryModel.js';
import orderModel from '../models/orderModel.js';
import slugify from "slugify";
import fs from "fs";
import braintree from 'braintree';
import dotenv from "dotenv";


dotenv.config();

// Payment Gateway
   var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey:process.env.BRAINTREE_PRIVATE_KEY
});   




// Create Product
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // Validation
    if (!name)
      return res
        .status(400)
        .json({ success: false, error: "Name is required" });
    if (!description)
      return res
        .status(400)
        .json({ success: false, error: "Description is required" });
    if (!price)
      return res
        .status(400)
        .json({ success: false, error: "Price is required" });
    if (!category)
      return res
        .status(400)
        .json({ success: false, error: "Category is required" });
    if (!quantity)
      return res
        .status(400)
        .json({ success: false, error: "Quantity is required" });
    if (photo && photo.size > 1000000) {
      return res
        .status(400)
        .json({ success: false, error: "Photo must be less than 1MB" });
    }

    // Check if slug is unique
    const existingProduct = await productModel.findOne({ slug: slugify(name) });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        error: "Product with this name already exists",
      });
    }

    // Create Product
    const product = new productModel({ ...req.fields, slug: slugify(name) });

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get All Product
export const getAllProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({}, "-photo")
      .populate("category", "name") // Populate only necessary fields
      .limit(12)
      .sort({ createdAt: -1 })
      .exec(); // Explicit query execution

    if (!products.length) {
      return res.status(200).json({
        success: true,
        message: "No products found",
        products: [],
      });
    }

    res.status(200).json({
      success: true,
      totalCount: products.length,
      message: "Fetched all products successfully",
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// Single Product
export const singleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category")
      .exec(); // Explicit query execution

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Single product fetched successfully",
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching product details",
      error: error.message,
    });
  }
};

export const productPhotoController = async (req, res) => {
  try {
    const { pid } = req.params;

    if (!pid || pid === "undefined") {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    const product = await productModel.findById(pid).select("photo");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!product.photo?.data) {
      return res.status(404).json({
        success: false,
        message: "No photo available for this product",
      });
    }

    res.set("Content-Type", product.photo.contentType);
    return res.send(product.photo.data);
  } catch (error) {
    console.error("Error fetching product photo:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching product photo",
    });
  }
};

// Delete Product
export const deleteProductController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).exec();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await productModel.findByIdAndDelete(req.params.pid).exec();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error while deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Error while deleting product",
      error: error.message,
    });
  }
};

// Update Product
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // Validation
    if (!name)
      return res
        .status(400)
        .json({ success: false, error: "Name is required" });
    if (!description)
      return res
        .status(400)
        .json({ success: false, error: "Description is required" });
    if (!price)
      return res
        .status(400)
        .json({ success: false, error: "Price is required" });
    if (!category)
      return res
        .status(400)
        .json({ success: false, error: "Category is required" });
    if (!quantity)
      return res
        .status(400)
        .json({ success: false, error: "Quantity is required" });
    if (photo && photo.size > 1000000) {
      return res
        .status(400)
        .json({ success: false, error: "Photo must be less than 1MB" });
    }

    // Find existing product
    let product = await productModel.findById(req.params.pid).exec();
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    // Check if another product already has the same slug
    const existingProduct = await productModel
      .findOne({ slug: slugify(name), _id: { $ne: req.params.pid } })
      .exec();
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        error: "Product with this name already exists",
      });
    }

    // Update product details
    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.quantity = quantity;
    product.shipping = shipping;
    product.slug = slugify(name);

    // Update photo if provided
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Filter Product
export const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Filtering Product",
      error,
    });
  }
};

// product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};
// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

//Search Product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

// Similar Product
export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while getting related product",
      error,
    });
  }
};


// Get Product By Catgory 
export const productCategoryController = async(req,res) => {
  try {
    const category = await categoryModel.findOne({slug:req.params.slug})
    const products = await productModel.find({category}).populate('category');
    res.status(200).send({
      success:true,
      category,
      products
    });
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success:false,
      error,
      message:'Error While Getting Product'
    });
  }
};


// payment gateway api
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

// Payment
export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
