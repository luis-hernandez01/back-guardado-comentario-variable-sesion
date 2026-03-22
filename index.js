const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 10000;


// Leer datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

// 3. CONFIGURACIÓN PARA RENDER (PROXIES)
app.set('trust proxy', 1); // Necesario para que las sesiones funcionen en Render


// Configurar sesión
app.use(session({
  secret: "mi_secreto",
  resave: false,
  saveUninitialized: false, // Mejor false para evitar crear sesiones vacías
  cookie: {
    secure: true,      // DEBE SER true en Render (porque usa HTTPS)
    httpOnly: true,
    sameSite: 'none'   // OBLIGATORIO si el frontend y backend están en dominios distintos
  }
}));

app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀");
});

app.post("/comentarios", (req, res) => {
  const { comentario } = req.body;

  if (!comentario) {
    return res.status(400).json({ error: "Comentario requerido" });
  }

  // Inicializar sesión si no existe
  if (!req.session.comentarios) {
    req.session.comentarios = [];
  }

  // Guardar comentario
  req.session.comentarios.push(comentario);

  res.json({
    message: "Comentario guardado",
    comentarios: req.session.comentarios
  });
});

app.get("/comentarios", (req, res) => {
  res.json({
    comentarios: req.session.comentarios || []
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});