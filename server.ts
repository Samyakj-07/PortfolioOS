import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Resolve __dirname in ES Modules environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory sessions store
const activeSessions = new Set<string>();

// Middlewares
app.use(cors({
  origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Interface for Inquiry
interface IInquiry {
  name: string;
  email: string;
  projectType: string;
  message: string;
  createdAt: Date;
}

// Database Connection Flags
let isMongoConnected = false;
let InquiryModel: mongoose.Model<IInquiry & mongoose.Document>;

interface IContent {
  heroName: string;
  heroTitle: string;
  heroBio: string;
  projectTitle: string;
  projectCategory: string;
  projectSummary: string;
  projectDescription: string;
  projectStack: string[];
  projectGithub: string;
  projectDemo: string;
  projectImage: string;
}

let ContentModel: mongoose.Model<IContent & mongoose.Document>;

// JSON Fallback parameters
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'inquiries.json');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');

const DEFAULT_CONTENT: IContent = {
  heroName: 'Samyak Jain',
  heroTitle: 'Developer • Builder • Maker',
  heroBio: 'I build high-performance web applications, explore AI integrations, and design interactive user interfaces. Currently focusing on environmental engineering solutions and responsive full-stack architecture.',
  projectTitle: 'HexGrid Goa',
  projectCategory: 'Environmental Tech Platform',
  projectSummary: 'Turning coastal beach cleanups into a trackable, verifiable, and rewarding live hex-grid system.',
  projectDescription: 'HexGrid Goa divides coastlines into a live hex-grid. Volunteers submit before/after scans of locations, which are verified via AI-assisted review with human fallback. Cleansed areas update a shared public map, rewarding contributors with impact points, faction progress, and leaderboard recognition to solve low visibility, low trust, and volunteer retention in environmental efforts.',
  projectStack: ['React', 'TypeScript', 'Tailwind CSS', 'Leaflet', 'Node.js', 'TensorFlow.js'],
  projectGithub: 'https://github.com/Samyakj-07/HexGrid-Goa.git',
  projectDemo: 'https://hexgrid-goa.vercel.app',
  projectImage: '/hexgrid-goa.png'
};

// Initialize local JSON databases if fallback is needed
const initJsonDb = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
  if (!fs.existsSync(CONTENT_FILE)) {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(DEFAULT_CONTENT, null, 2), 'utf-8');
  }
};

// Connect to MongoDB if MONGODB_URI is provided
const mongoUri = process.env.MONGODB_URI;

if (mongoUri && mongoUri.trim() !== '') {
  console.log('Attempting to connect to MongoDB...');
  mongoose.connect(mongoUri)
    .then(async () => {
      console.log('Successfully connected to MongoDB.');
      isMongoConnected = true;

      // Define Inquiry Schema
      const inquirySchema = new mongoose.Schema<IInquiry>({
        name: { type: String, required: true },
        email: { type: String, required: true },
        projectType: { type: String, required: true },
        message: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      });
      InquiryModel = mongoose.model<IInquiry & mongoose.Document>('Inquiry', inquirySchema);

      // Define Content Schema
      const contentSchema = new mongoose.Schema<IContent>({
        heroName: { type: String, default: DEFAULT_CONTENT.heroName },
        heroTitle: { type: String, default: DEFAULT_CONTENT.heroTitle },
        heroBio: { type: String, default: DEFAULT_CONTENT.heroBio },
        projectTitle: { type: String, default: DEFAULT_CONTENT.projectTitle },
        projectCategory: { type: String, default: DEFAULT_CONTENT.projectCategory },
        projectSummary: { type: String, default: DEFAULT_CONTENT.projectSummary },
        projectDescription: { type: String, default: DEFAULT_CONTENT.projectDescription },
        projectStack: [{ type: String }],
        projectGithub: { type: String, default: DEFAULT_CONTENT.projectGithub },
        projectDemo: { type: String, default: DEFAULT_CONTENT.projectDemo },
        projectImage: { type: String, default: DEFAULT_CONTENT.projectImage }
      });
      ContentModel = mongoose.model<IContent & mongoose.Document>('Content', contentSchema);

      // Seed if empty
      try {
        const doc = await ContentModel.findOne();
        if (!doc) {
          const newDoc = new ContentModel(DEFAULT_CONTENT);
          await newDoc.save();
          console.log('Seeded default portfolio content in MongoDB.');
        }
      } catch (err) {
        console.error('Error seeding MongoDB:', err);
      }
    })
    .catch((err) => {
      console.error('MongoDB connection error. Falling back to local JSON database.', err);
      initJsonDb();
    });
} else {
  console.log('No MONGODB_URI configured. Initializing local JSON database...');
  initJsonDb();
}

// Email Transporter setup (Optional)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ==========================================
// API Endpoints
// ==========================================

// ==========================================
// Authentication Middleware & Session Logic
// ==========================================
const authMiddleware = (req: Request, res: Response, next: any): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Unauthorized. Missing token.' });
    return;
  }
  const token = authHeader.split(' ')[1];
  if (activeSessions.has(token)) {
    next();
  } else {
    res.status(401).json({ success: false, error: 'Unauthorized. Invalid or expired token.' });
  }
};

// POST: Admin Login
app.post('/api/login', (req: Request, res: Response): void => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';

  if (username === adminUser && password === adminPass) {
    const token = crypto.randomBytes(32).toString('hex');
    activeSessions.add(token);
    res.status(200).json({ success: true, token });
  } else {
    res.status(401).json({ success: false, error: 'Invalid username or password.' });
  }
});

// GET: Fetch portfolio content
app.get('/api/content', async (_req: Request, res: Response): Promise<void> => {
  try {
    if (isMongoConnected && ContentModel) {
      const content = await ContentModel.findOne();
      if (content) {
        res.status(200).json({ success: true, data: content });
        return;
      }
    }
    // Fallback
    initJsonDb();
    const rawData = fs.readFileSync(CONTENT_FILE, 'utf-8');
    const content = JSON.parse(rawData);
    res.status(200).json({ success: true, data: content });
  } catch (error: any) {
    console.error('Error fetching content:', error);
    res.status(200).json({ success: true, data: DEFAULT_CONTENT });
  }
});

// POST: Update portfolio content (Protected)
app.post('/api/content', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedData = req.body;
    if (isMongoConnected && ContentModel) {
      let content = await ContentModel.findOne();
      if (content) {
        Object.assign(content, updatedData);
        await content.save();
      } else {
        content = new ContentModel(updatedData);
        await content.save();
      }
    }
    // Save to JSON fallback
    initJsonDb();
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(updatedData, null, 2), 'utf-8');

    console.log('Saved updated portfolio content.');
    res.status(200).json({ success: true, message: 'Content successfully updated!' });
  } catch (error: any) {
    console.error('Error updating content:', error);
    res.status(500).json({ success: false, error: 'Server error saving content.' });
  }
});

// POST: Submit a new inquiry
app.post('/api/inquiries', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, projectType, message } = req.body;

    // Simple validation
    if (!name || !email || !projectType || !message) {
      res.status(400).json({ success: false, error: 'All fields are required.' });
      return;
    }

    // Email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
      return;
    }

    const newInquiry = {
      name: name.trim(),
      email: email.trim(),
      projectType: projectType.trim(),
      message: message.trim(),
      createdAt: new Date()
    };

    if (isMongoConnected && InquiryModel) {
      // Save to MongoDB
      const dbInquiry = new InquiryModel(newInquiry);
      await dbInquiry.save();
      console.log('Saved inquiry to MongoDB:', newInquiry.email);
    } else {
      // Save to JSON fallback file
      initJsonDb();
      const rawData = fs.readFileSync(DB_FILE, 'utf-8');
      const inquiries = JSON.parse(rawData);
      
      inquiries.push({
        id: Date.now().toString(),
        ...newInquiry
      });

      fs.writeFileSync(DB_FILE, JSON.stringify(inquiries, null, 2), 'utf-8');
      console.log('Saved inquiry to local JSON database:', newInquiry.email);
    }

    // Send email notification if configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await transporter.sendMail({
          from: `"Portfolio Alerts" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_USER, // Send to yourself
          subject: `New Inquiry from ${newInquiry.name}`,
          text: `You have a new inquiry!\n\nName: ${newInquiry.name}\nEmail: ${newInquiry.email}\nProject Type: ${newInquiry.projectType}\nMessage:\n${newInquiry.message}`,
          html: `<h3>New Inquiry Received</h3>
                 <p><strong>Name:</strong> ${newInquiry.name}</p>
                 <p><strong>Email:</strong> ${newInquiry.email}</p>
                 <p><strong>Project Type:</strong> ${newInquiry.projectType}</p>
                 <p><strong>Message:</strong></p>
                 <p>${newInquiry.message.replace(/\n/g, '<br>')}</p>`
        });
        console.log('Email notification sent for inquiry:', newInquiry.email);
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
      }
    }

    res.status(201).json({ success: true, message: 'Inquiry successfully submitted!' });
  } catch (error: any) {
    console.error('Error saving inquiry:', error);
    res.status(500).json({ success: false, error: 'Server error processing your inquiry.' });
  }
});

// GET: Retrieve inquiries (Protected, only for dashboard)
app.get('/api/inquiries', authMiddleware, async (_req: Request, res: Response) => {
  try {
    if (isMongoConnected && InquiryModel) {
      const inquiries = await InquiryModel.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, count: inquiries.length, data: inquiries });
    } else {
      initJsonDb();
      const rawData = fs.readFileSync(DB_FILE, 'utf-8');
      const inquiries = JSON.parse(rawData);
      // Sort inquiries by date desc (latest first)
      const sortedInquiries = [...inquiries].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      res.status(200).json({ success: true, count: sortedInquiries.length, data: sortedInquiries });
    }
  } catch (error: any) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ success: false, error: 'Server error retrieving inquiries.' });
  }
});

// Start Server
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`[SERVER ACTIVE] Running on http://localhost:${PORT}`);
});
