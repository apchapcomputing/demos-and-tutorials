import tensorflow.keras as keras
import librosa
import numpy as np


MODEL_PATH = 'model.h5'
NUM_SAMPLES_TO_CONSIDER = 22050


class _Keyword_Spotting_Service:

    model = None  # set when instantiated
    _mappings = []  # TODO: set mappings from data
    _instance = None

    def predict(self, file_path):

        # extract MFCCs
        MFCCs = self.preprocess(file_path)  # (# segments, # coefficients)

        # convert 2D MFCCs into 4D array (# samples, #segments, # coefficients, # channels)
        MFCCs = MFCCs[np.newaxis, ..., np.newaxis]

        # make prediction
        predictions = self.model.predict(MFCCs)
        predicted_index = np.argmax(predictions)
        predicted_keyword = self._mappings

        return predicted_keyword

    def preprocess(self, file_path, n_mfcc=13, n_fft=2048, hop_length=512):

        # load audio file
        signal, sr = librosa.load(file_path)

        # ensure consistency in audio file length
        if len(signal) > NUM_SAMPLES_TO_CONSIDER:
            signal = signal[:NUM_SAMPLES_TO_CONSIDER]

        # extract MFCCs
        MFCCs = librosa.feature.mfcc(signal, n_mfcc=n_mfcc, n_fft=n_fft, hop_length=hop_length)

        return MFCCs.T


def Keyword_Spotting_Service():

    # ensure only 1 instance exists
    if _Keyword_Spotting_Service._instance is None:
        _Keyword_Spotting_Service._instance = _Keyword_Spotting_Service()
        _Keyword_Spotting_Service.model = keras.models.load_model(MODEL_PATH)

    return _Keyword_Spotting_Service._instance


if __name__ == '__main__':
    kss = Keyword_Spotting_Service()
    keyword1 = kss.preprocess('dataset/bed/0a7c2a8d_nohash_0.wav')

    print(f'Predicted keywords: {keyword1}')

