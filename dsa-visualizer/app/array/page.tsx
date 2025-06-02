import ArrayVisualizer from "../../components/visualizers/ArrayVisualizer";

export default function ArrayPage() {
  return (
    <div className="py-8 bg-slate-900">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-slate-100">Array Data Structure</h1>
        <div className="mb-8 max-w-3xl mx-auto">
          <p className="text-slate-300 mb-4">
            An array is a collection of elements stored at contiguous memory locations. 
            It is the simplest data structure where each element can be accessed using an index.
          </p>
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
            <h3 className="font-semibold mb-4 text-slate-100">Common Array Operations:</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>Access: O(1) - Constant time to access any element by index</li>
              <li>Search: O(n) - Linear time to find an element</li>
              <li>Insert at end: O(1) - Constant time to add at the end</li>
              <li>Insert at position: O(n) - May require shifting elements</li>
              <li>Delete: O(n) - May require shifting elements</li>
            </ul>
          </div>
        </div>
        <ArrayVisualizer />
      </div>
    </div>
  );
} 