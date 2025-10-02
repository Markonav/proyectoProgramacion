const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const SECRET_KEY = "mi_clave_super_secreta"; // ⚠️ en producción usa process.env

const usersFile = path.join(__dirname, "../data/users.json");

// 🔑 LOGIN
function login(req, res) {
  const { email, password } = req.body;

  const users = JSON.parse(fs.readFileSync(usersFile, "utf-8"));
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  // Crear el token
  const token = jwt.sign(
    { id: user.id, email: user.email }, 
    SECRET_KEY,
    { expiresIn: "2h" } // expira en 2 horas
  );

  return res.json({ message: "Login exitoso", token, user });
}

module.exports = { login };
