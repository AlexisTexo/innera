/* eslint-disable no-console */
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://theinnercode-1a595.firebaseio.com",
});

const db = admin.firestore();

/* --------- Datos base para colecciones "semilla" (estáticas) --------- */

const jungArchetypes = 
[
    {
        "id": "Inocente",
        "name": "Inocente",
        "description": "Busca la felicidad y hacer el bien",
        "orientation": "Optimista",
        "keywords": ["pureza", "bondad", "felicidad"]
    },
    {
        "id": "Huérfano",
        "name": "Huérfano / Hombre Común",
        "description": "Busca pertenecer y sentirse aceptado",
        "orientation": "Realista",
        "keywords": ["supervivencia", "empatía", "conexión"]
    },
    {
        "id": "Héroe",
        "name": "Héroe",
        "description": "Busca demostrar su valía a través del valor y la acción",
        "orientation": "Valiente",
        "keywords": ["fuerza", "determinación", "disciplina"]
    },
    {
        "id": "Cuidador",
        "name": "Cuidador",
        "description": "Busca proteger y ayudar a los demás",
        "orientation": "Altruista",
        "keywords": ["compasión", "protección", "servicio"]
    },
    {
        "id": "Explorador",
        "name": "Explorador",
        "description": "Busca libertad, descubrimiento y autenticidad",
        "orientation": "Independiente",
        "keywords": ["aventura", "curiosidad", "autenticidad"]
    },
    {
        "id": "Rebelde",
        "name": "Rebelde",
        "description": "Busca romper las reglas y provocar el cambio",
        "orientation": "Revolucionario",
        "keywords": ["ruptura", "libertad", "transformación"]
    },
    {
        "id": "Amante",
        "name": "Amante",
        "description": "Busca intimidad, belleza y conexión emocional",
        "orientation": "Pasional",
        "keywords": ["conexión", "emoción", "devoción"]
    },
    {
        "id": "Creador",
        "name": "Creador",
        "description": "Busca crear algo con significado y valor duradero",
        "orientation": "Innovador",
        "keywords": ["imaginación", "expresión", "perfección"]
    },
    {
        "id": "Bufón",
        "name": "Bufón",
        "description": "Busca disfrutar la vida y contagiar alegría",
        "orientation": "Divertido",
        "keywords": ["humor", "espontaneidad", "vivir el momento"]
    },
    {
        "id": "Sabio",
        "name": "Sabio",
        "description": "Busca la verdad, el conocimiento y la comprensión",
        "orientation": "Intelectual",
        "keywords": ["conocimiento", "reflexión", "verdad"]
    },
    {
        "id": "Mago",
        "name": "Mago",
        "description": "Busca transformar la realidad mediante la visión o el conocimiento",
        "orientation": "Visionario",
        "keywords": ["transformación", "intuición", "poder"]
    },
    {
        "id": "Gobernante",
        "name": "Gobernante",
        "description": "Busca control, orden y estabilidad",
        "orientation": "Líder",
        "keywords": ["autoridad", "responsabilidad", "estructura"]
    }
];

/** Personalidades definidas como docs con name/description.
 *  Claves de pesos vendrán de los IDs de esta colección.
 */
const personalityDefs = [
  { id: "Autoestima", name: "Autoestima", description: "Percepción de valor propio y confianza personal." },
  { id: "Estres", name: "Estrés", description: "Presión o tensión percibida frente a demandas." },
  { id: "Sociabilidad", name: "Sociabilidad", description: "Tendencia a interactuar y disfrutar con otros." },
  { id: "Ansiedad", name: "Ansiedad", description: "Nivel de inquietud, preocupación o nerviosismo." },
  { id: "Resiliencia", name: "Resiliencia", description: "Capacidad de adaptarse y recuperarse ante la adversidad." },
  { id: "Depresion", name: "Depresión", description: "Estado de ánimo bajo, anhedonia y fatiga." },
];

/* ------------------------------- Seed main ------------------------------ */

async function seedData() {
  // Batch inicial para estáticos
  const batch = db.batch();

  // 1) Purpose
  ["bitacora", "activadora", "resumen"].forEach((p) => {
    batch.set(db.collection("Purpose").doc(p), {
      name: p.charAt(0).toUpperCase() + p.slice(1),
    });
  });

  // 2) Archetypes (ID = slug(name))
  jungArchetypes.forEach((a) => {
    const arqId = a.id;
    batch.set(db.collection("Archetypes").doc(arqId), {
      name: a.name,
      description: a.description,
      orientation: a.orientation,
      keywords: a.keywords,
    });
  });

  // 3) Personality (docs con id fijo: autoestima, estres, etc.)
  personalityDefs.forEach((p) => {
    batch.set(db.collection("Personality").doc(p.id), {
      name: p.name,
      description: p.description,
    });
  });

  await batch.commit();
  /*
  // 4) Users (placeBirth/address como un solo place)
  const userRef = await db.collection("Users").add({
    name: "Diego Olmos",
    email: "diego.olmos@example.com",
    // Nota: usa Firebase Auth para credenciales reales
    password: "hashed_password",
    dateBirth: "1990-05-10",
    hourBirth: "08:30",

    placeBirth: makePlace({
      city: "Ciudad de México",
      state: "CDMX",
      country: "MX",
      street: "",
      postalCode: "",
      notes: "Hospital Central",
    }),

    address: makePlace({
      city: "Ciudad de México",
      state: "CDMX",
      country: "MX",
      street: "Av. Siempre Viva 742",
      postalCode: "01234",
      notes: null,
    }),

    voicePreferred: "voz_alegre",
    dateCreationAccount: admin.firestore.FieldValue.serverTimestamp(),
    isActive: true,
    languageId: "es",
  });

  const userId = userRef.id;

  // 5) Logbook
  await db.collection("Logbook").add({
    dateCreation: admin.firestore.FieldValue.serverTimestamp(),
    prompt: "¿Qué sentiste al despertar?",
    answer: "Paz interior y claridad mental.",
    emotionsDetected: ["calma", "gratitud"],
    userId,
  });

  // 6) TriggerQuestions
  await db.collection("TriggerQuestions").add({
    question: "¿Cómo influyó tu entorno en tu estado emocional?",
    answer: "El clima nublado me hizo sentir más reflexivo.",
    dateCreation: admin.firestore.FieldValue.serverTimestamp(),
    userId,
  });

  // 7) WeeklySummary
  await db.collection("WeeklySummary").add({
    weekStart: "2025-07-28",
    weekEnd: "2025-08-03",
    emotions: ["reflexión", "tranquilidad"],
    keywords: ["familia", "conexión"],
    centralTheme: "Reconexión interior",
    summaryText: "Semana marcada por introspección y armonía.",
    dateCreation: admin.firestore.FieldValue.serverTimestamp(),
    userId,
  });

  // 8) DataUser
  await db.collection("DataUser").add({
    dateCreation: admin.firestore.FieldValue.serverTimestamp(),
    dateLogin: "2025-08-01T09:00:00",
    dateLogout: "2025-08-01T17:00:00",
    userId,
  });

  // 9) InnerBluePrint (histórico: un doc por generación)
  // Lee colecciones para armar pesos uniformes y normalizados a 10
  const archetypeWeight = await buildArchetypeWeightMap(3);
  const personalityWeight = await buildPersonalityWeightMap(3);

  await db.collection("InnerBluePrint").add({
    mode: "init",
    lifeCycles: "integración dfe vida",            // strings según tu modelo
    emotionalTendency: "reflexivo",
    currentLifeTrend: "equilibrio razón-emoción",
    suggestedApproach: "claridad mental y expresión creativa",
    archetypeWeight,                                   // { arqJung1: x.xx, ... } suma 10
    justify: "Distribución inicial basada en perfiles base y estado de arranque del usuario (init).", // ~120w máx.
    facetas: ["autenticidad", "curiosidad", "compasión"], // ejemplo; es string[]
    personalityWeight,                                 // { autoestima: x.xx, ... } suma 10
    dateCreation: admin.firestore.FieldValue.serverTimestamp(),
    userId,
  });

  // 10) Notifications
  const notifications = [
    { purposeId: "bitacora", time: "20:00" },
    { purposeId: "activadora", time: "08:30" },
    { purposeId: "resumen", time: "21:00" },
  ];
  for (const n of notifications) {
    const next = getNextNotificationTimestamp(n.time);
    await db.collection("Notifications").add({
      userId,
      purposeId: n.purposeId,
      time: n.time,
      nextNotification: admin.firestore.Timestamp.fromDate(next),
      isActive: true,
      dateCreated: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  // 11) TestUsers
  await db.collection("TestUsers").add({
    name: "Diego",
    lastName: "Olmos",
    email: "diego.olmos@bcareit.com",
    dateCreation: admin.firestore.FieldValue.serverTimestamp(),
  });
  */

  console.log("Todo correcto");
}

seedData().catch((err) => {
  console.error("Error al poblar la base de datos:", err);
  process.exit(1);
});
