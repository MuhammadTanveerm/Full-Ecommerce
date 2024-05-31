const Product = require("../models/productmodel");
const ErrorHandler = require("../utils/errorHandler");

const catchAsyncError = require("../middleware/catchAsyncError");
const apifeactures = require("../utils/apifeacture")      
// Get All Proudcts
exports.createProduct =catchAsyncError( async (req, res, next) => {
  req.body.user = req.user.id;

  const product = await Product.create(req.body);
  res.status(200).json({
    message: "Product Created ",
    product,
  });
});

// Update Product

exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
  
    if (!product) {
      next(new ErrorHandler("Product Not Found lll HERE", 500));
    }
  
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      product,
    });
  });
// Delete Product
exports.deleteProduct = catchAsyncError( async (req, res, next) => {
  const productId = req.params.id;

  // Check if the product exists in the database
  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product Not Found lll HERE", 404));
  }

  // If the product exists, remove it from the database
  await Product.findByIdAndDelete(productId);

  return res
    .status(200)
    .json({ success: true, message: "Product removed successfully" });
});

// Get One Prodcut
exports.getOneProduct = catchAsyncError(async (req, res, next) => {
  const proid = req.params.id;
  const product = await Product.findById(proid);
  if (!product) {
    return next(new ErrorHandler("phh no Product  not found", 404));
    // res.json({
    //     success:false,
    //     message:"product no found"
    // })
  }
  res.status(200).json({
    message: "single item is here",
    product,
  });
});
// Get All Products
exports.getAllProducts =catchAsyncError( async (req, res, next) => {
  const resultPage  = 5;
  const productCount = await Product.countDocuments();
  const apifeacture = new apifeactures(Product.find({}),req.query ).search().filter().pagination(resultPage)
  const all = await apifeacture.query
  await res.json({
    message: "All Avaliable products",
    all,
    productCount
  });
});
