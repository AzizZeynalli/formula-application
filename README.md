# Formula Calculator

A modern, interactive formula calculator built with Next.js and TypeScript. This application allows users to build and evaluate mathematical expressions with support for variables, real-time calculation, and an intuitive tag-based interface.

## Features

- 🧮 Dynamic formula building with tags
- 🔢 Support for variables and custom values
- ⚡ Real-time calculation and validation
- 💡 Smart autocompletion for operators and variables
- 🎯 Intuitive cursor-based navigation
- 🎨 Modern UI with neumorphic design
- 📱 Fully responsive layout

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Development**: ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/formula-calculator.git
cd formula-calculator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Adding Numbers and Operators**:
   - Type numbers directly
   - Use +, -, *, / operators
   - Press Enter or click to add

2. **Working with Variables**:
   - Set variables using the variable input field
   - Format: `variableName = value`
   - Use variables in your formula

3. **Navigation**:
   - Use arrow keys to move between tags
   - Backspace to delete tags
   - Click to position cursor

4. **Calculations**:
   - Click "Calculate" to evaluate the formula
   - Results update in real-time
   - "Clear" button to reset

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── FormulaInput.tsx
│   ├── store/
│   │   └── formulaStore.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── ...
```

## Development

### Running Tests
```bash
npm run test
# or
yarn test
```

### Linting
```bash
npm run lint
# or
yarn lint
```

### Building for Production
```bash
npm run build
# or
yarn build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Zustand for simple yet powerful state management 