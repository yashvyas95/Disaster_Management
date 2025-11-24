#!/bin/bash
# LaTeX Compilation Script for Disaster Management System V2 Report
# Author: Yash Vyas
# Usage: ./compile_latex.sh or bash compile_latex.sh

echo "=========================================="
echo "LaTeX Compilation - Disaster Management V2"
echo "=========================================="

# Check if pdflatex is installed
if ! command -v pdflatex &> /dev/null; then
    echo "Error: pdflatex not found. Please install a LaTeX distribution (TeX Live, MiKTeX, etc.)"
    exit 1
fi

# Set the document name (without extension)
DOC_NAME="Disaster_Management_System_V2_Report"

echo "Starting compilation of ${DOC_NAME}.tex..."

# First pass - generate .aux file
echo "Pass 1/4: Initial compilation..."
pdflatex -shell-escape -interaction=nonstopmode "${DOC_NAME}.tex" > compile_log.txt 2>&1

if [ $? -ne 0 ]; then
    echo "Error in first pass. Check compile_log.txt for details."
    echo "Last few lines of error log:"
    tail -10 compile_log.txt
    exit 1
fi

# Second pass - resolve references and build indexes
echo "Pass 2/4: Building table of contents and references..."
pdflatex -shell-escape -interaction=nonstopmode "${DOC_NAME}.tex" >> compile_log.txt 2>&1

if [ $? -ne 0 ]; then
    echo "Error in second pass. Check compile_log.txt for details."
    echo "Last few lines of error log:"
    tail -10 compile_log.txt
    exit 1
fi

# Third pass - finalize references
echo "Pass 3/4: Finalizing cross-references..."
pdflatex -shell-escape -interaction=nonstopmode "${DOC_NAME}.tex" >> compile_log.txt 2>&1

if [ $? -ne 0 ]; then
    echo "Error in third pass. Check compile_log.txt for details."
    echo "Last few lines of error log:"
    tail -10 compile_log.txt
    exit 1
fi

# Fourth pass - final compilation for perfect formatting
echo "Pass 4/4: Final compilation..."
pdflatex -shell-escape -interaction=nonstopmode "${DOC_NAME}.tex" >> compile_log.txt 2>&1

if [ $? -ne 0 ]; then
    echo "Error in final pass. Check compile_log.txt for details."
    echo "Last few lines of error log:"
    tail -10 compile_log.txt
    exit 1
fi

# Clean up auxiliary files (optional)
echo "Cleaning up auxiliary files..."
rm -f *.aux *.log *.toc *.out *.fls *.fdb_latexmk *.synctex.gz

# Check if PDF was created successfully
if [ -f "${DOC_NAME}.pdf" ]; then
    echo "✅ SUCCESS: ${DOC_NAME}.pdf generated successfully!"
    echo "📄 Document size: $(du -h ${DOC_NAME}.pdf | cut -f1)"
    echo "📍 Location: $(pwd)/${DOC_NAME}.pdf"
    
    # Optional: Open the PDF (uncomment for your system)
    # Linux: xdg-open "${DOC_NAME}.pdf"
    # macOS: open "${DOC_NAME}.pdf"
    # Windows: start "${DOC_NAME}.pdf"
    
else
    echo "❌ ERROR: PDF was not generated. Check compile_log.txt for issues."
    exit 1
fi

echo "=========================================="
echo "Compilation completed successfully!"
echo "=========================================="