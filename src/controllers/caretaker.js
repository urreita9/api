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
  const { userId } = req.body;

  try {
    await Caretaker.create({ ...req.body });

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

  try {
    const caretaker = await Caretaker.findOne({
      where: {
        userId: id,
      },
    });

    await caretaker.update({ ...req.body });

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

    res.json(user);
  } catch (error) {
    res.json({ msg: 'Error edit caretaker' });
  }
};

exports.deleteCaretaker = async (req, res) => {
  const { id } = req.params;

  try {
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
