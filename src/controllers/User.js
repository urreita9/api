require("dotenv").config();
const nodemailer = require("nodemailer");
const { response } = require("express");
const { request } = require("express");
const { User, Pet, Caretaker, Image } = require("../db");
const bcryptjs = require("bcryptjs");

const getUsers = async (req = request, res = response) => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
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

const getUsersAdmin = async (req = request, res = response) => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
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
    attributes: { exclude: ["password"] },
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
    id = req.header("uid");
  }

  const user = await User.findByPk(id, {
    attributes: { exclude: ["password"] },
    include: [
      {
        model: Pet,
      },
      {
        model: Caretaker,
        include: [
          {
            model: Image,
          },
        ],
      },
    ],
  });

  res.json(user);
};

const createUser = async (req = request, res = response) => {
  let { name, lastname, email, password } = req.body;

  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.gmail,
      pass: process.env.pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let details = {
    from: process.env.gmail,
    to: email,
    subject: "Welcome to pettrip!",
    text: `Welcome to pettrip, ${name} ${lastname}! you have successfully created your account with the email ${email}.`,
  };

  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
    },
  });

  if (user) {
    return res.status(400).json({ msg: `Email ${email} en uso`, state: false });
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
      mailTransporter.sendMail(details, (error) => {
        if (error) {
          console.log(error.message);
        } else {
          console.log(`email sent`);
        }
      });
      return res.status(201).json({ state: true });
    } else {
      return res
        .status(500)
        .json({ state: false, msg: "Something went wrong" });
    }
  }
};

const editUser = async (req = request, res = response) => {
  const { id } = req.params;
  let { email, points, password, rol, ...resto } = req.body;

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
  await user.update(resto);

  res.json(user);
};

const setPassword = async (req = request, res = response) => {
  const { id } = req.params;
  let { password } = req.body;

  const user = await User.findByPk(id);

  password = bcryptjs.hashSync(password, 10);

  await user.update({ password, passwordsetted: true });

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
  const id = req.header("uid");

  const user = await User.findByPk(id);

  const validPassword = await bcryptjs.compare(password, user.password);

  return res.json(validPassword);
};

const createSuperAdmin = async (req = request, res = response) => {
  let { name, lastname, email, password, supperPass } = req.body;

  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
    },
  });

  if (supperPass === process.env.SUPERADMIN_PASS) {
    if (user) {
      return res
        .status(400)
        .json({ msg: `Email ${email} en uso`, state: false });
    } else {
      const salt = bcryptjs.genSaltSync();
      const hashedPassword = bcryptjs.hashSync(password, salt);

      const userCreated = await User.create({
        name: name.toLowerCase(),
        lastname: lastname.toLowerCase(),
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "SUPER_ADMIN",
      });

      return res.status(201).json({ state: true });
    }
  } else {
    res.status(400).json({ state: false, msg: "Wrong credentials" });
  }
};

const createAdmin = async (req = request, res = response) => {
  let { name, lastname, email, password } = req.body;

  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
    },
  });

  if (user) {
    return res.status(400).json({ msg: `Email ${email} en uso`, state: false });
  } else {
    const salt = bcryptjs.genSaltSync();
    const hashedPassword = bcryptjs.hashSync(password, salt);

    const userCreated = await User.create({
      name: name.toLowerCase(),
      lastname: lastname.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "ADMIN",
    });

    return res.status(201).json({ state: true });
  }
};

const beAdmin = async (req = request, res = response) => {
  const { userId } = req.body;

  const user = await User.findByPk(userId);

  if (user.role !== "SUPER_ADMIN") {
    await user.update({ role: "ADMIN" });

    res.json({ state: true });
  } else {
    res.json({
      state: false,
      msg: "No puede cambiar el Rol de un SUPER_ADMIN",
    });
  }
};

const beUser = async (req = request, res = response) => {
  const { userId } = req.body;

  const user = await User.findByPk(userId);

  if (user.role !== "SUPER_ADMIN") {
    await user.update({ role: "USER" });

    res.json({ state: true });
  } else {
    res.json({
      state: false,
      msg: "No puede cambiar el Rol de un SUPER_ADMIN",
    });
  }
};

const banUser = async (req = request, res = response) => {
  const { userId } = req.body;
  const validUser = req.validUser;
  const user = await User.findByPk(userId);

  if (validUser.role === "SUPER_ADMIN") {
    if (user.role === "SUPER_ADMIN") {
      res
        .status(400)
        .json({ state: false, msg: "No puede aplicar ban a un SUPER_ADMIN" });
    } else {
      await user.update({ banned: true });

      res.json({ state: true });
    }
  } else if (validUser.role === "ADMIN") {
    if (user.role === "SUPER_ADMIN" || user.role === "ADMIN") {
      res.status(400).json({
        state: false,
        msg: "No tiene permisos para aplicar ban a este usuario por jerarquia",
      });
    } else {
      await user.update({ banned: true });

      res.json({ state: true });
    }
  }
};

const unBanUser = async (req = request, res = response) => {
  const { userId } = req.body;
  const validUser = req.validUser;
  const user = await User.findByPk(userId);

  if (validUser.role === "SUPER_ADMIN") {
    if (user.role === "SUPER_ADMIN") {
      res
        .status(400)
        .json({ state: false, msg: "No puede aplicar unban a un SUPER_ADMIN" });
    } else {
      await user.update({ banned: false });

      res.json({ state: true });
    }
  } else if (validUser.role === "ADMIN") {
    if (user.role === "SUPER_ADMIN" || user.role === "ADMIN") {
      res.status(400).json({
        state: false,
        msg: "No tiene permisos para aplicar unban a este usuario por jerarquia",
      });
    } else {
      await user.update({ banned: false });

      res.json({ state: true });
    }
  }
};

module.exports = {
  getUsers,
  getUser,
  getUserJWT,
  createUser,
  editUser,
  deleteUser,
  checkPassword,
  createSuperAdmin,
  createAdmin,
  beAdmin,
  beUser,
  banUser,
  unBanUser,
  getUsersAdmin,
  setPassword,
};
