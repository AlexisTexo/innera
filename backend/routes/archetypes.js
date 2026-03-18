const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// ---- Firestore solo para datos de arquetipos (texto). Las imágenes NO dependen de Firestore.
const admin = require('../firebase');
const db = admin.firestore();

/* ===========================
   CONFIG
   =========================== */

// Usa nombres de archivo "slug" (sin acentos/espacios) para mapear IDs con acentos.
// Ej: id "Héroe" -> archivo "heroe.png"
const USE_SLUG_FILENAMES = true;

// Directorio de imágenes PNG
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const IMG_DIR = path.join(PUBLIC_DIR, 'archetypes');

/* ===========================
   UTILS
   =========================== */

function slugifyId(id) {
  return id
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita acentos
    .replace(/\s+/g, '-')            // espacios -> guion
    .replace(/[^a-zA-Z0-9._-]/g, '') // limpia caracteres raros
    .toLowerCase();
}

function fileBasenameForId(id) {
  return USE_SLUG_FILENAMES ? slugifyId(id) : id;
}

function buildBaseUrl(req) {
  const host = req.headers['x-forwarded-host'] || req.get('host');
  
  // SIEMPRE usar HTTPS para apiinnercode.theinnercode.net
  if (host && host.includes('theinnercode.net')) {
    return `https://${host}`;
  }
  
  // Para otros casos, lógica normal
  const xfProto = (req.headers['x-forwarded-proto'] || '').split(',')[0].trim();
  const proto = (req.secure || xfProto === 'https') ? 'https' : 'http';
  return `${proto}://${host}`;
}

function buildImageObjects(req, id, displayName) {
  const baseUrl = buildBaseUrl(req); // Ahora esto retorna la URL completa
  
  const basename = fileBasenameForId(id);
  const list = listImagesForBasename(basename);

  return list.map((it) => ({
    url: `${baseUrl}/assets/archetypes/${encodeURIComponent(it.filename)}?v=${Math.floor(it.mtimeMs)}`,
    alt: displayName || id,
    format: 'png',
    updatedAt: it.updatedAt,
  }));
}

function listImagesForBasename(basename) {
  if (!fs.existsSync(IMG_DIR)) return [];

  const safe = basename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Coincide con: basename.png (principal) y basename-*.png / basename_*.png / basename.*.png
  const re = new RegExp(`^${safe}(?:[._-].+)?\\.png$`, 'i');

  const files = fs.readdirSync(IMG_DIR).filter((f) => re.test(f));
  const items = files.map((filename) => {
    const fullPath = path.join(IMG_DIR, filename);
    const stat = fs.statSync(fullPath);
    return {
      filename,
      mtimeMs: stat.mtimeMs,
      updatedAt: Math.floor(stat.mtimeMs / 1000),
    };
  });

  // Principal (basename.png) primero, luego variantes alfabéticas
  items.sort((a, b) => {
    const aExact = a.filename.toLowerCase() === `${basename.toLowerCase()}.png`;
    const bExact = b.filename.toLowerCase() === `${basename.toLowerCase()}.png`;
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    return a.filename.localeCompare(b.filename, 'es');
  });

  return items;
}

/* ===========================
   MAPEO DOC -> JSON
   =========================== */

function toArchetype(doc, req) {
  const d = doc.data() || {};
  const id = doc.id;

  const images = buildImageObjects(req, id, d.name || id);
  const principal = images.length ? images[0] : null; // <- evita ReferenceError

  return {
    id,
    name: d.name || '',
    description: d.description || '',
    orientation: d.orientation || '',
    keywords: Array.isArray(d.keywords) ? d.keywords : [],
    image: principal,  // principal (puede ser null)
    images,            // todas (puede ser [])
  };
}

/* ===========================
   ENDPOINTS
   =========================== */

// GET /archetypes -> lista completa
router.get('/', async (req, res) => {
  try {
    const snap = await db.collection('Archetypes').get();
    const items = snap.docs.map((doc) => toArchetype(doc, req));

    // Si usas IDs tipo arqJung#, ordena por número
    items.sort((a, b) => {
      const na = Number((a.id.match(/\d+/) || [0])[0]);
      const nb = Number((b.id.match(/\d+/) || [0])[0]);
      return na - nb;
    });

    res.set('Cache-Control', 'public, max-age=60');
    return res.status(200).json(items);
  } catch (err) {
    console.error('GET /archetypes error:', err);
    return res.status(500).json({ message: 'Error al obtener arquetipos', error: err.message });
  }
});

// GET /archetypes/:id -> un doc por id (incluye images)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const ref = db.collection('Archetypes').doc(String(id));
    const doc = await ref.get();

    if (!doc.exists) {
      // Aun si no existe el doc, podrías devolver SOLO imágenes. Si prefieres eso, descomenta:
      // const images = buildImageObjects(req, id, id);
      // if (images.length) return res.status(200).json({ id, name: id, images, image: images[0] });
      return res.status(404).json({ message: 'Arquetipo no encontrado' });
    }

    res.set('Cache-Control', 'public, max-age=120');
    return res.status(200).json(toArchetype(doc, req));
  } catch (err) {
    console.error('GET /archetypes/:id error:', err);
    return res.status(500).json({ message: 'Error al obtener arquetipo', error: err.message });
  }
});

// GET /archetypes/:id/images -> SOLO imágenes (no depende de Firestore)
router.get('/:id/images', async (req, res) => {
  try {
    const { id } = req.params;
    // Si existe el doc, usa su name para ALT; si no, usa el id tal cual.
    let displayName = id;
    try {
      const ref = db.collection('Archetypes').doc(String(id));
      const doc = await ref.get();
      if (doc.exists) displayName = doc.data().name || id;
    } catch (_) {
      // ignora errores de Firestore aquí para que no bloquee las imágenes
    }

    const images = buildImageObjects(req, id, displayName);

    if (!images.length) {
      return res.status(404).json({ message: 'Sin imágenes para este arquetipo' });
    }

    res.set('Cache-Control', 'public, max-age=300');
    return res.status(200).json(images);
  } catch (err) {
    console.error('GET /archetypes/:id/images error:', err);
    return res.status(500).json({ message: 'Error al obtener imágenes', error: err.message });
  }
});

module.exports = router;
