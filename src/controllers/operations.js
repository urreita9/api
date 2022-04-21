const { default: axios } = require('axios');
const { response } = require('express');
const { request } = require('express');
const mercadopago = require('mercadopago');
const { User, Caretaker, Operation } = require('../db');

mercadopago.configure({
	access_token: process.env.TOKEN_PROD_TEST,
});

const getOperationsById = async (req, res) => {
	const { id } = req.params;
	const { user } = req.query; // user true?=> userId ////// user false?=> caretakerId
	try {
		let operations;
		if (user === 'true') {
			operations = await Operation.findAll({ where: { userId: id } });
		} else {
			operations = await Operation.findAll({
				where: { caretakerId: id },
			});
		}
		if (!operations) return res.json({ msg: 'No operations' });

		res.json(operations);
	} catch (error) {
		res.status(400).json({
			msg: error,
		});
	}
};

const createOperation = async (req, res) => {
	const { buyerId, sellerId, datesRange, price, timeLapse } = req.body;

	const caretaker = await Caretaker.findOne({
		where: {
			userId: sellerId,
		},
	});

	const { id: caretakerId } = caretaker.dataValues;

	let preference = {
		items: [
			{
				title: 'Petrip Reservation',
				unit_price: price,
				quantity: timeLapse,
			},
		],
		back_urls: {
			success: 'http://localhost:3000/operation',
			failure: 'http://localhost:3000',
			pending: 'http://localhost:3000',
		},
		payer: {
			name: 'Juan',
			surname: 'Lopez',
			email: 'test_user_73703636@testuser.com',
		},
		payment_methods: {
			excluded_payment_types: [
				{
					id: 'ticket',
				},
			],
			installments: 1,
		},
	};
	const response = await mercadopago.preferences.create(preference);

	const id = response.response.id;

	const operation = await Operation.create({
		id,
		price,
		timeLapse,
		userId: buyerId,
		caretakerId,
	});

	res.json({ operation, response: response.response });
};

const editOperation = async (req, res) => {
	const { id } = req.body;

	try {
		const status = await axios.get(
			`https://api.mercadopago.com/merchant_orders/${id}`,
			{
				headers: {
					Authorization: `Bearer ${process.env.TOKEN_PROD_TEST}`,
				},
			}
		);

		console.log('EDIT OP', status.data);
	} catch (error) {
		console.log(error);
	}

	// const operation = await Operation.findByPk(id);
	// //  'https://api.mercadopago.com/merchant_orders/{id}' \
	// //     -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'

	// const updatedOperation = await operation.update({
	// 	status,
	// });

	// res.json(updatedOperation);
};

module.exports = {
	createOperation,
	getOperationsById,
	editOperation,
};

const mockUser1 = {
	id: 1109688142,
	nickname: 'TEST4OSXIB7J',
	password: 'qatest981',
	site_status: 'active',
	email: 'test_user_49681815@testuser.com',
};

const mockUser2 = {
	id: 1109692263,
	nickname: 'TESTVNPZFVR2',
	password: 'qatest9890',
	site_status: 'active',
	email: 'test_user_73703636@testuser.com',
};
