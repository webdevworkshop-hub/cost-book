// models/Product.ts
import { model, models, Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: String,
    description: String,
    price: Number,
  },
  { timestamps: true } 
);

export default models.Product || model("Product", ProductSchema);
