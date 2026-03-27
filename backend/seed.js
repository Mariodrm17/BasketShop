const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
// Fix: Adjust path if running from root or backend folder
const User = require("./src/models/User"); 
const Producto = require("./src/models/Producto");

dotenv.config();

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/productos";

console.log("Conectando a MongoDB para el seed:", mongoUri);

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB conectado para seed'))
  .catch(err => {
      console.error('Error conectando a MongoDB:', err);
      process.exit(1);
  });

async function seed() {
  try {
    // Check if users already exist
    const count = await User.countDocuments();
    if (count > 0) {
      console.log("La base de datos ya tiene usuarios. Saltando seed.");
      process.exit(0);
    }

    console.log("Limpiando usuarios antiguos (si los hay)...");
    await User.deleteMany({});
    
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    await User.create([
      { username: "admin", password: adminPassword, role: "admin" },
      { username: "user", password: userPassword, role: "user" },
    ]);
    console.log("Usuarios iniciales creados exitosamente");

    // Seed productos de baloncesto
    const productCount = await Producto.countDocuments();
    if (productCount === 0) {
      const productosBasket = [
        { nombre: "Air Jordan 1 High S", precio: 180, categoria: "Zapatillas", activo: true, imagen: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/0cdba3bf-32c0-4f51-a905-23c2175960c1/zapatillas-air-jordan-1-retro-high-og-X2kGdx.png" },
        { nombre: "LeBron 21 V2", precio: 200, categoria: "Zapatillas", activo: true, imagen: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/1cd00bb6-46b7-4a4b-9e32-a5e22fc399e5/zapatillas-de-baloncesto-lebron-xxi-dragon-pearl-40q5f1.png" },
        { nombre: "Camiseta LA Lakers Lebron", precio: 95, categoria: "Ropa", activo: true, imagen: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/4561848a-6415-46eb-8e50-252fc4e6ae22/camiseta-nba-swingman-los-angeles-lakers-icon-edition-2022-23-4c9fcl.png" },
        { nombre: "Camiseta Bulls Jordan", precio: 120, categoria: "Ropa", activo: true, imagen: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e9fdc5f0-6c92-4217-bf41-7667a42ec397/air-jordan-camiseta-nba-swingman-chicago-bulls-statement-edition-pWn95s.png" },
        { nombre: "Pantalón Corto Elite", precio: 45, categoria: "Ropa", activo: true, imagen: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/32338ff9-03f4-4a49-af02-f85530df30b0/pantalones-cortos-de-baloncesto-de-20-cm-asg-pnlQ4q.png" },
        { nombre: "Balón Spalding TF-1000", precio: 75, categoria: "Balones", activo: true, imagen: "https://img.ltwebstatic.com/images3_pi/2023/10/09/cc/1696847847aa3b0b5550a2976721590fcbead004dd_thumbnail_720x.jpg" },
        { nombre: "Muñequera Jordan Jumpman", precio: 15, categoria: "Accesorios", activo: true, imagen: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/bb6b2e3e-ae6a-493e-afec-6bd5b6e6cf1e/jordan-jumpman-munequeras-k8fPpx.png" },
        { nombre: "Mochila Hoops Elite", precio: 85, categoria: "Accesorios", activo: true, imagen: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/c3f7614e-1b84-4861-add3-388aeb78fa3e/mochila-de-baloncesto-hoops-elite-32-l-q2qDPK.png" }
      ];
      await Producto.insertMany(productosBasket);
      console.log("Productos iniciales de Basket creados exitosamente");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error durante el seed:", error);
    process.exit(1);
  }
}

seed();