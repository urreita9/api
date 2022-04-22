const { cloudinary } = require('../utils/cloudinary');

const transformImage = async (req, res, next) => {
	let caretaker = req.body;
	let { images } = caretaker;

	// if(!images.length){
	//   return res.json()
	// }

	const uploadedResponse = images?.map(
		async (image) => await cloudinary.uploader.upload(image)
	);

	//console.log('tatta', uploadedResponse);

	const promisesImages = await Promise.all(uploadedResponse);

	req.body = {
		...req.body,
		images: promisesImages.map((image) => image.secure_url),
	};

	//console.log(req.body);

	next();
};

module.exports = {
	transformImage,
};
