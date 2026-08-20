import librosa, librosa.display
import matplotlib.pyplot as plt
import numpy as np


file = 'blues.00000.wav'

# waveform
signal, sr = librosa.load(file, sr=22050)  # sample rate * T -> 22050 * 30
librosa.display.waveplot(signal, sr=sr)
# plt.xlabel('Time')
# plt.ylabel('Amplitude')
# plt.show()

# fft --> spectrum
fft = np.fft.fft(signal)

magnitude = np.absolute(fft)
frequency = np.linspace(0, sr, len(magnitude))

left_frequency = frequency[:int(len(frequency)/2)]
left_magnitude = magnitude[:int(len(frequency)/2)]

# plt.plot(left_frequency, left_magnitude)
# plt.xlabel('Frequency')
# plt.ylabel('Magnitude')
# plt.show()

# stft --> spectrogram
n_fft = 2048  # number of transforms
hop_length = 512  # amount we shift each transform to the right

stft = librosa.core.stft(signal, hop_length=hop_length, n_fft=n_fft)
spectrogram = np.abs(stft)
log_spectrogram = librosa.amplitude_to_db(spectrogram)

# librosa.display.specshow(log_spectrogram, sr=sr, hop_length=hop_length)
# plt.xlabel('Time')
# plt.ylabel('Frequency')
# plt.colorbar()
# plt.show()

# MFCCs
MFCCs = librosa.feature.mfcc(signal, n_fft=n_fft, hop_length=hop_length, n_mfcc=13)
librosa.display.specshow(MFCCs, sr=sr, hop_length=hop_length)
plt.xlabel('Time')
plt.ylabel('MFCCs')
plt.colorbar()
plt.show()

