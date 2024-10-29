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
    stock: { type: Object, required: true },
    status: { type: String, default: "active" }, // status란 상품 판매 상태, 2types: active, inactive
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
productSchema.methods.toJSON = function () {
  const obj = this._doc; // _doc은 현재 mongoose 문서에서 모든 데이터를 담고있는 객체를 가리킴
  delete obj.__v;
  delete obj.updatedAt;
  delete obj.createdAt;
  return obj; // 위 불필요한조건들을 모두 제거하면 프론트엔드로 넘어가지않고 object를 리턴함
};

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
