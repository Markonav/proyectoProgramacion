const app = require('./app/app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`📚 Libreria Digital corriendo en http://localhost:${PORT}`);
});