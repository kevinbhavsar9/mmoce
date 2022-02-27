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

//@desc   Create product by admin
//@route   POST /api/products
//@access  Private/admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample Name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample Brand",
    category: "Sample Category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });

  const createProduct = await product.save();
  res.status(201).json(createProduct);
});

//@desc    Update product by admin
//@route   PUT /api/products/:id
//@access  Private/admin
const updateProduct = asyncHandler(async (req, res) => {
  // console.log(req.body);
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    //save is used when something is updated
    const updatedProduct = await product.save();

    res.json({
      updatedProduct,
    });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export {
  getProductById,
  getProducts,
  deleteProduct,
  updateProduct,
  createProduct,
};
