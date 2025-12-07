require('dotenv').config();
const app = require('./app');  
const adminRoutes = require("./routes/adminRoutes");

 // <-- very important

const port = process.env.PORT || 4000;
app.use("/api/admin", adminRoutes);

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
