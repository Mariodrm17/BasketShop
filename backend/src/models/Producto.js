const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  imagen: String,
  categoria: { type: String, enum: ['Zapatillas', 'Ropa', 'Accesorios', 'Balones', 'Otros'], default: 'Otros' },
  activo: { type: Boolean, default: true }
});

module.exports = mongoose.model('Producto', productoSchema);
