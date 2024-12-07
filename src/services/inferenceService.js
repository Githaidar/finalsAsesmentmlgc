const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/inputError');
 
async function predictClassification(model, image) {
    try {
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat()
 
        // const classes = ['Melanocytic nevus', 'Squamous cell carcinoma', 'Vascular lesion'];
 
        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = Math.max(...score) * 100;
 
        // const classResult = tf.argMax(prediction, 1).dataSync()[0];
        if (confidenceScore <= 50) {
            label = 'Non-cancer';
          } else {
            label = 'Cancer';
          }
 
        let suggestion;
 
        if(label === 'Cancer') {
            suggestion = "Segera periksa ke dokter!"
        }
        
        if(label === 'Non-cancer') {
            suggestion = "Anda sehat!"
        }
 
        return { confidenceScore, label, suggestion };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan input: ${error.message}`)
    }
}
 
module.exports = predictClassification;