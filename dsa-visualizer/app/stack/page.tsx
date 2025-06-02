import StackVisualizer from "../../components/visualizers/StackVisualizer";

export default function StackPage() {
  return (
    <div className="py-8 bg-slate-900">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-slate-100">Stack Data Structure</h1>
        <div className="mb-8 max-w-3xl mx-auto">
          <p className="text-slate-300 mb-4">
            A stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle. 
            Elements are added and removed from the same end, called the top of the stack.
          </p>
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
            <h3 className="font-semibold mb-4 text-slate-100">Common Stack Operations:</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>Push: O(1) - Add element to the top</li>
              <li>Pop: O(1) - Remove element from the top</li>
              <li>Peek/Top: O(1) - View the top element without removing</li>
              <li>IsEmpty: O(1) - Check if stack is empty</li>
              <li>Size: O(1) - Get the number of elements</li>
            </ul>
          </div>
        </div>
        <StackVisualizer />
      </div>
    </div>
  );
} 