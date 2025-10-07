const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");
const session = require("express-session");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");


dotenv.config();
const app = express();

// ---------- Middleware ----------
app.use(express.json());
app.use(cookieParser());

// ---------- Static Folder ----------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------- CORS ----------
const rawOrigins = process.env.FRONTEND_ORIGIN || "";
const allowedOrigins = [
  ...rawOrigins.split(",").map(o => o.trim()).filter(Boolean),
  "http://localhost:5173", // for Vite dev
  "http://localhost:3000", // for CRA dev
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // allow cookies cross-origin
  })
);

// ---------- Session ----------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // cookies only secure in prod
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

// ---------- Routes ----------
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

// ---------- Test Route ----------
app.get("/", (req, res) => {
  res.send("✔️ Backend running successfully (Railway + GitHub Pages)!");
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✔️ Server running on port ${PORT}`));
