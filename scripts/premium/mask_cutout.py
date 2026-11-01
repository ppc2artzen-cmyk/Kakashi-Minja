"""Limits a cutout to the real speaker, using a head-shaped oval that follows the face, so faces on the wall are removed."""
import glob
import json
import sys

import cv2
import numpy as np

folder, track_path, start = sys.argv[1], sys.argv[2], float(sys.argv[3])
tr = json.load(open(track_path))
fps = tr["fps"]
files = sorted(glob.glob(f"{folder}/*.png"))
for n, path in enumerate(files):
    i = min(int(round(start * fps)) + n, len(tr["cx"]) - 1)
    im = cv2.imread(path, cv2.IMREAD_UNCHANGED)
    if im is None or im.shape[2] < 4:
        raise SystemExit(f"no alpha channel in {path}")
    H, W = im.shape[:2]
    cx, top, h = tr["cx"][i], tr["top"][i], tr["h"][i]
    m = np.zeros((H, W), np.float32)
    cv2.ellipse(m, (int(cx), int(top + 0.42 * h)), (int(0.72 * h), int(0.98 * h)), 0, 0, 360, 1, -1)
    m[int(top + 1.05 * h):] = 1
    m = cv2.GaussianBlur(m, (41, 41), 0)
    im[:, :, 3] = (im[:, :, 3] * m).astype(np.uint8)
    cv2.imwrite(path, im)
print(f"masked {len(files)} frames in {folder}")
