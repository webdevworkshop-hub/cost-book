// models/Product.ts
import { model, models, Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    productGroupId: {
      type: Schema.Types.ObjectId,
      ref: "ProductGroup",
      required: true,
    },

    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true },
);

export default models.Product || model("Product", ProductSchema);
