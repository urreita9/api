const { response } = require('express');
const { request } = require('express');
const { User, Pet } = require('../db');
const { generarJWT } = require('../helpers/generar-jwt');
const bcryptjs = require('bcryptjs');

const login = async (req = request, res = response) => {
	const { email, password, remember } = req.body;

	try {
		//Verificar si el email existe
		const user = await User.findOne({ where: { email } });
		if (!user) {
			return res.status(400).json({ msg: 'Wrong user or password' });
		}
		//Verificar contraseña
		const validPassword = await bcryptjs.compare(password, user.password);

		if (!validPassword) {
			return res.status(400).json({ msg: 'Wrong user or password' });
		}

		if (user.banned) {
			return res.status(400).json({ msg: 'This Account has been suspended' });
		}

		var token = '';
		// Generar JWT
		if (remember) {
			token = await generarJWT(user.id);
		} else {
			token = await generarJWT(user.id, '24h');
		}

		const id = user.id;
		res.json({ token, id });
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'Ocurrio un error',
		});
	}
};

const googleLogin = async (req = request, res = response) => {
	const { email, name, lastname, img, remember } = req.body;

	try {
		//Verificar si el email existe
		const user = await User.findOne({ where: { email } });
		if (!user) {
			//CREACION DE CUENTA
			const salt = bcryptjs.genSaltSync();
			const hashedPassword = bcryptjs.hashSync(name, salt);

			const user = await User.create({
				name: name.toLowerCase(),
				lastname: lastname.toLowerCase(),
				email: email.toLowerCase(),
				password: hashedPassword,
				img: img,
				google: true,
				passwordsetted: false,
			});

			// Generar JWT

			const token = await generarJWT(user.id);

			const id = user.id;
			res.json({ token, id });
		} else {
			var token = '';
			// Generar JWT
			if (remember) {
				token = await generarJWT(user.id);
			} else {
				token = await generarJWT(user.id, '24h');
			}

			const id = user.id;
			res.json({ token, id });
		}
		//Verificar contraseña
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'Ocurrio un error',
		});
	}
};

module.exports = {
	login,
	googleLogin,
};
