"""Tracks the face, reframes to vertical, matches color per take, and writes clip_v.mp4 and track.json."""
import json
import subprocess
import sys

import cv2
import numpy as np

raw, plan_path, out_video, out_track = sys.argv[1:5]
plan = json.load(open(plan_path))
OUT_W, OUT_H, CROP_W = 1080, 1920, 608
SCALE = OUT_H / 1080

cap = cv2.VideoCapture(raw)
fps = cap.get(cv2.CAP_PROP_FPS) or 30
face = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))


def take_of(t):
    return next(k for k in plan["takes"] if k["from"] <= t < k["to"])


# 1. Find the face every third frame.
xs = np.full(total, np.nan)
ys = np.full(total, np.nan)
hs = np.full(total, np.nan)
for i in range(total):
    ok = cap.grab()
    if not ok:
        break
    if i % 3:
        continue
    ok, fr = cap.retrieve()
    if not ok:
        continue
    g = cv2.cvtColor(cv2.resize(fr, (960, 540)), cv2.COLOR_BGR2GRAY)
    fs = face.detectMultiScale(g, 1.1, 6, minSize=(50, 50))
    if len(fs):
        x, y, w, h = max(fs, key=lambda r: r[2] * r[3])
        xs[i], ys[i], hs[i] = (x + w / 2) * 2, y * 2, h * 2

# 2. Smooth the track inside each take, so the reframe follows gently and never crosses a cut.
times = np.arange(total) / fps
cx, top, height = xs.copy(), ys.copy(), hs.copy()
for k in plan["takes"]:
    m = (times >= k["from"]) & (times < k["to"])
    idx = np.where(m)[0]
    if not len(idx):
        continue
    for arr, sigma in ((cx, 1.0), (top, 0.5), (height, 0.5)):
        seg = arr[idx]
        good = ~np.isnan(seg)
        seg = np.interp(idx, idx[good], seg[good]) if good.any() else np.full(len(idx), {id(cx): 1100, id(top): 260, id(height): 330}[id(arr)])
        w = int(sigma * fps) * 2 + 1
        pad = np.pad(seg, w, mode="edge")
        arr[idx] = np.convolve(pad, np.hanning(w) / np.hanning(w).sum(), mode="same")[w:-w]

cropx = np.clip(cx - CROP_W / 2, 0, 1920 - CROP_W).astype(int)

# 3. Reframe, match color, and encode.
cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
enc = subprocess.Popen(
    ["ffmpeg", "-nostdin", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{OUT_W}x{OUT_H}", "-r", str(fps), "-i", "-",
     "-vf", "eq=contrast=1.05:saturation=1.03,selectivecolor=cyans=0.2 0 0 0", "-c:v", "libx264", "-crf", "15", "-preset", "medium", "-pix_fmt", "yuv420p", out_video],
    stdin=subprocess.PIPE,
)
for i in range(total):
    ok, fr = cap.read()
    if not ok:
        break
    c = cv2.resize(fr[:, cropx[i]:cropx[i] + CROP_W], (OUT_W, OUT_H), interpolation=cv2.INTER_LANCZOS4).astype(np.float32)
    r, g, b = take_of(times[i])["gains"]
    c[:, :, 2] *= r
    c[:, :, 1] *= g
    c[:, :, 0] *= b
    enc.stdin.write(np.clip(c, 0, 255).astype(np.uint8).tobytes())
enc.stdin.close()
enc.wait()

track = {
    "fps": fps,
    "cx": ((cx - cropx) * SCALE).round(1).tolist(),
    "top": (top * SCALE).round(1).tolist(),
    "h": (height * SCALE).round(1).tolist(),
}
json.dump(track, open(out_track, "w"))
print(f"{total} frames at {fps:.2f} fps, face found on {int((~np.isnan(xs)).sum())} sampled frames")
