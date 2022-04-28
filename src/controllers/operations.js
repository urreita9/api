const { default: axios } = require('axios');
const { DataTypes } = require('sequelize');

const { User, Caretaker, Operation, Pet } = require('../db');
const operation = require('../models/operation');

const verifyStatus = (status) => {
  switch (status) {
    case 'COMPLETED':
      return 'APPROVED';

    default:
      return 'CREATED';
  }
};

const searchOperations = async (operations, user) => {
  user === 'true'
    ? (operations = await Promise.all(
        operations.map(async (operation) => {
          const { caretakerId, petId } = operation;

          const caretaker = await User.findByPk(caretakerId);
          const pet = await Pet.findByPk(petId);

          return {
            operation,
            caretaker,
            pet,
          };
        })
      ))
    : (operations = await Promise.all(
        operations.map(async (operation) => {
          const { userId, petId } = operation;

          const user = await User.findByPk(userId);
          const pet = await Pet.findByPk(petId);

          return {
            operation,
            user,
            pet,
          };
        })
      ));

  return operations;
};

const getOperations = async (req, res) => {
  const uid = req.header('uid');
  const { user } = req.query;
  const userId = req.validUser.id;
  let operations = [];
  console.log(req.header('uid'));

  if (userId !== uid) return res.status(401).json({ msg: 'Unauthorized user' });

  try {
    user === 'true'
      ? (operations = await Operation.findAll({
          where: {
            userId,
          },
        }))
      : (operations = await Operation.findAll({
          where: {
            caretakerId: userId,
          },
        }));

    if (!operations.length) return res.json({ msg: 'Empty operations' });

    const response = await searchOperations(operations, user);

    res.json(response);
  } catch (error) {
    res.json({ msg: error });
  }
};

const createOperation = async (req, res) => {
  const {
    buyerId,
    sellerId,
    timeLapse,
    totalCheckout,
    id,
    petId,
    headers: { uid },
  } = req.body;

  try {
    // aca de la req vamos a sacar los datos de petrip para enviar
    const order = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: totalCheckout,
          },
          description: 'Pettrip service payment',
        },
      ],
      //? QUIEN ME ESTA COBRANDO 🔽
      application_context: {
        brand_name: 'Pettrip.com',
        landing_page: 'LOGIN',
        user_action: 'PAY_NOW',
        return_url: 'http://localhost:3000/newOperation',
        cancel_url: 'http://localhost:3000',
      },
    };

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    const {
      data: { access_token },
    } = await axios.post(
      'https://api-m.sandbox.paypal.com/v1/oauth2/token',
      params,
      {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
        },
        auth: {
          username:
            'ASQ9t935qCpKlbb8P3b_4ciyOTzQvW0GPJuOTRFxJT2-mwdW3EL_sR-YnjqfllUzssA_k95dCITyQdZK',
          password:
            'ELHmoUIfLFmI6dN59EQIn_IOEID9_Hc9XB7y1IrLLm_TM18Sux4MMe-OlvEEOevVIIyshdR9L5C-Gib0',
        },
      }
    );

    const response = await axios.post(
      'https://api-m.sandbox.paypal.com/v2/checkout/orders',
      order,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const operationId = response.data.id;

    await Operation.create({
      //id: operationId,
      operationId,
      price: totalCheckout,
      timeLapse: timeLapse,
      userId: uid,
      caretakerId: id,
      petId,
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).send('Algo fallo', error);
  }
};

const captureOrder = async (req, res) => {
  const { token, PayerID } = req.query;

  try {
    const response = await axios.post(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${token}/capture`,
      {},
      {
        auth: {
          username:
            'ASQ9t935qCpKlbb8P3b_4ciyOTzQvW0GPJuOTRFxJT2-mwdW3EL_sR-YnjqfllUzssA_k95dCITyQdZK',
          password:
            'ELHmoUIfLFmI6dN59EQIn_IOEID9_Hc9XB7y1IrLLm_TM18Sux4MMe-OlvEEOevVIIyshdR9L5C-Gib0',
        },
      }
    );

    const status = verifyStatus(response.data.status);

    const operation = await Operation.findOne({
      where: {
        operationId: token,
      },
    });

    const operationUpdate = await operation.update(
      { status },
      {
        where: {
          operationId: token,
        },
      }
    );

    const { userId, caretakerId, petId } = operation;
    const user = await User.findByPk(userId);
    const caretaker = await User.findByPk(caretakerId, {
      include: [
        {
          model: Caretaker,
        },
      ],
    });
    const pet = await Pet.findByPk(petId);

    res.json({ user, caretaker, operation, pet });
  } catch (error) {
    res.json('fallo capture order', error);
  }
};

const cancelOrder = async (req, res) => {
  res.redirect('/');
};

// const editOperation = async (req, res) => {
//   const { idOperation, idPayment } = req.body;

//   try {
//     const { data } = await axios.get(
//       `https://api.mercadopago.com/merchant_orders/${idPayment}`,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.TOKEN_PROD_TEST}`,
//         },
//       }
//     );

//     // console.log('data', data);
//     const operation = await Operation.findByPk(idOperation);

//     if (!operation) return res.status.json({ msg: "Operation does not exist" });

//     const updatedOperation = await operation.update({
//       ...operation,
//       status: data.payments[0].status,
//     });

//     // console.log('UPDATED OP', updatedOperation);
//     res.json(updatedOperation);
//   } catch (error) {
//     console.log(error);
//   }
// };
module.exports = {
  createOperation,
  getOperations,
  // editOperation,
  captureOrder,
  cancelOrder,
};
