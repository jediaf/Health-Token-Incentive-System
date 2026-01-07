# HealthToken Academic Report

This directory contains the academic report for the HealthToken project in LaTeX format.

## Files

- `report.tex` - Main LaTeX document
- `images/` - Directory containing all figures and screenshots
  - `enhanced_dashboard_top.png` - Dashboard summary metrics
  - `enhanced_dashboard_bottom.png` - Batch submission analytics and metadata
  - `dashboard_top.png` - Original dashboard view (top section)
  - `dashboard_bottom.png` - Original dashboard view (bottom section)

## Compiling the Report

### Prerequisites

You need a LaTeX distribution installed on your system:

**macOS:**
```bash
brew install --cask mactex
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install texlive-full
```

**Windows:**
Download and install MiKTeX from https://miktex.org/

### Compilation Commands

```bash
# Navigate to the Report directory
cd Report

# Compile the LaTeX document (run twice for references)
pdflatex report.tex
pdflatex report.tex

# Clean up auxiliary files (optional)
rm -f *.aux *.log *.out *.toc
```

### Alternative: Using Online LaTeX Editors

If you don't want to install LaTeX locally, you can use online editors:

1. **Overleaf** (https://www.overleaf.com/)
   - Create a new project
   - Upload `report.tex` and all files from `images/` directory
   - Click "Recompile" to generate PDF

2. **ShareLaTeX** (https://www.sharelatex.com/)
   - Similar process to Overleaf

## Output

After compilation, you will get:
- `report.pdf` - The final academic report in PDF format

## Report Structure

1. **Abstract** - Summary of the HealthToken system and pilot results
2. **Introduction** - Problem statement and motivation
3. **Fundamentals** - Blockchain, Ethereum, smart contracts, tokenization
4. **Related Works** - Literature review and research gap
5. **System Proposal** - Architecture and reward mechanism design
6. **Implementation** - Technology stack and deployment details
7. **Results and Discussion** - Pilot simulation results and analysis
8. **Conclusion** - Key findings and future work
9. **Bibliography** - Academic references

## Key Results Highlighted in Report

- **34.29% improvement** in compliance rate (Incentive vs Control)
- **89.29%** compliance rate for incentive group
- **77.6%** batch submission rate
- **797.5 HLT** total tokens distributed
- **79.8 HLT** average per user

## Authors

- Ceyda Arık (ceydaarik@mu.edu.tr)
- Hakan Kayacı (hakankayaci@mu.edu.tr)

**Course:** CENG3550 - Blockchain and Applications  
**Instructor:** Prof. Enis Karaarslan  
**Institution:** Muğla Sıtkı Koçman University

## License

This academic report is part of the HealthToken project coursework.
