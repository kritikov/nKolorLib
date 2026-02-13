# nKolorLib

A lightweight JavaScript library that provides two interactive HSV color pickers for modern web applications.

---

## ✨ Features

- 🎨 Two HSV color picker components
- 🧠 A `Color` class with multiple output and conversion utilities
- 🔁 Real-time color updates
- 📦 Lightweight & dependency-free
- ⚡ Easy integration in any JavaScript project
- 🎯 Supports HEX, RGB, HSV output with Alpha channel
- 🧩 Fully embeddable in any UI

---

## 🚀 Usage (ES Module)

```javascript
import nKolorLib from '../nKolorLib.js';

const svPicker = nKolorLib.getSVPicker(
  document.getElementById("svPicker")
);

const hvPicker = nKolorLib.getHVPicker(
  document.getElementById("hvPicker")
);

const color = nKolorLib.getColor(0.5, 0.5, 0.5, 1);



🧰 Available Tools
svPicker

Classic 2D saturation/value area with hue and alpha sliders.

Includes:

Real-time updates

Four automatically generated similar colors based on the selected color

hvPicker

Classic 2D hue/value area with saturation and alpha sliders.

Includes:

Real-time updates

Four automatically generated similar colors based on the selected color

Color

A class based on HSV and alpha parameters.

Provides:

Easy conversion to HEX

RGB output

HSV output

Alpha-aware formats

Utility methods for color manipulation

📄 License

nKolorLib is free software licensed under the GNU GPL v3.0 or later.
