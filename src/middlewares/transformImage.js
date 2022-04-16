const { cloudinary } = require('../cloudinary');

const transformImage = async (req, res, next) => {
  let user = req.body;
  const { img } = user;

  const uploadedResponse = await cloudinary.uploader.upload(img);

  req.body = {
    ...req.body,
    img: uploadedResponse.secure_url,
  };

  next();
};

module.exports = {
  transformImage,
};
