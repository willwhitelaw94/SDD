---
title: "Illustrations"
description: "Undraw.co illustration library, banner images, and usage guidance"
---

All illustrations are sourced from [undraw.co](https://undraw.co) and defined in the [Figma Illustrations page](https://www.figma.com/design/ojTCI9yefnl9ORYEVrv2WJ/Trilogy-Care-Design-System?node-id=2640-2803). Set the accent colour to **#007F7E** (Primary Teal) before downloading.

Illustrations live in `resources/js/Assets/Common/` as SVGs, imported with `@/Assets/Common/undraw_[name].svg`.

:illustration-showcase

## Banner Images

Banner images are decorative hero graphics used on portal landing pages and key screens. They are defined in the [Figma Banner Images page](https://www.figma.com/design/ojTCI9yefnl9ORYEVrv2WJ/Trilogy-Care-Design-System?node-id=4728-8202).

Unlike undraw illustrations, banner images are custom-designed assets using the TC brand colour palette with abstract geometric shapes and iconography. They are available as both SVGs (for flexibility) and pre-sized rasterised images (for specific breakpoints).

### Banner Themes

Each banner uses a distinct colour scheme and icon to represent its portal section:

| Theme | Primary Colours | Icon | Used On |
|---|---|---|---|
| Heart / Care | Navy + Teal | Heart, handshake | Recipient landing page |
| Home / Family | Navy + Yellow | House, people | Package details |
| Supplier | Navy + Blue | Flower/leaf | Supplier portal |
| Admin | Navy + Orange | Person, connection | Admin/coordinator portal |

### Responsive Sizes

Banners are provided at four breakpoints:

| Breakpoint | Width | Height | Use Case |
|---|---|---|---|
| Desktop | 3150px | 688px | Large screens (1440px+) |
| Large Tablet | 1280px | 329px | Tablet landscape |
| Tablet | 768px | 329px | Tablet portrait |
| Mobile | 375px | 329px | Phone screens |

### SVG Source Files

Raw SVG assets are available for each theme. These can be resized and cropped to fit custom layouts. SVGs should be stored in `resources/js/Assets/` and imported as needed.
