// models/ProductGroup.ts
import { model, models, Schema } from "mongoose";

const ProductGroupSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: String,
    numberOfProducts: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default models.ProductGroup || model("ProductGroup", ProductGroupSchema);
