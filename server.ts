import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { doctors as initialDoctors, testimonials as initialTestimonials } from "./src/data";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "data", "db.json");

// Default Case Studies
const initialCaseStudies = [
  {
    id: "lentes",
    title: "Transformação Estética com Lentes de Contato",
    specialty: "Odontologia Estética / Porcelana",
    patientInitials: "P.S.M, 32 anos",
    beforeImg: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600",
    afterImg: "https://images.unsplash.com/photo-1613521140210-b4d98588f58d?auto=format&fit=crop&q=80&w=600",
    dentist: "Dra. Beatriz Menezes"
  },
  {
    id: "clareamento",
    title: "Clareamento Violeta de Alta Eficácia",
    specialty: "Estética / Clareamento Premium",
    patientInitials: "L.A.T, 28 anos",
    beforeImg: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=600",
    afterImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
    dentist: "Dra. Beatriz Menezes"
  },
  {
    id: "invisalign",
    title: "Alinhamento com Invisalign®",
    specialty: "Ortodontia Digital / Invisível",
    patientInitials: "G.H.O, 24 anos",
    beforeImg: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=600",
    afterImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
    dentist: "Dra. Mariana Vasconcellos"
  }
];

// Default Gallery Items
const initialGallery = [
  {
    id: "gal1",
    imageUrl: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=600",
    caption: "Consultório odontológico equipado com tecnologia 3D alemã"
  },
  {
    id: "gal2",
    imageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600",
    caption: "Recepção aconchegante e confortável para nossos pacientes"
  },
  {
    id: "gal3",
    imageUrl: "https://images.unsplash.com/photo-1461344577544-4e5dc948718b?auto=format&fit=crop&q=80&w=600",
    caption: "Nossa equipe unida focada em cuidar do seu sorriso"
  }
];

// Initialize Firebase connection
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import firebaseConfig from "./firebase-applet-config.json";

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */

// Helper to read db state from Firestore with fallback and auto-seeding
async function readDbFromFirestore() {
  try {
    const settingsDocRef = doc(db, "settings", "global");
    const settingsSnapshot = await getDoc(settingsDocRef);
    
    // If database is completely unpopulated, seed with default values
    if (!settingsSnapshot.exists()) {
      console.log("Firestore settings not found. Seeding initial database into Cloud Firestore...");
      
      // Seeding global settings
      await setDoc(settingsDocRef, {
        heroDoctorImageUrl: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=600"
      });

      // Seeding Initial Doctors
      for (const d of initialDoctors) {
        await setDoc(doc(db, "doctors", d.id), d);
      }

      // Seeding Initial Case Studies
      for (const c of initialCaseStudies) {
        await setDoc(doc(db, "caseStudies", c.id), c);
      }

      // Seeding Initial Testimonials
      for (const t of initialTestimonials) {
        await setDoc(doc(db, "testimonials", t.id), t);
      }

      // Seeding Initial Gallery
      for (const g of initialGallery) {
        await setDoc(doc(db, "gallery", g.id), g);
      }
      
      console.log("Free Cloud Firestore Database seeded successfully!");
    }

    // Load everything from Firestore
    const settingsData = (await getDoc(settingsDocRef)).data();
    
    const docsSnapshot = await getDocs(collection(db, "doctors"));
    const doctors = docsSnapshot.docs.map(docSnap => docSnap.data());

    const casesSnapshot = await getDocs(collection(db, "caseStudies"));
    const caseStudies = casesSnapshot.docs.map(docSnap => docSnap.data());

    const testimonialsSnapshot = await getDocs(collection(db, "testimonials"));
    const testimonials = testimonialsSnapshot.docs.map(docSnap => docSnap.data());

    const gallerySnapshot = await getDocs(collection(db, "gallery"));
    const gallery = gallerySnapshot.docs.map(docSnap => docSnap.data());

    const bookingsSnapshot = await getDocs(collection(db, "bookings"));
    const bookings = bookingsSnapshot.docs.map(docSnap => docSnap.data());

    const leadsSnapshot = await getDocs(collection(db, "leads"));
    const leads = leadsSnapshot.docs.map(docSnap => docSnap.data());

    return {
      heroDoctorImageUrl: settingsData?.heroDoctorImageUrl || "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=600",
      doctors,
      caseStudies,
      testimonials,
      gallery,
      bookings: bookings.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()),
      leads: leads.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    };
  } catch (err) {
    console.error("Error reading database from Firestore:", err);
    return {
      heroDoctorImageUrl: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=600",
      doctors: initialDoctors,
      caseStudies: initialCaseStudies,
      testimonials: initialTestimonials,
      gallery: initialGallery,
      bookings: [],
      leads: []
    };
  }
}

// Function to store multiple entities into Firestore
async function saveToFirestore(body: any) {
  const { heroDoctorImageUrl, doctors, caseStudies, testimonials, gallery, bookings, leads } = body;
  
  if (heroDoctorImageUrl !== undefined) {
    const cleanUrl = processBase64Images(heroDoctorImageUrl);
    await setDoc(doc(db, "settings", "global"), { heroDoctorImageUrl: cleanUrl });
  }

  if (doctors !== undefined) {
    const cleanDoctors = processBase64Images(doctors);
    const docsSnapshot = await getDocs(collection(db, "doctors"));
    for (const docSnap of docsSnapshot.docs) {
      await deleteDoc(docSnap.ref);
    }
    for (const d of cleanDoctors) {
      await setDoc(doc(db, "doctors", d.id), d);
    }
  }

  if (caseStudies !== undefined) {
    const cleanCases = processBase64Images(caseStudies);
    const casesSnapshot = await getDocs(collection(db, "caseStudies"));
    for (const docSnap of casesSnapshot.docs) {
      await deleteDoc(docSnap.ref);
    }
    for (const c of cleanCases) {
      await setDoc(doc(db, "caseStudies", c.id), c);
    }
  }

  if (testimonials !== undefined) {
    const cleanTestimonials = processBase64Images(testimonials);
    const testimonialsSnapshot = await getDocs(collection(db, "testimonials"));
    for (const docSnap of testimonialsSnapshot.docs) {
      await deleteDoc(docSnap.ref);
    }
    for (const t of cleanTestimonials) {
      await setDoc(doc(db, "testimonials", t.id), t);
    }
  }

  if (gallery !== undefined) {
    const cleanGallery = processBase64Images(gallery);
    const gallerySnapshot = await getDocs(collection(db, "gallery"));
    for (const docSnap of gallerySnapshot.docs) {
      await deleteDoc(docSnap.ref);
    }
    for (const g of cleanGallery) {
      await setDoc(doc(db, "gallery", g.id), g);
    }
  }

  if (bookings !== undefined) {
    const cleanBookings = processBase64Images(bookings);
    const bookingsSnapshot = await getDocs(collection(db, "bookings"));
    for (const docSnap of bookingsSnapshot.docs) {
      await deleteDoc(docSnap.ref);
    }
    for (const b of cleanBookings) {
      await setDoc(doc(db, "bookings", b.id), b);
    }
  }

  if (leads !== undefined) {
    const cleanLeads = processBase64Images(leads);
    const leadsSnapshot = await getDocs(collection(db, "leads"));
    for (const docSnap of leadsSnapshot.docs) {
      await deleteDoc(docSnap.ref);
    }
    for (const l of cleanLeads) {
      await setDoc(doc(db, "leads", l.id), l);
    }
  }
}

// Recursive helper to process base64 images and save them as local uploads
function processBase64Images(node: any): any {
  if (typeof node === "string") {
    const base64Regex = /^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/;
    const match = node.match(base64Regex);
    if (match) {
      const ext = match[1] === "jpeg" ? "jpg" : match[1];
      const base64Data = match[2];
      const filename = `img_${Date.now()}_${Math.floor(Math.random() * 1000000)}.${ext}`;
      const uploadDir = path.join(process.cwd(), "uploads");
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const filePath = path.join(uploadDir, filename);
      // Write the binary file to disk
      fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
      
      console.log(`Saved base64 image to local file: /uploads/${filename}`);
      return `/uploads/${filename}`;
    }
  } else if (Array.isArray(node)) {
    return node.map(item => processBase64Images(item));
  } else if (node !== null && typeof node === "object") {
    const newNode: any = {};
    for (const key of Object.keys(node)) {
      newNode[key] = processBase64Images(node[key]);
    }
    return newNode;
  }
  return node;
}

// Start Server
async function startServer() {
  // Allow large payloads for base64 image transfers
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Statically serve uploaded files
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  // Log accesses
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });

  // REST API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // Get full database (loaded directly from free cloud Firestore)
  app.get("/api/db", async (req, res) => {
    const dbData = await readDbFromFirestore();
    res.json(dbData);
  });

  // Save/Update any table or state
  app.post("/api/db/save", async (req, res) => {
    try {
      await saveToFirestore(req.body);
      const dbData = await readDbFromFirestore();
      res.json({ success: true, db: dbData });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to save data to Firestore" });
    }
  });

  // Add individual booking (Public Route)
  app.post("/api/db/booking", async (req, res) => {
    try {
      const newBooking = processBase64Images(req.body);
      if (!newBooking || !newBooking.id) {
        return res.status(400).json({ error: "Booking object with an ID is required." });
      }
      await setDoc(doc(db, "bookings", newBooking.id), newBooking);
      res.json({ success: true, booking: newBooking });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to add booking to Firestore" });
    }
  });

  // Add individual lead (Public Route)
  app.post("/api/db/lead", async (req, res) => {
    try {
      const newLead = processBase64Images(req.body);
      if (!newLead || !newLead.id) {
        return res.status(400).json({ error: "Lead object with an ID is required." });
      }
      await setDoc(doc(db, "leads", newLead.id), newLead);
      res.json({ success: true, lead: newLead });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to add lead to Firestore" });
    }
  });

  // Delete an item from database
  app.post("/api/db/delete", async (req, res) => {
    try {
      const { type, id } = req.body;
      if (!type || !id) {
        return res.status(400).json({ error: "Type and ID are required to delete." });
      }
      
      const allowedCollections = ["doctors", "caseStudies", "testimonials", "gallery", "bookings", "leads"];
      if (allowedCollections.includes(type)) {
        await deleteDoc(doc(db, type, id));
        return res.json({ success: true });
      }
      res.status(400).json({ error: `Invalid database type table: ${type}` });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to delete item from Firestore" });
    }
  });

  // Vite Server Integration
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully running on port ${PORT}`);
  });
}

startServer();
