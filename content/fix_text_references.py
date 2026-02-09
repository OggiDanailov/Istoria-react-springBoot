#!/usr/bin/env python3
"""
Script to automatically fix textReference fields in quiz JSON files.
Converts both formats:
1. "Section 4: The Resumption of Conflict" -> "#the-resumption-of-conflict"
2. "text_reference" -> "textReference"
"""

import json
import re
import sys

def section_to_anchor(text):
    """
    Convert section reference to markdown anchor link.
    Examples:
    - "Section 4: The Resumption of Conflict" -> "#the-resumption-of-conflict"
    - "Section 2: Literary Sources" -> "#literary-sources"
    - "Section 1: Introduction" -> "#introduction"
    """
    # Remove "Section X:" prefix (handles Section 1:, Section 2:, etc.)
    text = re.sub(r'^Section \d+:\s*', '', text, flags=re.IGNORECASE)

    # Convert to lowercase
    text = text.lower()

    # Replace spaces with hyphens
    text = text.replace(' ', '-')

    # Remove special characters (keep only letters, numbers, and hyphens)
    text = re.sub(r'[^a-z0-9\-]', '', text)

    # Remove multiple consecutive hyphens
    text = re.sub(r'-+', '-', text)

    # Remove leading/trailing hyphens
    text = text.strip('-')

    # Add # prefix
    return f'#{text}'

def fix_quiz_json(input_file, output_file=None):
    """
    Fix textReference fields in a quiz JSON file.
    """
    # Read the input file
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Track changes
    changes_made = 0

    # Process each question
    if 'questions' in data:
        for question in data['questions']:
            # Check for text_reference (snake_case) and convert to textReference
            if 'text_reference' in question:
                question['textReference'] = question.pop('text_reference')
                changes_made += 1

            # Fix textReference if it starts with "Section"
            if 'textReference' in question:
                old_ref = question['textReference']
                if old_ref.startswith('Section'):
                    new_ref = section_to_anchor(old_ref)
                    question['textReference'] = new_ref
                    changes_made += 1
                    print(f"  Converted: '{old_ref}' -> '{new_ref}'")

    # Determine output file
    if output_file is None:
        # Add _fixed suffix before extension
        if input_file.endswith('.json'):
            output_file = input_file[:-5] + '_fixed.json'
        else:
            output_file = input_file + '_fixed'

    # Write the output file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\n✓ Processed {input_file}")
    print(f"  Changes made: {changes_made}")
    print(f"  Output saved to: {output_file}")

    return output_file

def main():
    if len(sys.argv) < 2:
        print("Usage: python fix_text_references.py <input_file.json> [output_file.json]")
        print("\nExample:")
        print("  python fix_text_references.py batch_3.json")
        print("  python fix_text_references.py batch_3.json batch_3_corrected.json")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None

    try:
        fix_quiz_json(input_file, output_file)
    except FileNotFoundError:
        print(f"Error: File '{input_file}' not found")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in '{input_file}': {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()