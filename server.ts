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

// Helper to read DB state
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const defaultDb = {
        heroDoctorImageUrl: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=600",
        doctors: initialDoctors,
        caseStudies: initialCaseStudies,
        testimonials: initialTestimonials,
        gallery: initialGallery,
        bookings: [],
        leads: []
      };
      writeDb(defaultDb);
      return defaultDb;
    }
    const content = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error("Error reading database:", err);
    return {
      heroDoctorImageUrl: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=600",
      doctors: [],
      caseStudies: [],
      testimonials: [],
      gallery: [],
      bookings: [],
      leads: []
    };
  }
}

// Helper block to do atomic write
function writeDb(data: any) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tempFile = DB_FILE + ".tmp";
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error("Error writing to database:", err);
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

  // Get full database
  app.get("/api/db", (req, res) => {
    const db = readDb();
    res.json(db);
  });

  // Save/Update any table or state
  app.post("/api/db/save", (req, res) => {
    try {
      const { heroDoctorImageUrl, doctors, caseStudies, testimonials, gallery, bookings, leads } = req.body;
      const db = readDb();

      if (heroDoctorImageUrl !== undefined) db.heroDoctorImageUrl = processBase64Images(heroDoctorImageUrl);
      if (doctors !== undefined) db.doctors = processBase64Images(doctors);
      if (caseStudies !== undefined) db.caseStudies = processBase64Images(caseStudies);
      if (testimonials !== undefined) db.testimonials = processBase64Images(testimonials);
      if (gallery !== undefined) db.gallery = processBase64Images(gallery);
      if (bookings !== undefined) db.bookings = processBase64Images(bookings);
      if (leads !== undefined) db.leads = processBase64Images(leads);

      writeDb(db);
      res.json({ success: true, db });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to save data" });
    }
  });

  // Add individual booking (Public Route)
  app.post("/api/db/booking", (req, res) => {
    try {
      const newBooking = processBase64Images(req.body);
      if (!newBooking || !newBooking.id) {
        return res.status(400).json({ error: "Booking object with an ID is required." });
      }
      const db = readDb();
      // Avoid duplicate IDs
      db.bookings = [newBooking, ...db.bookings.filter((b: any) => b.id !== newBooking.id)];
      writeDb(db);
      res.json({ success: true, booking: newBooking });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to add booking" });
    }
  });

  // Add individual lead (Public Route)
  app.post("/api/db/lead", (req, res) => {
    try {
      const newLead = processBase64Images(req.body);
      if (!newLead || !newLead.id) {
        return res.status(400).json({ error: "Lead object with an ID is required." });
      }
      const db = readDb();
      // Avoid duplicate IDs
      db.leads = [newLead, ...db.leads.filter((l: any) => l.id !== newLead.id)];
      writeDb(db);
      res.json({ success: true, lead: newLead });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to add lead" });
    }
  });

  // Delete an item from database
  app.post("/api/db/delete", (req, res) => {
    try {
      const { type, id } = req.body;
      if (!type || !id) {
        return res.status(400).json({ error: "Type and ID are required to delete." });
      }
      const db = readDb();
      if (db[type] && Array.isArray(db[type])) {
        db[type] = db[type].filter((item: any) => item.id !== id);
        writeDb(db);
        return res.json({ success: true, db });
      }
      res.status(400).json({ error: `Invalid database type table: ${type}` });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to delete item" });
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
