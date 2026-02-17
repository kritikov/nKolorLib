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

The picker has a default width of 350px. The height is adjusted automatically. To change the width, add the following to your CSS file:

.nKolorLib-picker{
    width: 450px !important;
}

You can also use this rule for smaller screen sizes to make the picker responsive.
```
---
## 🧰 Available Tools
---
# svPicker
<img width="512" height="827" alt="image" src="https://github.com/user-attachments/assets/87ae5ad9-718a-4765-9095-b74c462223d9" />


---
# hvPicker
<img width="518" height="825" alt="image" src="https://github.com/user-attachments/assets/4f07de19-8204-4e37-9d4e-3e08b9087c82" />


---
# Color: A class based on HSV and alpha parameters.

Provides: easy conversion to HEX, RGB output, HSV output, Alpha-aware formats, Utility methods for color manipulation

---

## 📄 License

nKolorLib is free software licensed under the GNU GPL v3.0 or later.
