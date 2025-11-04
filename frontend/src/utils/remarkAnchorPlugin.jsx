import { visit } from 'unist-util-visit'

export default function remarkAnchorPlugin() {
  return (tree) => {
    visit(tree, 'heading', (node) => {
      if (node.children && node.children.length > 0) {
        const lastChild = node.children[node.children.length - 1]

        console.log('Heading found:', node) // DEBUG
        console.log('Last child:', lastChild) // DEBUG

        if (lastChild.type === 'text') {
          // Match {#anchor-id}
          const match = lastChild.value.match(/\{#([^}]+)\}/)
          console.log('Match result:', match) // DEBUG

          if (match) {
            const anchorId = match[1]
            console.log('Setting anchor ID:', anchorId) // DEBUG

            // Remove {#anchor-id} from text
            lastChild.value = lastChild.value.replace(/\s*\{#[^}]+\}/, '')
            console.log('Updated text:', lastChild.value) // DEBUG

            // Set the ID on the heading
            if (!node.data) node.data = {}
            if (!node.data.hProperties) node.data.hProperties = {}
            node.data.hProperties.id = anchorId
            console.log('Node hProperties:', node.data.hProperties) // DEBUG
          }
        }
      }
    })
  }
}