import { visit } from 'unist-util-visit'

export default function remarkAnchorPlugin() {
  return (tree) => {
    visit(tree, 'heading', (node) => {
      if (node.children && node.children.length > 0) {
        const lastChild = node.children[node.children.length - 1]
        if (lastChild.type === 'text') {
          // Match {#anchor-id}
          const match = lastChild.value.match(/\{#([^}]+)\}/)
          if (match) {
            const anchorId = match[1]
            // Remove {#anchor-id} from text
            lastChild.value = lastChild.value.replace(/\s*\{#[^}]+\}/, '')
            // Set the ID on the heading
            if (!node.data) node.data = {}
            if (!node.data.hProperties) node.data.hProperties = {}
            node.data.hProperties.id = anchorId
          }
        }
      }
    })
  }
}