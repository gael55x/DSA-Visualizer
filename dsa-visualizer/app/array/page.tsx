import Navbar from "../../components/Navbar";
import ArrayVisualizer from "../../components/visualizers/ArrayVisualizer";
import Footer from "../../components/Footer";

export default function ArrayPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 text-center">Array Data Structure</h1>
          <div className="mb-8 max-w-3xl mx-auto">
            <p className="text-gray-700 mb-4">
              An array is a collection of elements stored at contiguous memory locations. 
              It is the simplest data structure where each element can be accessed using an index.
            </p>
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Common Array Operations:</h3>
              <ul className="list-disc pl-5 space-y-1">
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
      </main>
      <Footer />
    </div>
  );
} 