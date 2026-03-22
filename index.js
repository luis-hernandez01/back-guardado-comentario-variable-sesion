const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;


// Leer datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({
  origin: "*", // URL de tu frontend
  methods: ["GET", "POST"],
  credentials: true
}));

// Configurar sesión
app.use(session({
  secret: "mi_secreto",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,      // true solo en HTTPS
    httpOnly: true
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

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});