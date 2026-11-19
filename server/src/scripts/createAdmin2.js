import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "../config/db.js";
import User from "../models/userModel.js";

/* ================= PATH ================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================= CONFIG ================= */

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

/* ================= CREATE ADMIN 2 ================= */

const createAdmin2 = async () => {
  try {
    /* Vérification de MONGO_URI */
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI est introuvable. Vérifie le fichier server/.env",
      );
    }

    /* CONNECT DATABASE */
    await connectDB();

    console.log("MongoDB connecté");

    /* ADMIN 2 */
    const adminEmail = "admin2@plateforme.com";
    const adminPassword = "Admin2026@123";

    /* CHECK IF ADMIN EXISTS */
    const adminExists = await User.findOne({
      email: adminEmail.toLowerCase(),
    });

    if (adminExists) {
      console.log("Admin 2 existe déjà");

      await mongoose.connection.close();
      process.exit(0);
    }

    /* HASH PASSWORD */
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    /* CREATE ADMIN */
    const admin = await User.create({
      firstName: "Admin",
      lastName: "Deux",
      email: adminEmail.toLowerCase(),
      phone: "0700000001",
      sexe: "homme",
      formation: "Administration",
      password: hashedPassword,
      role: "admin",
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
    });

    console.log("=================================");
    console.log("Admin 2 créé avec succès");
    console.log("=================================");

    console.log({
      id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      role: admin.role,
    });

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("Erreur création admin 2 :");
    console.error(error.message);

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
};

/* ================= EXECUTE ================= */

createAdmin2();
