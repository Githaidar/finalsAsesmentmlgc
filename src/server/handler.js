const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
const { Firestore } = require('@google-cloud/firestore');
 
async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;
 
  const { confidenceScore, label, suggestion } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
 
  const data = {
    "id": id,
    "result": label,
    "suggestion": suggestion,
    "createdAt": createdAt
  }

  await storeData(id, data);
 
  const response = h.response({
    status: 'success',
    message:'Model is predicted successfully' ,
    data
  })
  response.code(201);
  return response;

} 

async function getPredictHistoriesHandler(request, h) {
  try {
    const db = new Firestore({ databaseId: "(default)" });
    const predictCollection = db.collection('prediction');
    console.log('Firestore connected and collection accessed.');
    
    const snapshot = await predictCollection.get();

    if (snapshot.empty) {
      return h.response({
        status: 'success',
        data: []
      }).code(200);
    }

    const formatAllData = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      formatAllData.push({
        id: doc.id,
        history: {
          result: data.result,
          createdAt: data.createdAt,
          suggestion: data.suggestion,
          id: doc.id
        }
      });
    });

    return h.response({
      status: 'success',
      data: formatAllData
    }).code(200);

  } catch (error) {
    console.error('Error fetching prediction histories:', error);
    return h.response({
      status: 'fail',
      message: 'An internal server error occurred'
    }).code(500);
  }
}

module.exports = {
  postPredictHandler,
  getPredictHistoriesHandler
};