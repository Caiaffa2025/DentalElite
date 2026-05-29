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
    beforeImg: "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&q=80&w=600",
    afterImg: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600",
    dentist: "Dra. Beatriz Menezes"
  },
  {
    id: "clareamento",
    title: "Clareamento Violeta de Alta Eficácia",
    specialty: "Estética / Clareamento Premium",
    patientInitials: "L.A.T, 28 anos",
    beforeImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
    afterImg: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=600",
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
    imageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600",
    caption: "Consultório odontológico equipado com tecnologia 3D alemã"
  },
  {
    id: "gal2",
    imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600",
    caption: "Recepção aconchegante e confortável para nossos pacientes"
  },
  {
    id: "gal3",
    imageUrl: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=600",
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
    
    // Seed settings if missing
    if (!settingsSnapshot.exists()) {
      console.log("Firestore settings not found. Seeding initial settings...");
      await setDoc(settingsDocRef, {
        heroDoctorImageUrl: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=600"
      });
    }

    // Seed missing collections individually to prevent empty states
    const docsSnapshot = await getDocs(collection(db, "doctors"));
    let doctors = docsSnapshot.docs.map(docSnap => docSnap.data());
    if (doctors.length === 0) {
      console.log("Doctors collection is empty. Auto-seeding initial doctors...");
      for (const d of initialDoctors) {
        await setDoc(doc(db, "doctors", d.id), d);
      }
      doctors = initialDoctors;
    }

    const casesSnapshot = await getDocs(collection(db, "caseStudies"));
    let caseStudies = casesSnapshot.docs.map(docSnap => docSnap.data());
    if (caseStudies.length === 0) {
      console.log("Case studies collection is empty. Auto-seeding initial case studies...");
      for (const c of initialCaseStudies) {
        await setDoc(doc(db, "caseStudies", c.id), c);
      }
      caseStudies = initialCaseStudies;
    }

    const testimonialsSnapshot = await getDocs(collection(db, "testimonials"));
    let testimonials = testimonialsSnapshot.docs.map(docSnap => docSnap.data());
    if (testimonials.length === 0) {
      console.log("Testimonials collection is empty. Auto-seeding initial testimonials...");
      for (const t of initialTestimonials) {
        await setDoc(doc(db, "testimonials", t.id), t);
      }
      testimonials = initialTestimonials;
    }

    const gallerySnapshot = await getDocs(collection(db, "gallery"));
    let gallery = gallerySnapshot.docs.map(docSnap => docSnap.data());
    if (gallery.length === 0) {
      console.log("Gallery collection is empty. Auto-seeding initial gallery...");
      for (const g of initialGallery) {
        await setDoc(doc(db, "gallery", g.id), g);
      }
      gallery = initialGallery;
    }

    // Load final data
    const settingsData = (await getDoc(settingsDocRef)).data();
    const heroDoctorImageUrl = settingsData?.heroDoctorImageUrl || "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=600";

    const bookingsSnapshot = await getDocs(collection(db, "bookings"));
    const bookings = bookingsSnapshot.docs.map(docSnap => docSnap.data());

    const leadsSnapshot = await getDocs(collection(db, "leads"));
    const leads = leadsSnapshot.docs.map(docSnap => docSnap.data());

    return {
      heroDoctorImageUrl,
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
      heroDoctorImageUrl: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=600",
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

// Helper to process images (no-op as we store compressed base64 strings directly in our cloud Firestore database)
function processBase64Images(node: any): any {
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
