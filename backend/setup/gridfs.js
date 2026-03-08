// =====================================================
// Proyecto 01 - MongoDB | GridFS Image Uploader
// Sube imágenes de picsum.photos a GridFS para
// restaurantes y artículos.
//
// Uso:
//   node gridfs-images.js                  (ambos)
//   node gridfs-images.js --target=restaurantes
//   node gridfs-images.js --target=articulos
// =====================================================

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const GridFSBucket = mongodb.GridFSBucket;
const https = require("https");
const http = require("http");

require('dotenv').config({ path: '../../.env' });

const URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

// Parsear --target= del argv
const argTarget = (process.argv.find(a => a.startsWith("--target=")) || "").replace("--target=", "") || "ambos";
const TARGETS_VALIDOS = ["restaurantes", "articulos", "ambos"];
if (!TARGETS_VALIDOS.includes(argTarget)) {
  console.error(`--target debe ser: restaurantes | articulos | ambos`);
  process.exit(1);
}

const IMG_WIDTH  = 800;
const IMG_HEIGHT = 600;
const CONCURRENCY = 5; // requests simultáneos a Picsum

// ── HTTP helpers ──────────────────────────────────────

function descargarImagen(url, redirectsRestantes = 5) {
  return new Promise((resolve, reject) => {
    if (redirectsRestantes === 0) return reject(new Error("Demasiados redirects: " + url));

    const lib = url.startsWith("https") ? https : http;
    const req = lib.get(url, { timeout: 15000 }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        res.resume();
        return descargarImagen(res.headers.location, redirectsRestantes - 1).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} → ${url}`));
      }
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end",  () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout → " + url)); });
  });
}

function subirAGridFS(bucket, filename, buffer, metadata) {
  return new Promise((resolve, reject) => {
    const stream = bucket.openUploadStream(filename, {
      contentType: "image/jpeg",
      metadata,
    });
    stream.on("finish", () => resolve(stream.id));
    stream.on("error", reject);
    stream.end(buffer);
  });
}

async function enParalelo(tareas, concurrency) {
  const resultados = [];
  for (let i = 0; i < tareas.length; i += concurrency) {
    const lote = tareas.slice(i, i + concurrency);
    const res  = await Promise.allSettled(lote.map(fn => fn()));
    resultados.push(...res);
    process.stdout.write(`\r    ${Math.min(i + concurrency, tareas.length)}/${tareas.length}`);
  }
  console.log();
  return resultados;
}

function reportar(label, resultados) {
  const ok  = resultados.filter(r => r.status === "fulfilled");
  const err = resultados.filter(r => r.status === "rejected");
  console.log(`  ${label}: ${ok.length} subidas`);
  if (err.length) {
    console.log(`  Errores: ${err.length}`);
    err.slice(0, 5).forEach(e => console.log(`     └─ ${e.reason?.message}`));
  }
}

// ── Procesadores por colección ────────────────────────

async function procesarRestaurantes(db) {
  const bucket = new GridFSBucket(db, { bucketName: "restaurante_imagenes" });

  const docs = await db.collection("restaurantes")
    .find({}, { projection: { _id: 1, nombre: 1, tipo_cocina: 1 } })
    .toArray();

  if (!docs.length) { console.log("  ⚠️  Sin restaurantes."); return; }
  console.log(`\n🍽️  Restaurantes: ${docs.length} imágenes`);

  const tareas = docs.map(doc => async () => {
    const seed = encodeURIComponent(doc._id);
    const url  = `https://picsum.photos/seed/${seed}/${IMG_WIDTH}/${IMG_HEIGHT}`;
    const buf  = await descargarImagen(url);

    const filename = `${doc._id}_${doc.nombre.replace(/\s+/g,"_").replace(/[^a-zA-Z0-9_]/g,"")}.jpg`;
    const fileId   = await subirAGridFS(bucket, filename, buf, {
      restaurante_id: doc._id,
      nombre:         doc.nombre,
      tipo_cocina:    doc.tipo_cocina,
      subido_en:      new Date(),
    });

    await db.collection("restaurantes").updateOne(
      { _id: doc._id },
      { $set: { gridfs_imagen_id: fileId.toString() } }
    );
    return fileId;
  });

  const res = await enParalelo(tareas, CONCURRENCY);
  reportar("restaurantes", res);
}

async function procesarArticulos(db) {
  // Cada artículo usa como seed su _id → imagen consistente y única por artículo
  // Usamos un offset en el seed para que sean visualmente distintas a las de restaurantes
  const bucket = new GridFSBucket(db, { bucketName: "articulo_imagenes" });

  const docs = await db.collection("articulos")
    .find({}, { projection: { _id: 1, nombre: 1, categoria: 1, restaurante_id: 1 } })
    .toArray();

  if (!docs.length) { console.log("  Sin artículos."); return; }
  console.log(`\n Artículos: ${docs.length} imágenes`);

  const tareas = docs.map(doc => async () => {
    // Prefijo "food-" para seeds distintos a los de restaurantes
    const seed = encodeURIComponent(`food-${doc._id}`);
    const url  = `https://picsum.photos/seed/${seed}/${IMG_WIDTH}/${IMG_HEIGHT}`;
    const buf  = await descargarImagen(url);

    const filename = `${doc._id}_${doc.nombre.replace(/\s+/g,"_").replace(/[^a-zA-Z0-9_]/g,"")}.jpg`;
    const fileId   = await subirAGridFS(bucket, filename, buf, {
      articulo_id:    doc._id,
      restaurante_id: doc.restaurante_id,
      nombre:         doc.nombre,
      categoria:      doc.categoria,
      subido_en:      new Date(),
    });

    await db.collection("articulos").updateOne(
      { _id: doc._id },
      { $set: { gridfs_imagen_id: fileId.toString() } }
    );
    return fileId;
  });

  const res = await enParalelo(tareas, CONCURRENCY);
  reportar("artículos", res);
}


// ── Función exportable (usada por index.js) ───────────
async function subirImagenes(db, target = "ambos") {
  if (typeof GridFSBucket === "undefined") {
    const ver = require("mongodb/package.json").version;
    throw new Error(`GridFSBucket no disponible. Versión mongodb: ${ver}. Necesitas v4+.`);
  }

  if (target === "restaurantes" || target === "ambos") await procesarRestaurantes(db);
  if (target === "articulos"    || target === "ambos") await procesarArticulos(db);

  console.log("\n  Buckets GridFS:");
  if (target === "restaurantes" || target === "ambos")
    console.log("  restaurante_imagenes (.files / .chunks)");
  if (target === "articulos"    || target === "ambos")
    console.log("  articulo_imagenes    (.files / .chunks)");
  console.log("  Campo gridfs_imagen_id actualizado en cada doc.");
}

module.exports = { subirImagenes };

// ── Standalone (node gridfs.js --target=...) ──────────
if (require.main === module) {
  const { MongoClient: MC } = require("mongodb");
  const client = new MC(URI);
  client.connect().then(async () => {
    console.log(`✅ Conectado · DB: "${DB_NAME}"  target: "${argTarget}"\n`);
    await subirImagenes(client.db(DB_NAME), argTarget);
    client.close();
  }).catch(err => { console.error("\n❌ Error:", err.message); process.exit(1); });
}