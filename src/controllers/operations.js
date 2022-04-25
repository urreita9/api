const { default: axios } = require("axios");

const { User, Caretaker, Operation } = require("../db");

const getOperations = async (req, res) => {
  const { id } = req.params;
  const { user } = req.query; // user true?=> userId ////// user false?=> caretakerId
  try {
    let operations;
    if (user === "true") {
      operations = await Operation.findAll({ where: { userId: id } });
    } else {
      operations = await Operation.findAll({
        where: { caretakerId: id },
      });
    }
    if (!operations) return res.json({ msg: "No operations" });

    res.json(operations);
  } catch (error) {
    res.status(400).json({
      msg: error,
    });
  }
};

const createOperation = async (req, res) => {
  const { buyerId, sellerId, datesRange, price, timeLapse, totalCheckout } =
    req.body;
  console.log(totalCheckout);
  // const caretaker = await Caretaker.findOne({
  // 	where: {
  // 		userId: sellerId,
  // 	},
  // });
  // const { id: caretakerId } = caretaker.dataValues;

  try {
    // aca de la req vamos a sacar los datos de petrip para enviar
    const order = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalCheckout,
          },
          description: "Pettrip service payment",
        },
      ],
      //? QUIEN ME ESTA COBRANDO 🔽
      application_context: {
        brand_name: "Pettrip.com",
        landing_page: "LOGIN",
        user_action: "PAY_NOW",
        return_url: "http://localhost:3001/api/operations/capture-order",
        cancel_url: "http://localhost:3000",
      },
    };

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    const {
      data: { access_token },
    } = await axios.post(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      params,
      {
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
        auth: {
          username:
            "ASQ9t935qCpKlbb8P3b_4ciyOTzQvW0GPJuOTRFxJT2-mwdW3EL_sR-YnjqfllUzssA_k95dCITyQdZK",
          password:
            "ELHmoUIfLFmI6dN59EQIn_IOEID9_Hc9XB7y1IrLLm_TM18Sux4MMe-OlvEEOevVIIyshdR9L5C-Gib0",
        },
      }
    );
    console.log(access_token);
    const response = await axios.post(
      "https://api-m.sandbox.paypal.com/v2/checkout/orders",
      order,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    return res.status(500).send("Algo fallo");
  }

  // const operation = await Operation.create({
  // 	id,
  // 	price,
  // 	timeLapse,
  // 	userId: buyerId,
  // 	caretakerId,
  // });
};

const editOperation = async (req, res) => {
  const { idOperation, idPayment } = req.body;

  try {
    const { data } = await axios.get(
      `https://api.mercadopago.com/merchant_orders/${idPayment}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN_PROD_TEST}`,
        },
      }
    );

    // console.log('data', data);
    const operation = await Operation.findByPk(idOperation);

    if (!operation) return res.status.json({ msg: "Operation does not exist" });

    const updatedOperation = await operation.update({
      ...operation,
      status: data.payments[0].status,
    });

    // console.log('UPDATED OP', updatedOperation);
    res.json(updatedOperation);
  } catch (error) {
    console.log(error);
  }
};

const captureOrder = async (req, res) => {
  const { token } = req.query;

  const response = await axios.post(
    `https://api-m.sandbox.paypal.com/v2/checkout/orders/${token}/capture`,
    {},
    {
      auth: {
        username:
          "ASQ9t935qCpKlbb8P3b_4ciyOTzQvW0GPJuOTRFxJT2-mwdW3EL_sR-YnjqfllUzssA_k95dCITyQdZK",
        password:
          "ELHmoUIfLFmI6dN59EQIn_IOEID9_Hc9XB7y1IrLLm_TM18Sux4MMe-OlvEEOevVIIyshdR9L5C-Gib0",
      },
    }
  );
  console.log(response.data);
  return res.json(response.data);
};

const cancelOrder = async (req, res) => {
  res.redirect("/");
};
module.exports = {
  createOperation,
  getOperations,
  editOperation,
  captureOrder,
  cancelOrder,
};
