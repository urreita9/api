const { Router } = require("express");
const { check, body } = require("express-validator");
const { existeUsuarioPorId, existePetPorId } = require("../helpers/db-validators");
const { validarCampos } = require("../middlewares/validar-campos");
const { getPets, getPet, createPet, editPet, deletePet } = require("../controllers/Pet");
const { sizeValidator } = require("../helpers/validar-pet");

const router = Router();

//OBTENER TODOS LOS Pets
router.get("/", getPets);

//OBTENER UN USER POR ID
router.get("/:id", [check("id", "ID no valido").isUUID(), check("id").custom(existePetPorId), validarCampos], getPet);

//CREAR UN USER
router.post(
    "/",
    [
        check("name", "Debe tener un nombre").notEmpty(),
        check("userId", "Debe tener un usuario").notEmpty(),
        check("userId", "Debe tener un usuario").isUUID(),
        check("userId").custom(existeUsuarioPorId),
        body("age", "Debe ser un entero menor a 25 años").if(body("age").exists()).isInt({ gt: 0, lt: 26 }),
        body("size", "No existe ese tamaño").if(body("size").exists()).custom(sizeValidator),
        body("race", "La raza debe ser un string").if(body("race").exists()).isString(),
        body("specialFood", "Solo se aceptan valores booleanos para specialFood").if(body("specialFood").exists()).isBoolean(),
        validarCampos,
    ],
    createPet
);

//EDITAR UN USER
router.put(
    "/:id",
    [
        check("id", "ID no valido").isUUID(),
        check("id").custom(existePetPorId),
        body("age", "Debe ser un entero menor a 25 años").if(body("age").exists()).isInt({ gt: 0, lt: 26 }),
        body("size", "No existe ese tamaño").if(body("size").exists()).custom(sizeValidator),
        body("race", "La raza debe ser un string").if(body("race").exists()).isString(),
        body("specialFood", "Solo se aceptan valores booleanos para specialFood").if(body("specialFood").exists()).isBoolean(),
        validarCampos,
    ],
    editPet
);

//BORRAR UN USER
router.delete("/:id", [check("id", "ID no valido").isUUID(), check("id").custom(existePetPorId), validarCampos], deletePet);

module.exports = router;
