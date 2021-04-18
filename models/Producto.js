const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ProductoSchema = new Schema({
  name: String,
  description: String,
  code: String,
  price: String,
  type: String,
  pic: String,
});

const Producto = mongoose.model('Producto', ProductoSchema);
module.exports = Producto;