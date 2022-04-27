const { Router } = require("express");
const { check, body } = require("express-validator");
const { login, googleLogin } = require("../controllers/Auth");
const { validarCampos } = require("../middlewares/validar-campos");
const bcryptjs = require('bcryptjs');

const router = Router();

//Login
router.post(
    "/login",
    [check("email", "El correo es obligatorio").isEmail(), check("password", "La contraseña es obligatoria").not().isEmpty(), validarCampos],
    login
);

router.post("/googlelogin", googleLogin)

module.exports = router;
