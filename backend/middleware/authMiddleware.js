const { verificarToken: verifyTokenHelper } = require("../controllers/authController");

function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try {
    const decoded = verifyTokenHelper(token);
    req.user = decoded; // guarda los datos del usuario para usarlos en el controlador  
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}

module.exports = { verificarToken };
