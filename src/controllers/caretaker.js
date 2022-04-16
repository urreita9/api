const { User, Caretaker } = require('../db');

exports.getCaretakers = async (req, res) => {
  try {
    const caretakers = await Caretaker.findAll({
      include: {
        model: User,
      },
    });

    res.json(caretakers);
  } catch (error) {
    res.json({ msg: 'Error get all caretakers' });
  }
};

exports.getCaretaker = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const caretaker = await User.findByPk(id, {
      include: {
        model: Caretaker,
      },
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
  } = req.body;

  try {
    await Caretaker.create({
      description,
      homeDescription,
      rating,
      lat,
      lng,
      price,
      size,
      userId,
    });

    const user = await User.findByPk(userId, {
      include: [
        {
          model: Caretaker,
        },
      ],
    });

    res.json(user);
  } catch (error) {
    res.json({ msg: 'Error post caretaker' });
  }
};

exports.postCaretakerQuestion = (req, res) => {
  const { question } = req.body;
  const { id } = req.params;

  /*
    se agrega question a la tabla de la db del cuidador que hay que buscar por id
 */

  dataMock.questions.unshift({
    id,
    question,
  });

  res.json(dataMock);
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
