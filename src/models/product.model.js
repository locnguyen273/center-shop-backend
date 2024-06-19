const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a product name"],
    unique: [true, "Product name already exists"],
    trim: true,
  },
  slug: String,
  category: {
    type: String,
    required: [true, "Please add a category name"],
    trim: true,
  },
  isActive: Boolean,
  details: {
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [10, "Product description can not be more than 10 characters"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
      trim: true,
      min: [0, "Price must be a positive number"],
    },
    discount: {
      type: Number,
      required: false,
      default: 0,
      trim: true,
    },
  },
  images: [
    { src: { type: String, required: true } },
    { src: { type: String, required: true } },
  ],
});

//Middleware - create slug from name
productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model("Product", productSchema);
