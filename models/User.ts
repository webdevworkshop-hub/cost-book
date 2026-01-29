// models/User.ts

import { model, models, Schema } from "mongoose";


const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
});

export default models.User || model("User", UserSchema);
