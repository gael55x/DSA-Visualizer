# DSA Visualizer

An interactive web-based tool designed to help students and developers understand core data structures and algorithms through real-time visualizations with step-by-step code execution.

## Features

### Data Structures
- **Arrays**: Interactive array operations with insertion, deletion, searching
- **Linked Lists**: Complete linked list implementation with traversal animations
- **Stacks**: LIFO operations with push, pop, peek, and top element highlighting
- **Queues**: FIFO operations with enqueue, dequeue, peek front
- **Binary Trees**: Tree operations with search, insertion, and deletion

### Sorting Algorithms
- **Bubble Sort**: Step-by-step bubble sort with element comparisons
- **Selection Sort**: Selection sort with minimum element highlighting
- **Insertion Sort**: Insertion sort with shift visualizations

### Key Features
- **Interactive Visualizations**: Real-time animations for all operations
- **Code Execution**: Step-by-step code highlighting with explanations
- **Modern UI**: Clean, responsive design with dark theme
- **Mobile-Friendly**: Optimized for all device sizes
- **Search Highlighting**: Green highlighting for found elements
- **Performance**: Optimized 70/30 layout for better visualization
- **Educational**: Comprehensive explanations and complexity analysis

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dsa-visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Usage

1. **Navigate** between different data structures using the top navigation bar
2. **Input values** using the provided forms
3. **Select operations** like insert, delete, search, or sort
4. **Watch animations** as operations execute step-by-step
5. **Follow code execution** in the side panel with highlighted lines
6. **Learn** from the educational content and complexity analysis

## Technologies Used

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Code Highlighting**: Prism.js integration
- **Deployment**: Optimized for Vercel/Netlify

## Project Structure

```
dsa-visualizer/
├── app/                    # Next.js app directory
│   ├── arrays/            # Array visualizer page
│   ├── linked-lists/      # Linked list visualizer page
│   ├── stacks/            # Stack visualizer page
│   ├── queues/            # Queue visualizer page
│   ├── binary-trees/      # Binary tree visualizer page
│   ├── sorting/           # Sorting algorithms page
│   └── about/             # About page
├── components/            # React components
│   ├── visualizers/       # Data structure visualizers
│   ├── ui/               # UI components
│   ├── Hero.tsx          # Landing page hero
│   ├── Navbar.tsx        # Navigation component
│   └── Footer.tsx        # Footer component
├── lib/                   # Utilities
└── public/               # Static assets
```

## Features in Detail

### Interactive Visualizations
- Real-time element highlighting during operations
- Smooth animations for insertions, deletions, and traversals
- Color-coded states (inserting: green, removing: red, searching: yellow, found: green)

### Code Education
- Step-by-step code execution with line highlighting
- Detailed explanations for each operation
- Time and space complexity analysis

### User Experience
- Responsive design for all devices
- Intuitive controls and forms
- Clear visual feedback for all operations
- Error handling and validation

## Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Areas for Contribution
- Additional sorting algorithms (Quick Sort, Merge Sort, Heap Sort)
- More data structures (Hash Tables, Graphs, Heaps)
- Advanced tree operations (AVL, Red-Black trees)
- Performance optimizations
- Accessibility improvements
- Mobile experience enhancements

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with modern React patterns and best practices
- Inspired by educational visualization tools
- Thanks to the open-source community for the amazing libraries

---

**Ready to visualize data structures?** [Get Started](http://localhost:3000) 🚀
