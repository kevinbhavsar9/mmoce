import asyncHandler from "express-async-handler";
// import { resetWatchers } from "nodemon/lib/monitor/watch";
import Product from "../models/productModel.js";

//@desc    Fetch all products
//@route   GET /api/products
//@access  Public
const getProducts = asyncHandler(async (req, res) => {
  //pagination code
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;
  //pagination code end

  //search functionlaity
  const keyword = req.query.keyword
    ? {
        // to get required product for similar keyword(search)
        name: {
          //used regular expression
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};
  // console.log(keyword);

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  // throw new Error("Some error");
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
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

//@desc    Create new Review
//@route   PUT /api/products/:id/reviews
//@access  Private
const createProductReview = asyncHandler(async (req, res) => {
  // console.log(req.body);
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    // console.log(alreadyReviewed);

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review Added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//@desc    Get top rated products
//@route   PUT /api/products/top
//@access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const count = 3;
  const products = await Product.find({}).sort({ rating: -1 }).limit(count);
  res.json(products);
});

export {
  createProductReview,
  getProductById,
  getProducts,
  deleteProduct,
  updateProduct,
  createProduct,
  getTopProducts,
};
