import LinkedListVisualizer from "../../components/visualizers/LinkedListVisualizer";

export default function LinkedListPage() {
  return (
    <div className="py-8 bg-slate-900">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-slate-100">Linked List Data Structure</h1>
        <div className="mb-8 max-w-3xl mx-auto">
          <p className="text-slate-300 mb-4">
            A linked list is a linear data structure where elements are not stored at contiguous memory locations. 
            Each element (node) contains a data field and a reference (link) to the next node.
          </p>
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
            <h3 className="font-semibold mb-4 text-slate-100">Common Linked List Operations:</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>Access: O(n) - Need to traverse from head</li>
              <li>Search: O(n) - Linear time to find an element</li>
              <li>Insert at beginning: O(1) - Constant time</li>
              <li>Insert at end: O(n) - Need to traverse to end first</li>
              <li>Insert at position: O(n) - Need to traverse to position</li>
              <li>Delete: O(n) - Need to find the node first</li>
            </ul>
          </div>
        </div>
        <LinkedListVisualizer />
      </div>
    </div>
  );
} 