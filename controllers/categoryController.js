import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

// Create Cateogy
export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    // Validation
    if (!name) {
      return res.status(401).send({
        message: "Name is required",
      });
    }
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "Category Already Exisits",
      });
    }
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "New Category Created",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Create Category",
      error,
    });
  }
};

// Update Cateogry
export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    // Validate input
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide a name" });
    }
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide an ID" });
    }

    // Check if a category with the same slug already exists
    const existingCategory = await categoryModel.findOne({
      slug: slugify(name),
    });
    if (existingCategory && existingCategory._id.toString() !== id) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists",
      });
    }

    // Update category
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true, runValidators: true }
    );

    // Handle case where category is not found
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error(error);

    // Handle Mongoose CastError for invalid ID format
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category ID format" });
    }

    return res.status(500).json({
      success: false,
      message: "Error updating category",
      error: error.message,
    });
  }
};

// Get All Category
export const getAllCategoryController = async (req, res) => {
  try {
    const categories = await categoryModel.find({})
     res.status(200).json({
      success: true,
      message: "All Categories List",
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      success: false,
      message: "Error while getting all categories",
      error: error.message,
    });
  }
};

// Single Category
export const singleCategoryController = async (req, res) => {
  try {
    const { slug } = req.params;

    // Validate slug
    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Slug parameter is required",
      });
    }

    // Find category by slug
    const category = await categoryModel.findOne({ slug });

    // If category does not exist
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving category",
      error: error.message,
    });
  }
};

// delete Category
export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    // Find and delete the category
    const deletedCategory = await categoryModel.findByIdAndDelete(id);

    // Handle case where category does not exist
    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({
      success: false,
      message: "Error while deleting category",
      error: error.message,
    });
  }
};
