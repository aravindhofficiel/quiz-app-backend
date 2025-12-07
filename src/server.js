require("dotenv").config();
const app = require("./app");
const knex = require("./config/db"); // <-- IMPORTANT
const adminRoutes = require("./routes/adminRoutes");

const PORT = process.env.PORT || 4000;

// Auto-run migrations on Render startup
knex.migrate.latest()
  .then(() => {
    console.log("✅ Migrations completed");
    app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  });

app.use("/api/admin", adminRoutes);
