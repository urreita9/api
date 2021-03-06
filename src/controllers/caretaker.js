const { User, Caretaker, Image, Question, Answer } = require('../db');
const { transporter } = require('../utils/nodemailer');

exports.getCaretakers = async (req, res) => {
    try {
        const caretakers = await Caretaker.findAll({
            include: [
                {
                    model: User,
                },
                {
                    model: Image,
                },
            ],
        });

        res.json(caretakers);
    } catch (error) {
        res.json({ msg: 'Error get all caretakers' });
    }
};

exports.getCaretaker = async (req, res) => {
    const { id } = req.params;

    try {
        const caretaker = await User.findByPk(id, {
            include: [
                {
                    model: Caretaker,
                    include: [
                        {
                            model: Image,
                        },
                        {
                            model: Question,
                            include: [
                                {
                                    model: Answer,
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        res.json(caretaker);
    } catch (error) {
        res.json({ msg: 'Error get caretaker by id' });
    }
};

exports.getQuestions = async (req, res) => {
    const { id } = req.params;

    try {
        const caretaker = await Caretaker.findOne({
            where: {
                userId: id,
            },
            include: [
                {
                    model: Question,
                },
            ],
        });

        res.json(caretaker.questions);
    } catch (error) {
        res.json(error);
    }
};

exports.postCaretaker = async (req, res) => {
    const { userId, images } = req.body;

    try {
        const userExists = await User.findByPk(userId, {
            include: [
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

        if (userExists.caretaker) return res.status(400).json({ msg: 'User aldready a caretaker', userExists });

        const caretaker = await Caretaker.create({ ...req.body });

        const myImages = await Promise.all(
            images.map(async (image) => {
                await Image.create({ caretakerId: caretaker.id, img: image });
            })
        );

        const user = await User.findByPk(userId, {
            include: [
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
    } catch (error) {
        console.log(error);
        res.json({ msg: 'Error post caretaker' });
    }
};

exports.postCaretakerQuestion = async (req, res) => {
    const { question } = req.body;
    const { id } = req.params;
    const uid = req.header('uid');

    //console.log(question, id, uid);

    try {
        const findCaretaker = await Caretaker.findOne({ where: { userId: id } });

        //console.log(findCaretaker);

        const questionCreated = await Question.create({
            caretakerId: findCaretaker.id,
            question,
            questioner: uid,
        });

        const caretaker = await User.findByPk(id, {
            include: [
                {
                    model: Caretaker,
                    include: [
                        {
                            model: Image,
                        },
                        {
                            model: Question,
                        },
                    ],
                },
            ],
            //order: [[Caretaker, Question, 'question', 'ASC']],
        });

        await transporter.sendMail({
            from: '<pettrip.app@gmail.com>',
            to: caretaker.email,
            subject: 'Te han hecho una pregunta',
            text: questionCreated.question,
        });

        res.json(caretaker);
    } catch (error) {
        res.json({ msg: 'Error question' });
    }
};

exports.postAnswer = async (req, res) => {
    const { id, answer } = req.body;
    const userId = req.params;

    try {
        await Answer.create({ questionId: id, answer });

        await Question.update(
            { answered: true },
            {
                where: {
                    id,
                },
            }
        );

        const question = await Question.findOne({ where: { id } });

        //const user = await User.findOne({ where: { id: question.questioner } });

        const caretaker = await User.findByPk(userId.id, {
            include: [
                {
                    model: Caretaker,
                    include: [
                        {
                            model: Image,
                        },
                        {
                            model: Question,
                        },
                    ],
                },
            ],
            //order: [[Caretaker, Question, 'question', 'ASC']],
        });

        //console.log(question, caretaker);

        await transporter.sendMail({
            from: '<pettrip.app@gmail.com>',
            //to: user.email,
            to: 'matiasangelani2@gmail.com',
            subject: `${caretaker.name} te ha respondido`,
            text: `${question.question}: ${answer}`,
        });

        res.json(caretaker);
    } catch (error) {
        res.json(error);
    }
};

exports.editCaretaker = async (req, res) => {
    const { id } = req.params;
    const { images, ...resto } = req.body;
    try {
        const caretaker = await Caretaker.findOne({
            where: {
                userId: id,
            },
            include: [
                {
                    model: Image,
                },
            ],
        });
        await caretaker.update({ ...caretaker, ...resto });

        // console.log('CARETAKER IMAGES', caretaker.images);

        const myImages = caretaker.images.map((img) => img.id);

        // console.log('MY IMAGES', myImages);

        myImages.forEach(async (id, i) => {
            const newImage = images[i];
            const imagen = await Image.findByPk(id);
            console.log('IMAGEN X ID', imagen);
            await imagen.update({ img: newImage });
        });

        const user = await User.findByPk(id, {
            include: [
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
        console.log(user);

        res.json(user);
    } catch (error) {
        res.json({ msg: 'Error edit caretaker' });
    }
};

exports.deleteCaretaker = async (req, res) => {
    const { id } = req.params;

    try {
        const caretaker = await Caretaker.findOne({
            where: {
                userId: id,
            },
        });

        const questions = await Question.findAll({
            where: {
                caretakerId: caretaker.id,
            },
        });

        questions.map(
            async (question) =>
                await Answer.destroy({
                    where: {
                        questionId: question.id,
                    },
                })
        );

        await Question.destroy({
            where: {
                caretakerId: caretaker.id,
            },
        });

        await Caretaker.destroy({
            where: {
                userId: id,
            },
        });

        const caretakers = await Caretaker.findAll({
            include: {
                model: User,
            },
        });

        res.json(caretakers);
    } catch (error) {
        res.json({ msg: 'Error delete caretaker' });
    }
};
