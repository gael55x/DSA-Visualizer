export default function Features() {
  const features = [
    {
      title: "Arrays",
      description: "Visualize array operations like insertion, deletion, and searching with step-by-step animations.",
      icon: "📊",
    },
    {
      title: "Linked Lists",
      description: "See how linked list nodes connect and how operations modify the structure in real-time.",
      icon: "🔗",
    },
    {
      title: "Stacks",
      description: "Understand LIFO (Last-In-First-Out) operations with interactive push and pop visualizations.",
      icon: "📚",
    },
    {
      title: "Queues",
      description: "Learn FIFO (First-In-First-Out) principles through enqueue and dequeue animations.",
      icon: "🚶",
    },
  ];

  return (
    <div id="features" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Data Structures You Can Explore
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 