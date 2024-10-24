const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = Schema(
  {
    sku: { type: String, required: true, unique: true }, // sku란 상품 고유 식별자, 즉 상품 코드
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: Array, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    stock: { type: Number, required: true },
    status: { type: String, default: "active" }, // status란 상품 판매 상태, 2types: active, inactive
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
productSchema.methods.generateToken = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.createdAt;
  delete obj.updatedAt;
  return obj;
};

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
