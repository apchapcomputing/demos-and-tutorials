import json
import librosa
import os


DATASET_PATH = './dataset'
JSON_PATH = './data.json'
SAMPLES_TO_CONSIDER = 22050  # 1s worth of sound for 44100Hz


# n_mfcc = number of MFCCs
# hop_length =
# n_fft = number of fast Fourier transform
def prepare_dataset(dataset_path, json_path, n_mfcc=13, hop_length=512, n_fft=2048):

    # data dictionary has all data from audio files
    data = {
        'mappings': [],  # 'on', 'off'
        'labels': [],  # 0, 0, 1, 1
        'MFCCs': [],
        'files': [],  # dataset/on/1.wav
    }

    # loop through dataset subdirectories
    for i, (dirpath, dirnames, filesnames) in enumerate(os.walk(dataset_path)):
        # check for root level
        if dirpath is not dataset_path:

            # update mappings
            category = dirpath.split('/')[-1]  # dataset/down -> [dataset, down]
            data['mappings'].append(category)

            print(f'Processing: {category}')

            # loop through filenames and extract MFCCs
            for f in filesnames:
                file_path = os.path.join(dirpath, f)  # get filepath
                signal, sr = librosa.load(file_path)  # load audio file

                # ensure the audio file is at least 1s long
                if len(signal) >= SAMPLES_TO_CONSIDER:
                    signal = signal[:SAMPLES_TO_CONSIDER]  # enforce 1s length
                    # extract MFCCs
                    MFCCs = librosa.feature.mfcc(signal, n_mfcc=n_mfcc, hop_length=hop_length, n_fft=n_fft)

                    # store data
                    data['labels'].append(i - 1)
                    data['MFCCs'].append(MFCCs.T.tolist())
                    data['files'].append(file_path)

                    print(f'{file_path}: {i-1}')

    # store in json file
    with open(json_path, 'w') as fp:
        json.dump(data, fp, indent=4)


if __name__ == '__main__':
    prepare_dataset(DATASET_PATH, JSON_PATH)
