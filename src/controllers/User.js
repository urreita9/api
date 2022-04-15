const { response } = require('express');
const { request } = require('express');
const { User, Pet, Caretaker } = require('../db');
const bcryptjs = require('bcryptjs');

const getUsers = async (req = request, res = response) => {
  const users = await User.findAll({
    include: [
      {
        model: Pet,
        attributes: ['id', 'name'],
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
        attributes: ['id', 'name'],
      },
    ],
  });

  res.json(user);
};

const createUser = async (req = request, res = response) => {
  let { email, password, name, lastname, address, points } = req.body;

  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
    },
  });

  if (user) {
    res.status(400).json(`Email ${email} en uso`);
  } else {
    const salt = bcryptjs.genSaltSync();
    password = bcryptjs.hashSync(password, salt);

    const user = await User.create({
      email: email.toLowerCase(),
      password,
      name: name.toLowerCase(),
      lastname: lastname.toLowerCase(),
      address,
      points,
    });


    if (user) {
        res.status(400).json(`Email ${email} en uso`);
    } else {
        // const salt = bcryptjs.genSaltSync();
        password = bcryptjs.hashSync(password, 10);

        const user = await User.create({
            email: email.toLowerCase(),
            password,
        });

        const { email: ems, id } = user;

        // res.json({ ems, id });

        res.json(user);
    }

};

const editUser = async (req = request, res = response) => {
  const { id } = req.params;
  let { email, points, password, ...resto } = req.body;

    const user = await User.findByPk(id);
    if (password) {
        password = bcryptjs.hashSync(password, 10);

        resto.password = password;
    }
    for (i in resto) {
        if (i !== "role" && i !== "password") {
            resto[i] = resto[i].toLowerCase();
        } else if (i === "role") {
            resto[i] = resto[i].toUpperCase();
        }
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

module.exports = {
  getUsers,
  getUser,
  createUser,
  editUser,
  deleteUser,
};
