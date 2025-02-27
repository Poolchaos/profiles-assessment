# Profiles Assessment

![Node Version](https://img.shields.io/badge/node-v22.8.0-brightgreen.svg)  
![npm Version](https://img.shields.io/badge/npm-v10.8.2-blue.svg)  
![Webpack Version](https://img.shields.io/badge/webpack-v5.28.1-blueviolet.svg)  
![License](https://img.shields.io/badge/license-MIT-green.svg)

Profiles Assessment is a project built from the ground up using my own custom framework. This project leverages Node.js, npm, and Webpack to compile TypeScript, HTML, and SASS into a fully functional application. It’s designed to demonstrate my ability to create a tailored development environment while tackling complex challenges.

---

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Known Issues](#known-issues)
- [Design Choices](#design-choices)
- [AI Usage](#ai-usage)
- [License](#license)

---

## Installation

To set up and run the project, follow these steps after unzipping the provided folder:

1. Navigate to the project directory:

```
cd profiles-assessment
```

2. Install the dependencies:

```
npm install
```

3. Start the application:

```
npm run start
```

4. Open your browser and visit:

```
http://localhost:8080
```

---

## Usage

Once running, the application provides a platform for interacting with user profiles, powered by my custom framework. It handles routing, data binding, and reactivity, all built from scratch to showcase advanced development techniques.

---

## Known Issues

- **Placeholder Bug**: While queries are being processed, you may notice `${}` placeholders in the UI. These are temporary and get replaced with actual data once the query completes. This is a known limitation of my current framework iteration and does not impact overall functionality.

---

## Design Choices

I chose to build and use my own custom framework for this project, despite the additional effort it required.
The core of this project lies in its profile views, which are designed to deliver a standout user experience. Here’s why certain design decisions were made:

- **User Experience**: The profile views prioritize ease of use and engagement, with layouts that adapt fluidly across desktop and mobile devices. This ensures users can explore profiles intuitively, no matter how they access the application.
- **Performance**: Profile data is optimized to load quickly and display seamlessly, minimizing wait times and keeping users engaged with responsive, real-time updates.
- **Visual Appeal**: The design emphasizes clean, modern aesthetics in the profile views, using thoughtful typography, spacing, and responsive imagery to create an inviting and professional look.
- **Interactivity**: Interactive elements within the profile views, such as dynamic data updates and smooth transitions, enhance usability and make the experience feel lively and cohesive.

These choices highlight the project’s commitment to putting profile views front and center, ensuring they shine as the primary feature.

---

## AI Usage

The only AI assistance in this project came from GROK, which I used selectively to overcome specific hurdles:

- **Custom Element Rendering**: GROK helped me resolve issues with how custom elements were rendered in the DOM.
- **Repeater Logic**: It assisted in fixing repeater issues, ensuring custom attributes and data bindings worked correctly within router views.
- **Reactive Proxy**: GROK provided insights to troubleshoot and stabilize my reactive proxy implementation.

These targeted uses of AI accelerated development without compromising the originality of my framework.

---

## License

This project is licensed under the [MIT License](LICENSE).

---
