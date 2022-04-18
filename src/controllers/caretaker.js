const { User, Caretaker, Image, Question } = require('../db');

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

exports.postCaretaker = async (req, res) => {
  const {
    description,
    homeDescription,
    rating,
    lat,
    lng,
    price,
    size,
    userId,
    images,
  } = req.body;

  try {
    const [caretaker, created] = await Caretaker.findOrCreate({
      where: {
        description,
        homeDescription,
        rating,
        lat,
        lng,
        price,
        size,
        userId,
      },
    });

    // const imagesCaretaker = await Image.findAll({
    //   where: {
    //     caretakerId: id,
    //   },
    // });

    // if (!imagesCaretaker.length)
    //   imagesCaretaker.map(async (image) => {
    //     image.update();
    //   });

    if (created) {
      images.map(
        async (image) =>
          await Image.create({ caretakerId: caretaker.id, img: image })
      );
    } else {
      await Caretaker.update({
        description,
        homeDescription,
        rating,
        lat,
        lng,
        price,
        size,
      });

      await Image.update(
        { img: image },
        { where: { caretakerId: caretaker.id } }
      );
    }

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

    await Question.create({
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
      order: [[Caretaker, Question, 'question', 'ASC']],
    });

    //const caretakerMod = caretaker.questions.reverse();

    res.json(caretaker);
  } catch (error) {
    res.json({ msg: 'Error question' });
  }
};

exports.editCaretaker = async (req, res) => {
  const { id } = req.params;
  const { description, lat, lng, price, size } = req.body;

  try {
    const caretaker = await Caretaker.findOne({
      where: {
        userId: id,
      },
    });

    await caretaker.update({
      description,
      lat,
      lng,
      price,
      size,
    });

    const user = await User.findByPk(id, {
      include: [
        {
          model: Caretaker,
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
