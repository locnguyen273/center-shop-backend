const { HttpError } = require("../helpers/index.js");

const isEmptyBody = (req, res, next) => {
  const { length } = Object.keys(req.body);
  if (!length) {
    return next(HttpError(400, "Body must have fields"));
  }
  next();
}

// export function isEmptyBodyFavorite(req, res, next) {
//   const { length } = Object.keys(req.body);
//   if (!length) {
//     return next(HttpError(400, "missing field favorite"));
//   }
//   next();
// }

module.exports = {
  isEmptyBody,
}