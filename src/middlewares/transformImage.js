const { cloudinary } = require('../cloudinary');

// PASARLO A MIDDLEWARE PARA IMG DE USER
// const transformImage = async (req, res, next) => {
//   let user = req.body;
//   const { image } = user;

//   const uploadedResponse = await cloudinary.uploader.upload(image);

//   req.body = {
//     ...req.body,
//     image: uploadedResponse.secure_url,
//   };

//   next();
// };

// middleware para images de caretaker
const transformImage = async (req, res, next) => {
  let caretaker = req.body;
  let { images } = caretaker;

  const uploadedResponse = images.map(
    async (image) => await cloudinary.uploader.upload(image)
  );

  console.log('tatta', uploadedResponse);

  const promisesImages = await Promise.all(uploadedResponse);

  req.body = {
    ...req.body,
    images: promisesImages.map((image) => image.secure_url),
  };

  console.log(req.body);

  next();
};

module.exports = {
  transformImage,
};