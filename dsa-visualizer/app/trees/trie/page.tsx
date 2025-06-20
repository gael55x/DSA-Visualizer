import TreeComingSoon from '../../../components/TreeComingSoon';

export default function TriePage() {
  return (
    <TreeComingSoon
      title="Trie (Prefix Tree)"
      description="Tree data structure used for efficient storage and retrieval of strings, with powerful prefix-based operations."
      features={[
        "Interactive string insertion and search",
        "Visual prefix highlighting",
        "Autocomplete functionality demonstration",
        "Word counting and prefix counting",
        "Animated string traversal",
        "Dictionary and spell-checker applications"
      ]}
      complexity={{
        search: "O(m)",
        insert: "O(m)",
        delete: "O(m)",
        space: "O(ALPHABET_SIZE * N * M)"
      }}
    />
  );
}

export const metadata = {
  title: 'Trie (Prefix Tree) - Coming Soon | DSA Visualizer',
  description: 'Interactive Trie visualization with string operations and prefix matching - coming soon to DSA Visualizer.',
}; 