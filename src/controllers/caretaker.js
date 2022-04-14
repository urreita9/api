const dataMock = {
  name: 'Juan Carlos',
  img: 'https://images.pexels.com/photos/7840133/pexels-photo-7840133.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  description:
    'Soy Juan, me gustan los perros, cuido chicos, medianos, grandes, etc etc Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus sit, maiores neque rerum nulla aspernatur dolore provident consectetur dolores harum numquam vitae necessitatibus fugit, iusto pariatur illo eligendi autem iure.',
  rating: 4.5,
  questions: [
    {
      id: 1,
      question: 'Buenas, paseas perros grandes o solo chicos?',
      answer: 'Yes',
    },
    {
      id: 2,
      question: 'Te lo puedo dejar a las 15hs?',
      answer: 'Si podés pasate a las 16hs',
    },
    {
      id: 3,
      question: 'Podría llevarte la comida que come Firulais?',
      answer: 'No',
    },
  ],
};

exports.caretaker_id_get = (req, res) => {
  const { id } = req.params;

  /*
    buscar por id en db
  */

  res.json(dataMock);
};

exports.caretaker_question_post = (req, res) => {
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
