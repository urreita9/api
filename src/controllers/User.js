const { response } = require('express');
const { request } = require('express');
const { User, Pet, Caretaker } = require('../db');
const bcryptjs = require('bcryptjs');

const getUsers = async (req = request, res = response) => {
    const users = await User.findAll({
        include: [
            {
                model: Pet,
            },
            {
                model: Caretaker,
            },
        ],
    });

    res.json(users);
};

const getUser = async (req = request, res = response) => {
    const { id } = req.params;

    const user = await User.findByPk(id, {
        include: [
            {
                model: Pet,
            },
            {
                model: Caretaker,
            },
        ],
    });

    res.json(user);
};

const getUserJWT = async (req = request, res = response) => {
    let { id } = req.params;
    if (!id) {
        id = req.header('uid');
    }

    const user = await User.findByPk(id, {
        include: [
            {
                model: Pet,
            },
            {
                model: Caretaker,
            },
        ],
    });

    res.json(user);
};

const createUser = async (req = request, res = response) => {
    let { name, lastname, email, password } = req.body;

    const user = await User.findOne({
        where: {
            email: email.toLowerCase(),
        },
    });

    if (user) {
        return res.status(400).json(`Email ${email} en uso`);
    } else {
        const salt = bcryptjs.genSaltSync();
        const hashedPassword = bcryptjs.hashSync(password, salt);

        const userCreated = await User.create({
            name: name.toLowerCase(),
            lastname: lastname.toLowerCase(),
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        const { id } = userCreated;
        if (userCreated) {
            return res.status(201).json({ msg: true, id });
        } else {
            return res.status(500).json({ msg: 'Something went wrong' });
        }
    }
};

const editUser = async (req = request, res = response) => {
    const { id } = req.params;
    let { email, points, password, ...resto } = req.body;

    const user = await User.findByPk(id, {
        include: [
            {
                model: Pet,
            },
            {
                model: Caretaker,
            },
        ],
    });
    if (password) {
        password = bcryptjs.hashSync(password, 10);

        resto.password = password;
    }
    for (i in resto) {
        if (i !== 'role' && i !== 'password') {
            resto[i] = resto[i].toLowerCase();
        } else if (i === 'role') {
            resto[i] = resto[i].toUpperCase();
        }
    }
    await user.update(resto);

    res.json(user);
};

const deleteUser = async (req = request, res = response) => {
    const { id } = req.params;

    const user = await User.findByPk(id);
    await user.destroy();

    res.json(user);
};

const checkPassword = async (req = request, res = response) => {
    const { password } = req.body;
    const id = req.header('uid');

    const user = await User.findByPk(id);

    const validPassword = await bcryptjs.compare(password, user.password);

    return res.json(validPassword);
};

module.exports = {
    getUsers,
    getUser,
    getUserJWT,
    createUser,
    editUser,
    deleteUser,
    checkPassword,
};
