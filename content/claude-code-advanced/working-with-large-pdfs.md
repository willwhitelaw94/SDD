---
title: "Working with Large PDFs"
description: "How to handle large PDF documents in Claude Code"
---

# Working with Large PDFs in Claude Code

Claude Code can read PDFs, but large documents (100+ pages) often exceed context limits and cause issues. Here's how to handle them effectively.

## The Problem

When you ask Claude Code to read a large PDF:
- The entire document loads into context
- Large files exceed token limits
- Claude may get stuck retrying failed reads
- Context fills up, reducing space for actual work

## The Solution: Convert to Text First

Convert PDFs to text files, then search/read specific sections as needed.

### Quick Conversion

Ask Claude to convert the PDF:

```
Convert the Support at Home PDF to text
```

Or use the `/pdf-to-text` skill.

### Manual Conversion

```bash
python3 << 'EOF'
import pypdf

pdf_path = "/path/to/large-document.pdf"
output_path = "/path/to/output.txt"

reader = pypdf.PdfReader(pdf_path)
print(f"Total pages: {len(reader.pages)}")

with open(output_path, 'w') as f:
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        f.write(f"\n--- Page {i+1} ---\n")
        f.write(text)

print(f"Saved to: {output_path}")
EOF
```

## Working with Converted Text

Once converted, you can:

### Search for Topics

```bash
grep -n "funding" document.txt | head -20
```

### Read Specific Sections

```
Read document.txt from line 500 to 700
```

### Find Chapter Locations

```bash
grep -n "Chapter [0-9]" document.txt
```

## Where to Save Converted Files

| Document Type | Location |
|--------------|----------|
| Government/regulatory docs | `.tc-docs/content/context/government-resources/` |
| Meeting transcripts | Scratchpad or context folder |
| Temporary analysis | Scratchpad directory |

## Alternative Approaches

If you can't convert to text:

1. **Claude.ai Web** - Upload PDFs directly (handles large files better)
2. **Extract specific pages** - Use `pdftk` to pull out relevant sections
3. **Screenshot pages** - Claude can read images of specific pages
4. **Copy-paste sections** - Open PDF, copy relevant text manually

## Tips

- **Name files descriptively** with version: `support-at-home-manual-v4.2.txt`
- **Keep converted files** in version control for team access
- **Create domain docs** that reference specific sections (chapter, page numbers)
- **Use grep first** to find relevant sections before reading

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `pypdf` not found | Try `PyPDF2` or install with `pip install pypdf` |
| Encrypted PDF | Need password or use different tool |
| Scanned PDF (images) | Need OCR tool like `tesseract` |
| Poor text extraction | Complex layouts may not extract cleanly |

## Example Workflow

1. **Receive large PDF** (e.g., 250-page government manual)
2. **Convert to text** using pypdf
3. **Save to** `.tc-docs/content/context/government-resources/`
4. **Search** for relevant topics with grep
5. **Read specific sections** as needed
6. **Create domain docs** with "Government References" sections linking to manual chapters
