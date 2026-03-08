// =====================================================
// Proyecto 01 - MongoDB | Generador de Mock Data
// =====================================================

const { MongoClient } = require("mongodb");

require('dotenv').config({ path: '../../.env' });

const URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

// ── Configuración de cantidades ──────────────────────
const CONFIG = {
  restaurantes: 50,
  usuarios: 500,
  articulos: 600,      // ~12 por restaurante
  ordenes: 15000,      // bulk principal
  resenias: 4000,
};
// Total: ~20,150 documentos

// ── Helpers ──────────────────────────────────────────
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(2));
const randDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const pad = (n, len = 3) => String(n).padStart(len, "0");

// ── Datos base ────────────────────────────────────────
const TIPOS_COCINA = ["Italiana", "Mexicana", "Japonesa", "Americana", "Francesa", "China", "Peruana", "Española", "India", "Mediterránea", "Guatemalteca", "Tailandesa"];
const CATEGORIAS_ARTICULO = ["Entrada", "Plato Principal", "Postre", "Bebida", "Sopa", "Ensalada", "Sandwich", "Pizza", "Pasta", "Mariscos"];
const METODOS_PAGO = ["Tarjeta de crédito", "Tarjeta de débito", "Efectivo", "Transferencia", "PayPal"];
const ESTADOS_ORDEN = ["Pendiente", "En Ruta", "Entregado", "Cancelado"];
const ESTADO_PESOS = [0.1, 0.1, 0.7, 0.1]; // mayoría entregadas

const NOMBRES_RESTAURANTE = [
  "La Casa de la Pizza", "El Rincón Mexicano", "Sushi Zen", "Burger Palace",
  "Café de París", "Dragon Dorado", "El Ceviche de Oro", "La Paella de Madrid",
  "Spice Garden", "Mar Azul", "La Fogata", "Noodle House", "Green Bowl",
  "El Asador", "Pasta Fresca", "Taco Loco", "The Grill Room", "La Trattoria",
  "Sabores del Mundo", "El Bodegón", "Fuji Restaurant", "La Cantina",
  "Urban Kitchen", "El Patio", "Mariscos El Puerto", "Thai Orchid",
  "La Baguette", "Dim Sum Palace", "El Churrasquero", "Sakura Garden",
  "Mediterráneo", "Café Central", "La Fondita", "Wok & Roll", "El Mesón",
  "Pizzería Napoli", "Ramen House", "La Hacienda", "The Burger Joint", "Curry House",
  "El Gaucho", "Café Roma", "Pho Saigon", "La Terraza", "Fish & Chips Co.",
  "El Rancho", "Bistro 54", "Los Compadres", "Yakitori Bar", "La Posada"
];

const NOMBRES_PLATILLOS = [
  "Pizza Margherita", "Pizza Pepperoni", "Pizza 4 Quesos", "Pasta Carbonara",
  "Pasta Bolognesa", "Lasaña Clásica", "Risotto de Hongos", "Sushi Variado",
  "Ramen Tonkotsu", "Pad Thai", "Pollo al Curry", "Tacos de Pastor",
  "Burrito de Carne", "Enchiladas Verdes", "Nachos con Guacamole",
  "Hamburguesa Clásica", "Hamburguesa BBQ", "Hot Dog Especial", "Papas Fritas",
  "Ensalada César", "Ensalada Griega", "Sopa de Tomate", "Caldo de Pollo",
  "Ceviche de Camarón", "Ceviche Mixto", "Tiradito de Atún",
  "Paella Valenciana", "Paella de Mariscos", "Gazpacho Andaluz",
  "Pollo a la Plancha", "Filete de Res", "Costillas BBQ", "Salmon Grillado",
  "Camarones al Ajillo", "Pulpo a la Gallega",
  "Tiramisú", "Cheesecake de Fresa", "Brownie con Helado", "Churros con Chocolate",
  "Agua de Jamaica", "Limonada", "Jugo Natural", "Café Americano", "Cappuccino",
  "Té Verde", "Smoothie de Mango", "Horchata", "Cerveza Artesanal", "Refresco"
];

const PRIMEROS_NOMBRES = ["Juan", "María", "Carlos", "Ana", "Pedro", "Sofía", "Luis", "Laura", "Diego", "Valeria",
  "Andrés", "Camila", "Roberto", "Daniela", "Jorge", "Isabella", "Miguel", "Fernanda", "Alejandro", "Gabriela",
  "José", "Paula", "David", "Lucía", "Antonio", "Elena", "Francisco", "Sara", "Manuel", "Natalia"];
const APELLIDOS = ["García", "Martínez", "López", "González", "Rodríguez", "Pérez", "Sánchez", "Ramírez",
  "Torres", "Flores", "Rivera", "Morales", "Ortiz", "Jiménez", "Castro", "Vargas", "Reyes", "Mendoza",
  "Herrera", "Cruz", "Muñoz", "Álvarez", "Romero", "Díaz", "Guerrero", "Medina", "Ruiz", "Aguilar"];

const CIUDADES = ["Ciudad de Guatemala", "Mixco", "Villa Nueva", "San José Pinula", "Antigua Guatemala",
  "Quetzaltenango", "Escuintla", "Cobán", "Huehuetenango", "Jalapa"];

const CALLES = ["Av. Reforma", "Blvd. Los Próceres", "Calz. Roosevelt", "Av. Petapa", "Calle Mariscal",
  "Av. Las Américas", "Calle Real", "Av. Vista Hermosa", "Blvd. Liberación", "Av. Hincapié"];

const COMENTARIOS_POSITIVOS = [
  "Excelente comida, llegó rápido y caliente.", "Muy buen servicio, lo recomiendo.",
  "La comida estuvo deliciosa, volvería a pedir.", "Todo llegó en perfecto estado.",
  "Me encantó, las porciones son grandes y el sabor increíble.",
  "Muy buena relación calidad-precio.", "El mejor restaurante de la zona.",
  "Rápido y delicioso, sin duda lo mejor.", "Superó mis expectativas.",
  "El pedido llegó antes de lo esperado y todo estaba perfecto."
];
const COMENTARIOS_NEUTROS = [
  "Estuvo bien, nada extraordinario.", "Cumplió con lo esperado.", "Normal, como cualquier otro.",
  "Podría mejorar la presentación.", "El sabor estuvo bien pero tardó un poco.",
  "Aceptable para el precio.", "No está mal, pero hay mejores opciones."
];
const COMENTARIOS_NEGATIVOS = [
  "La comida llegó fría.", "Tardó demasiado en llegar.", "El pedido estaba incompleto.",
  "No cumplió con mis expectativas.", "Mala experiencia, no volvería a pedir.",
  "La calidad no justifica el precio."
];

// ── Generadores ───────────────────────────────────────

function generarRestaurantes() {
  const nombres = [...NOMBRES_RESTAURANTE];
  return Array.from({ length: CONFIG.restaurantes }, (_, i) => {
    const ciudad = rand(CIUDADES);
    const calle = rand(CALLES);
    return {
      _id: `rest${pad(i + 1)}`,
      nombre: nombres[i] || `Restaurante ${i + 1}`,
      direccion: `${calle} ${randInt(1, 999)}, ${ciudad}`,
      telefono: `+502 ${randInt(2000, 9999)}-${randInt(1000, 9999)}`,
      tipo_cocina: rand(TIPOS_COCINA),
      horario: `Lun-Dom ${randInt(7, 11)}:00-${randInt(20, 23)}:00`,
      calificacion_promedio: 0.0, // se actualizará con las reseñas
      articulos_ids: [],           // se llenará después de generar artículos
      fecha_registro: randDate(new Date("2020-01-01"), new Date("2023-12-31")),
      imagen_url: `https://ejemplo.com/imagenes/rest${pad(i + 1)}.jpg`,
      gridfs_imagen_id: null, // se llena con gridfs-images.js
    };
  });
}

function generarUsuarios() {
  const emails = new Set();
  return Array.from({ length: CONFIG.usuarios }, (_, i) => {
    const nombre = `${rand(PRIMEROS_NOMBRES)} ${rand(APELLIDOS)}`;
    let email;
    do {
      email = `${nombre.toLowerCase().replace(/\s/g, ".").replace(/[áéíóúñ]/g, c =>
        ({ á:"a",é:"e",í:"i",ó:"o",ú:"u",ñ:"n" })[c] || c)}.${randInt(1, 999)}@gmail.com`;
    } while (emails.has(email));
    emails.add(email);

    const ciudad = rand(CIUDADES);
    return {
      _id: `user${pad(i + 1)}`,
      nombre,
      email,
      direccion: `${rand(CALLES)} ${randInt(1, 500)}, ${ciudad}`,
      telefono: `+502 ${randInt(3000, 9999)}-${randInt(1000, 9999)}`,
      fecha_registro: randDate(new Date("2021-01-01"), new Date("2024-06-30")),
    };
  });
}

function generarArticulos(restaurantes) {
  const articulos = [];
  const articulosPorRest = {};
  let idx = 0;

  // Distribuir artículos entre restaurantes (10-14 por restaurante)
  for (const rest of restaurantes) {
    const cantidad = randInt(10, 14);
    articulosPorRest[rest._id] = [];
    const categoria = rand(CATEGORIAS_ARTICULO);

    for (let j = 0; j < cantidad && idx < CONFIG.articulos; j++, idx++) {
      const id = `art${pad(idx + 1)}`;
      articulosPorRest[rest._id].push(id);
      articulos.push({
        _id: id,
        restaurante_id: rest._id,
        nombre: rand(NOMBRES_PLATILLOS),
        descripcion: `Delicioso platillo preparado con ingredientes frescos de temporada.`,
        precio: randFloat(5.0, 85.0),
        categoria,
        disponible: Math.random() > 0.1, // 90% disponibles
        imagen_url: `https://ejemplo.com/imagenes/art${pad(idx + 1)}.jpg`,
        gridfs_imagen_id: null, // se llena con gridfs-images.js
      });
    }
  }

  // Actualizar articulos_ids en restaurantes
  for (const rest of restaurantes) {
    rest.articulos_ids = articulosPorRest[rest._id] || [];
  }

  return articulos;
}

function generarOrdenes(usuarios, restaurantes, articulos) {
  const articulosPorRest = {};
  for (const art of articulos) {
    if (!articulosPorRest[art.restaurante_id]) articulosPorRest[art.restaurante_id] = [];
    articulosPorRest[art.restaurante_id].push(art);
  }

  const usuarioIds = usuarios.map(u => u._id);
  const restauranteIds = restaurantes.map(r => r._id);

  return Array.from({ length: CONFIG.ordenes }, (_, i) => {
    const restId = rand(restauranteIds);
    const disponibles = (articulosPorRest[restId] || []).filter(a => a.disponible);
    if (disponibles.length === 0) return null;

    const cantItems = randInt(1, Math.min(5, disponibles.length));
    const seleccionados = [...disponibles].sort(() => 0.5 - Math.random()).slice(0, cantItems);

    const items = seleccionados.map(art => {
      const cantidad = randInt(1, 4);
      const subtotal = parseFloat((art.precio * cantidad).toFixed(2));
      return {
        articulo_id: art._id,
        nombre: art.nombre,
        precio_unitario: art.precio,
        cantidad,
        subtotal,
      };
    });

    const monto_total = parseFloat(items.reduce((s, it) => s + it.subtotal, 0).toFixed(2));

    // Elegir estado con distribución realista
    const rnd = Math.random();
    let acum = 0;
    let estado = ESTADOS_ORDEN[2];
    for (let k = 0; k < ESTADOS_ORDEN.length; k++) {
      acum += ESTADO_PESOS[k];
      if (rnd < acum) { estado = ESTADOS_ORDEN[k]; break; }
    }

    const usuario = rand(usuarios);
    return {
      _id: `ord${pad(i + 1, 5)}`,
      usuario_id: rand(usuarioIds),
      restaurante_id: restId,
      fecha_pedido: randDate(new Date("2023-01-01"), new Date("2025-12-31")),
      estado,
      monto_total,
      items,
      direccion_entrega: usuario.direccion,
      metodo_pago: rand(METODOS_PAGO),
    };
  }).filter(Boolean);
}

function generarResenias(usuarios, restaurantes, ordenes) {
  const ordenesEntregadas = ordenes.filter(o => o.estado === "Entregado");
  const usuarioIds = usuarios.map(u => u._id);
  const restauranteIds = restaurantes.map(r => r._id);

  return Array.from({ length: CONFIG.resenias }, (_, i) => {
    const calificacion = randInt(1, 5);
    let comentario;
    if (calificacion >= 4) comentario = rand(COMENTARIOS_POSITIVOS);
    else if (calificacion === 3) comentario = rand(COMENTARIOS_NEUTROS);
    else comentario = rand(COMENTARIOS_NEGATIVOS);

    const conOrden = Math.random() > 0.3 && ordenesEntregadas.length > 0;
    const orden = conOrden ? rand(ordenesEntregadas) : null;

    return {
      _id: `res${pad(i + 1, 4)}`,
      usuario_id: rand(usuarioIds),
      restaurante_id: orden ? orden.restaurante_id : rand(restauranteIds),
      orden_id: orden ? orden._id : null,
      calificacion_num: calificacion,
      comentario,
      fecha: randDate(new Date("2023-01-01"), new Date("2025-12-31")),
    };
  });
}

// Actualizar calificacion_promedio en restaurantes
function calcularPromedios(restaurantes, resenias) {
  const totales = {};
  const conteos = {};
  for (const res of resenias) {
    if (!totales[res.restaurante_id]) { totales[res.restaurante_id] = 0; conteos[res.restaurante_id] = 0; }
    totales[res.restaurante_id] += res.calificacion_num;
    conteos[res.restaurante_id]++;
  }
  for (const rest of restaurantes) {
    if (conteos[rest._id]) {
      rest.calificacion_promedio = parseFloat((totales[rest._id] / conteos[rest._id]).toFixed(2));
    }
  }
}

// ── Inserción en batch ────────────────────────────────
async function insertarEnBatches(col, docs, batchSize = 500) {
  let insertados = 0;
  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = docs.slice(i, i + batchSize);
    await col.insertMany(batch, { ordered: false });
    insertados += batch.length;
    process.stdout.write(`\r    Insertados: ${insertados}/${docs.length}`);
  }
  console.log();
}

// ── Función exportable (usada por index.js) ───────────
async function seedAll(db) {
  console.log("     Generando datos...");
  const restaurantes = generarRestaurantes();
  const usuarios     = generarUsuarios();
  const articulos    = generarArticulos(restaurantes);
  const ordenes      = generarOrdenes(usuarios, restaurantes, articulos);
  const resenias     = generarResenias(usuarios, restaurantes, ordenes);
  calcularPromedios(restaurantes, resenias);

  const total = restaurantes.length + usuarios.length + articulos.length + ordenes.length + resenias.length;
  console.log(`     Generados ${total.toLocaleString()} documentos:\n`);
  console.log(`     restaurantes : ${restaurantes.length}`);
  console.log(`     usuarios     : ${usuarios.length}`);
  console.log(`     articulos    : ${articulos.length}`);
  console.log(`     ordenes      : ${ordenes.length}`);
  console.log(`     resenias     : ${resenias.length}\n`);

  console.log("  Insertando restaurantes...");
  await insertarEnBatches(db.collection("restaurantes"), restaurantes);
  console.log("  Insertando usuarios...");
  await insertarEnBatches(db.collection("usuarios"), usuarios);
  console.log("  Insertando articulos...");
  await insertarEnBatches(db.collection("articulos"), articulos);
  console.log("  Insertando ordenes...");
  await insertarEnBatches(db.collection("ordenes"), ordenes, 1000);
  console.log("  Insertando resenias...");
  await insertarEnBatches(db.collection("resenias"), resenias);

  console.log(`\n  Inserción completada: ${total.toLocaleString()} documentos.`);
}

module.exports = { seedAll };

// ── Standalone (node data_injection.js) ──────────────
if (require.main === module) {
  const { MongoClient: MC } = require("mongodb");
  const client = new MC(URI);
  client.connect()
    .then(() => seedAll(client.db(DB_NAME)))
    .then(() => { console.log("\n Done."); client.close(); })
    .catch(err => { console.error(err.message); process.exit(1); });
}