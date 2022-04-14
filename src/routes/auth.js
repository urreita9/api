const { Router } = require("express");
const { check, body } = require("express-validator");
const { login } = require("../controllers/Auth");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

//Login
router.post(
    "/login",
    [check("email", "El correo es obligatorio").isEmail(), check("password", "La contraseña es obligatoria").not().isEmpty(), validarCampos],
    login
);

module.exports = router;
