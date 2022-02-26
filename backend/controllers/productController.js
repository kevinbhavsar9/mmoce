import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

//@desc    Fetch all products
//@route   GET /api/products
//@access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  // throw new Error("Some error");
  res.json(products);
});

//@desc    Fetch single products
//@route   GET /api/products/:id
//@access  Public

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not Found");
  }
});

//@desc    Delete Product
//@route   DELETE /api/products/:id
//@access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: "Product Removed" });
  } else {
    res.status(404);
    throw new Error("Product Not Found");
  }
  res.json(product);
});

//@desc    Update product by admin
//@route   PUT /api/products/:id
//@access  Private/admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;

    //save is used when something is updated
    const updatedProduct = await product.save();

    res.json({
      _id: updatedProduct._id,
      name: updatedProduct.name,
      price: updatedProduct.price,
      category: updatedProduct.category,
      brand: updatedProduct.brand,
    });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export { getProductById, getProducts, deleteProduct, updateProduct };
