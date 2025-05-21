import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          DSA Visualizer
        </Link>
        <div className="flex space-x-6">
          <Link href="/array" className="text-gray-600 hover:text-blue-600">
            Array
          </Link>
          <Link href="/linked-list" className="text-gray-600 hover:text-blue-600">
            Linked List
          </Link>
          <Link href="/stack" className="text-gray-600 hover:text-blue-600">
            Stack
          </Link>
          <Link href="/queue" className="text-gray-600 hover:text-blue-600">
            Queue
          </Link>
        </div>
      </div>
    </nav>
  );
} 