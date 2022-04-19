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

  try {
    const findCaretaker = await Caretaker.findOne({ where: { userId: id } });

    const questionCreated = await Question.create({
      caretakerId: findCaretaker.id,
      question,
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
