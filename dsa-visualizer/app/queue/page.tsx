import QueueVisualizer from "../../components/visualizers/QueueVisualizer";

export default function QueuePage() {
  return (
    <div className="py-8 bg-slate-900">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-slate-100">Queue Data Structure</h1>
        <div className="mb-8 max-w-3xl mx-auto">
          <p className="text-slate-300 mb-4">
            A queue is a linear data structure that follows the First-In-First-Out (FIFO) principle. 
            Elements are added at the rear and removed from the front of the queue.
          </p>
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
            <h3 className="font-semibold mb-4 text-slate-100">Common Queue Operations:</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>Enqueue: O(1) - Add element to the rear</li>
              <li>Dequeue: O(1) - Remove element from the front</li>
              <li>Front: O(1) - View the front element without removing</li>
              <li>Rear: O(1) - View the rear element without removing</li>
              <li>IsEmpty: O(1) - Check if queue is empty</li>
              <li>Size: O(1) - Get the number of elements</li>
            </ul>
          </div>
        </div>
        <QueueVisualizer />
      </div>
    </div>
  );
} 