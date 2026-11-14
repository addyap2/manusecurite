"""Original ambient soundtrack for the 9:16 reel (31 s, 48 kHz stereo WAV).

A calm D minor pad with a slow swell. A soft bell marks each scene change.
End card (25.6 s): the pad opens to D major and brightens.
Usage: python3 soundtrack.py out.wav
"""
import sys
import wave

import numpy as np

SR, DUR = 48000, 31.0
t = np.arange(int(SR * DUR)) / SR
rng = np.random.default_rng(5)


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def smooth(x):
    x = np.clip(x, 0, 1)
    return x * x * (3 - 2 * x)


def pad_voice(midi, amp, detune=0.12):
    out = np.zeros_like(t)
    for d in (-detune, 0, detune):
        f = hz(midi + d)
        ph = rng.uniform(0, 2 * np.pi)
        out += np.sin(2 * np.pi * f * t + ph) + 0.18 * np.sin(4 * np.pi * f * t + ph)
    lfo = 0.75 + 0.25 * np.sin(2 * np.pi * rng.uniform(0.05, 0.12) * t + rng.uniform(0, 6))
    return out * amp * lfo / 3


end = smooth((t - 25.2) / 1.6)
calm = 1 - end

# Main chord: D2 A2 D3 F3 E4 C5 ; end chord: D2 A2 D3 F#3 A3 E4 F#5
mix = (
    pad_voice(38, .30) + pad_voice(45, .22) + pad_voice(50, .16)
    + pad_voice(53, .12) * calm + pad_voice(54, .12) * end
    + pad_voice(64, .07) + pad_voice(72, .035) * calm
    + pad_voice(57, .09) * end + pad_voice(78, .04) * end
)
# slow swell through the film, bigger at end
mix *= (0.55 + 0.25 * smooth(t / 20)) + 0.35 * end

# soft air / sea noise, low-passed
noise = rng.normal(0, 1, t.size)
k = np.exp(-np.arange(400) / 60.0); k /= k.sum()
sea = np.convolve(noise, k, mode="same") * (0.10 + 0.05 * np.sin(2 * np.pi * 0.11 * t)) * (1 - 0.6 * end)
mix += sea

# bells at each cut
def bell(at, midi, amp):
    s = np.zeros_like(t)
    m = t >= at
    tt = t[m] - at
    f = hz(midi)
    env = np.exp(-tt / 2.4) * (1 - np.exp(-tt * 200))
    s[m] = amp * env * (np.sin(2 * np.pi * f * tt) + .45 * np.sin(2 * np.pi * f * 2.76 * tt) * np.exp(-tt * 1.4)
                        + .25 * np.sin(2 * np.pi * f * 5.4 * tt) * np.exp(-tt * 3))
    return s

for at, note in [(0.3, 74), (3.75, 81), (7.5, 77), (11.1, 76), (14.7, 74), (18.3, 72), (21.9, 69), (26.0, 78), (27.7, 81)]:
    mix += bell(at, note, .16)

# sub thump with the motto and at end
for at in (3.7, 25.8):
    m = t >= at; tt = t[m] - at
    mix[m] += .35 * np.sin(2 * np.pi * 41 * tt) * np.exp(-tt / 1.2) * (1 - np.exp(-tt * 40))

# stereo widen + simple reverb (exponentially decaying noise IR)
ir_len = int(SR * 2.8)
ir = rng.normal(0, 1, (2, ir_len)) * np.exp(-np.arange(ir_len) / (SR * 0.7))
ir[:, 0] = 0
n = 1 << int(np.ceil(np.log2(t.size + ir_len)))
X = np.fft.rfft(mix, n)
wet = np.stack([np.fft.irfft(X * np.fft.rfft(ir[c], n), n)[: t.size] for c in range(2)])
wet /= np.abs(wet).max()
dry = np.stack([mix, mix]) / np.abs(mix).max()
out = 0.62 * dry + 0.5 * wet

# fades and normalise to about -1 dBFS
fade = smooth(t / 1.2) * (1 - smooth((t - (DUR - 2.2)) / 2.2))
out *= fade
out /= np.abs(out).max() / 0.89
pcm = (out.T * 32767).astype("<i2")

with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("wrote", sys.argv[1])
