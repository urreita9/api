const { cloudinary } = require('../utils/cloudinary');

// PASARLO A MIDDLEWARE PARA IMG DE USER
const transformImageOne = async (req, res, next) => {
	let { img } = req.body;

	if (!img) {
		next();
	} else {
		const uploadedResponse = await cloudinary.uploader.upload(img);

		req.body = {
			...req.body,
			img: uploadedResponse.secure_url,
		};

		next();
	}
};

// middleware para images de caretaker
const transformImage = async (req, res, next) => {
	let caretaker = req.body;
	// let { images } = caretaker;

	// if(!images.length){
	//   return res.json()
	// }

	// console.log('IMAGES', images);
	const uploadedResponse = req.body.caretaker.images?.map(
		async (image) => await cloudinary.uploader.upload(image)
	);
	console.log(uploadedResponse);
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
	transformImageOne,
};
