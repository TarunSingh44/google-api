exports.sendApiErrorResponse = function (res, error, status = 400) {
  // TODO: Integrate logger and dump all application errors here.
  console.log(error);
  res.status(status).json({
    status: 'error',
    message: typeof error === 'string' ? error : error.message,
  });
};

exports.sendApiSuccessResponse = function (res, data, message) {
  res.status(200).json({
    status: 'success',
    data,
    message,
  });
};
