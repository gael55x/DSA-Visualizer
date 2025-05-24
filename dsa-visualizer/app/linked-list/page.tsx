import Navbar from "../../components/Navbar";
import LinkedListVisualizer from "../../components/visualizers/LinkedListVisualizer";
import Footer from "../../components/Footer";

export default function LinkedListPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 text-center">Linked List Data Structure</h1>
          <div className="mb-8 max-w-3xl mx-auto">
            <p className="text-white-700 mb-4">
              A linked list is a linear data structure where elements are not stored at contiguous memory locations. 
              Each element (node) contains a data field and a reference (link) to the next node.
            </p>
            <div className="bg-black-50 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Common Linked List Operations:</h3>
              <ul className="list-disc pl-5 space-y-1">
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
      </main>
      <Footer />
    </div>
  );
} 