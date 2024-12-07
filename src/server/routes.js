const { postPredictHandler, getPredictHistoriesHandler } = require('./handler');

const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 1000000 // Membatasi ukuran payload maksimum
      }
    }
  },
  {
    method: 'GET',
    path: '/predict/histories',
    handler: getPredictHistoriesHandler
  }
];

module.exports = routes;
