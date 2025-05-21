import Link from "next/link";

export default function Hero() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
          Learn Data Structures & Algorithms Visually
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Interactive visualizations to help you understand how data structures and algorithms work.
          Perfect for students, developers, and anyone curious about computer science fundamentals.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/array" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Start Learning
          </Link>
          <Link 
            href="#features" 
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Explore Features
          </Link>
        </div>
      </div>
    </div>
  );
} 