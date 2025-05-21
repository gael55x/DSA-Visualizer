import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 py-8 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600">
              © {new Date().getFullYear()} DSA Visualizer. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link href="/array" className="text-gray-600 hover:text-blue-600">
              Arrays
            </Link>
            <Link href="/linked-list" className="text-gray-600 hover:text-blue-600">
              Linked Lists
            </Link>
            <Link href="/stack" className="text-gray-600 hover:text-blue-600">
              Stacks
            </Link>
            <Link href="/queue" className="text-gray-600 hover:text-blue-600">
              Queues
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 