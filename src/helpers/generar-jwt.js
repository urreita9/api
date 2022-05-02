const jwt = require('jsonwebtoken');

const generarJWT = (uid = '', expires = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid };

        if (!!expires) {
            jwt.sign(
                payload,
                process.env.SECRETORPRIVATEKEY,
                {
                    expiresIn: expires,
                },
                (err, token) => {
                    if (err) {
                        console.log(err);
                        reject('No se pudo generar el token');
                    } else {
                        resolve(token);
                    }
                }
            );
        } else {
            jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {}, (err, token) => {
                if (err) {
                    console.log(err);
                    reject('No se pudo generar el token');
                } else {
                    resolve(token);
                }
            });
        }
    });
};

const comprobarJWT = (token = '') => {
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        return [true, uid];
    } catch (error) {
        return [false, null];
    }
};

module.exports = {
    generarJWT,
    comprobarJWT,
};
