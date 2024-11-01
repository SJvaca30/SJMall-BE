const Product = require("../models/Product");

const PAGE_SIZE = 5;
const productController = {};

productController.createProduct = async (req, res) => {
  try {
    const { sku, name, image, category, description, price, stock } = req.body;

    const product = new Product({
      sku: sku,
      name: name,
      image: image,
      category: category,
      description: description,
      price: price,
      stock: stock,
    });

    await product.save();

    res.status(200).json({
      status: "ok",
      product,
    });
  } catch (err) {
    // duplicate key 에러 처리
    if (err.code === 11000) {
      return res.status(400).json({
        status: "fail",
        message: "Sku number already exists",
      });
    }

    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

productController.getProducts = async (req, res) => {
  try {
    const { page, name } = req.query;
    const cond = name ? { name: { $regex: name, $options: "i" } } : {};
    let response = { status: "ok" };

    let query = Product.find(cond);
    console.log(page);
    if (page) {
      query = query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);

      const total = await Product.find(cond).countDocuments();
      const totalPages = Math.ceil(total / PAGE_SIZE);

      response.totalPageNum = totalPages;
    }

    const products = await query.exec();

    response.products = products;

    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

productController.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      sku,
      name,
      size,
      image,
      price,
      description,
      category,
      stock,
      status,
    } = req.body;
    const product = await Product.findByIdAndUpdate(
      { _id: productId },
      {
        sku,
        name,
        size,
        image,
        price,
        description,
        category,
        stock,
        status,
      },
      { new: true }
    );
    if (!product) throw new Error("item does not exist");
    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

module.exports = productController;
