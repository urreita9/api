const { default: axios } = require("axios");
const { DataTypes } = require("sequelize");

const { User, Caretaker, Operation } = require("../db");

// const getOperations = async (req, res) => {
//   const { id } = req.params;
//   const { user } = req.query; // user true?=> userId ////// user false?=> caretakerId
//   try {
//     let operations;
//     if (user === "true") {
//       operations = await Operation.findAll({ where: { userId: id } });
//     } else {
//       operations = await Operation.findAll({
//         where: { caretakerId: id },
//       });
//     }
//     if (!operations) return res.json({ msg: "No operations" });

//     res.json(operations);
//   } catch (error) {
//     res.status(400).json({
//       msg: error,
//     });
//   }
// };

const createOperation = async (req, res) => {
  const { buyerId, sellerId, timeLapse, totalCheckout } = req.body;

  const userId = req.header("uid");
  const { id } = req.params;

  const operation = await Operation.create({
    // id: "2030427d-e69d-46cc-a726-fb90608a9778",
    price: totalCheckout,
    timeLapse: timeLapse,
    userId,
    caretakerId: id,
  });
  console.log("OPERATION HERE", operation.toJSON());
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
        return_url: "http://localhost:3000/newOperation",
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

    const response = await axios.post(
      "https://api-m.sandbox.paypal.com/v2/checkout/orders",
      order,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    return res.status(500).send("Algo fallo");
  }
};

const captureOrder = async (req, res) => {
  const { token } = req.query;
  console.log(token);

  try {
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
    console.log("CAPTURE", response.data);
    res.json(response.data);
    //res.json({ msg: 'Hola' });
  } catch (error) {
    res.json("fallo capture order", error);
  }
};

const cancelOrder = async (req, res) => {
  res.redirect("/");
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
  // getOperations,
  // editOperation,
  captureOrder,
  cancelOrder,
};
