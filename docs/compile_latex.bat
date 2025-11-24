@echo off
REM LaTeX Compilation Script for Disaster Management System V2 Report
REM Author: Yash Vyas
REM Usage: compile_latex.bat

echo ==========================================
echo LaTeX Compilation - Disaster Management V2
echo ==========================================

REM Check if pdflatex is installed
where pdflatex >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: pdflatex not found. Please install a LaTeX distribution ^(TeX Live, MiKTeX, etc.^)
    pause
    exit /b 1
)

REM Set the document name (without extension)
set DOC_NAME=Disaster_Management_System_V2_Report

echo Starting compilation of %DOC_NAME%.tex...

REM First pass - generate .aux file
echo Pass 1/4: Initial compilation...
pdflatex -shell-escape -interaction=nonstopmode "%DOC_NAME%.tex" > compile_log.txt 2>&1

if %errorlevel% neq 0 (
    echo Error in first pass. Check compile_log.txt for details.
    echo Last few lines of error log:
    powershell "Get-Content compile_log.txt | Select-Object -Last 10"
    pause
    exit /b 1
)

REM Second pass - resolve references and build indexes
echo Pass 2/4: Building table of contents and references...
pdflatex -shell-escape -interaction=nonstopmode "%DOC_NAME%.tex" >> compile_log.txt 2>&1

if %errorlevel% neq 0 (
    echo Error in second pass. Check compile_log.txt for details.
    echo Last few lines of error log:
    powershell "Get-Content compile_log.txt | Select-Object -Last 10"
    pause
    exit /b 1
)

REM Third pass - finalize references
echo Pass 3/4: Finalizing cross-references...
pdflatex -shell-escape -interaction=nonstopmode "%DOC_NAME%.tex" >> compile_log.txt 2>&1

if %errorlevel% neq 0 (
    echo Error in third pass. Check compile_log.txt for details.
    echo Last few lines of error log:
    powershell "Get-Content compile_log.txt | Select-Object -Last 10"
    pause
    exit /b 1
)

REM Fourth pass - final compilation for perfect formatting
echo Pass 4/4: Final compilation...
pdflatex -shell-escape -interaction=nonstopmode "%DOC_NAME%.tex" >> compile_log.txt 2>&1

if %errorlevel% neq 0 (
    echo Error in final pass. Check compile_log.txt for details.
    echo Last few lines of error log:
    powershell "Get-Content compile_log.txt | Select-Object -Last 10"
    pause
    exit /b 1
)

REM Clean up auxiliary files (optional)
echo Cleaning up auxiliary files...
del /q *.aux *.log *.toc *.out *.fls *.fdb_latexmk *.synctex.gz 2>nul

REM Check if PDF was created successfully
if exist "%DOC_NAME%.pdf" (
    echo ✅ SUCCESS: %DOC_NAME%.pdf generated successfully!
    for %%I in ("%DOC_NAME%.pdf") do echo 📄 Document size: %%~zI bytes
    echo 📍 Location: %cd%\%DOC_NAME%.pdf
    
    REM Optional: Open the PDF
    REM start "%DOC_NAME%.pdf"
    
) else (
    echo ❌ ERROR: PDF was not generated. Check compile_log.txt for issues.
    pause
    exit /b 1
)

echo ==========================================
echo Compilation completed successfully!
echo ==========================================
pause