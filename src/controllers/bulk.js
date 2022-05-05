const { response } = require('express');
const { request } = require('express');
const { User, Pet, Caretaker, Operation, Image, Chat, Message, Chatnotification } = require('../db');
const bcryptjs = require('bcryptjs');
const { editPet } = require('./Pet');

exports.bulkAction = async (req, res) => {
    const { items = [], pets, caretakers = [], operations = [] } = req.body;

    try {
        //CREACION DE USUARIOS Y PETS
        if (items.length > 0) {
            items.forEach(async (el, i) => {
                var rol = 'USER';
                if (el?.rol) {
                    rol = el.rol;
                }
                const salt = bcryptjs.genSaltSync();
                const hashedPassword = bcryptjs.hashSync('123456', salt);

                //CREACION DE USUARIOS
                obj = {
                    name: el.name,
                    lastname: el.lastname,
                    img: el.img,
                    email: `${el.name.toLowerCase()}@email.com`,
                    password: hashedPassword,
                    role: rol,
                };
                const [user, created] = await User.findOrCreate({ where: obj });

                const uid = user.id;

                const petss = pets[i];

                //ASIGNACION DE PETS
                if (pets.length > i) {
                    petss.forEach(async (pet) => {
                        const petObj = {
                            name: pet.name,
                            age: '5',
                            race: pet.race,
                            size: pet.size,
                            img: pet.img,
                            userId: uid,
                        };

                        await Pet.findOrCreate({ where: petObj });
                    });
                }
            });
        }

        //CREACION DE CARETAKERS

        if (caretakers.length > 0)
            caretakers.forEach(async (care) => {
                const user = await User.findOne({ where: { name: care.name } });

                const obj = {
                    description: `Hi! My name is ${care.name} and I love pets! Specially dogs. A day of the year that is easy to dread if you’re feeling down about not having a partner to do cutesy stuff with. Society and the media are obsessed with the idea of partnership, needing a boo to experience love and a fulfilling life, and how critical it is to have someone go all out for you on V-Day. And you know social media is going to be flooded with declarations of love and humble bragging about gifts.`,
                    homeDescription: `This beautiful downstairs studio is within 100 yards of the Oceano Dunes State Vehicular Recreation Area, more commonly known as the Pismo sand dunes. 
                Whether you're a beach-goer or a thrill-seeker, you'll love coming home to this polished, comfortable living space. Log onto the free private Wi-Fi to stream music or share photos of your adventures and settle in for an evening of Netflix favorites on the 43” Smart TV (Netflix and cable tv service is included). Board games, playing cards and puzzles are in the mirrored chest, perfect for a family fun night!`,
                    rating: Number(care.rating),
                    lat: Number(care.lat),
                    lng: Number(care.long),
                    price: Number(care.price),
                    size: Number(care.size),
                    userId: user.id,
                };

                //Creacion del caretaker
                const [caretaker, created] = await Caretaker.findOrCreate({ where: obj });

                const images = care.images; //caretaker.images

                //Creacion y asignacion de imagenes del caretaker
                await images.forEach(async (imag) => {
                    const imgobj = {
                        caretakerId: caretaker.id,
                        img: imag,
                    };

                    await Image.findOrCreate({ where: imgobj });
                });
            });

        //CREACION DE OPERACIONES Y CHATS
        if (operations.length > 0) {
            operations.forEach(async (op) => {
                const user = await User.findOne({
                    where: { name: op.name },
                    include: [
                        {
                            model: Pet,
                        },
                    ],
                });
                const caretaker = await User.findOne({ where: { name: op.caretaker } });
                const pet = user.pets[0].id;
                let opObj = {
                    operationId: 'adjkskjdsdkjasjkdasdaskjaskjdasdjASDASDJASASD',
                    price: Number(op.price),
                    timeLapse: Number(op.timelapse),
                    userId: user.id,
                    caretakerId: caretaker.id,
                    petId: pet,
                    startDate: op.startDay,
                    endDate: op.endDay,
                    status: op.status,
                };

                await Operation.findOrCreate({ where: opObj });

                //Crear Chat
            });
        }
    } catch (error) {}

    res.json(true);
};
