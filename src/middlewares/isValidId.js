const { isValidObjectId } = require("mongoose");

const validateMongoDbId = (req, res, next) => {
  const id = req.params.id;
  if (!isValidObjectId(id)) {
    res.status(404).send({
      status: false,
      message: `${id} is not valid id`,
    });
  }
  next();
};

module.exports = validateMongoDbId;
