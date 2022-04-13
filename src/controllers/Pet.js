const { response } = require("express");
const { request } = require("express");
const { User, Pet } = require("../db");

const getPets = async (req = request, res = response) => {
    const pets = await Pet.findAll({
        include: [
            {
                model: User,
                attributes: ["id", "name"],
            },
        ],
    });

    res.json(pets);
};

const getPet = async (req = request, res = response) => {
    const { id } = req.params;

    const pet = await Pet.findByPk(id, {
        include: [
            {
                model: User,
                attributes: ["id", "name"],
            },
        ],
    });

    res.json(pet);
};

const createPet = async (req = request, res = response) => {
    const body = req.body;

    for (i in body) {
        if (i !== "size" && typeof body[i] === "string") {
            body[i] = body[i].toLowerCase();
        } else if (i === "size") {
            body[i] = body[i].toUpperCase();
        }
    }
    const pet = await Pet.create(body);

    res.json(pet);
};

const editPet = async (req = request, res = response) => {
    const { id, userId, ...body } = req.body;
    const idk = req.params.id;

    const pet = await Pet.findByPk(idk);

    for (i in body) {
        if (i !== "size" && typeof body[i] === "string") {
            body[i] = body[i].toLowerCase();
        } else if (i === "size") {
            body[i] = body[i].toUpperCase();
        }
    }

    await pet.update(body);

    res.json(pet);
};

const deletePet = async (req = request, res = response) => {
    const id = req.params.id;

    const pet = await Pet.findByPk(id);
    await pet.destroy();

    res.json(pet);
};

module.exports = {
    getPets,
    getPet,
    createPet,
    editPet,
    deletePet,
};
