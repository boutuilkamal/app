# DNA Analysis Tool - Coach Guide

## 🧬 Overview

The DNA Analysis Tool allows coaches to upload and analyze client genetic reports using AI-powered technology. The system extracts genetic variants from any document format and generates comprehensive health insights based on 54 essential genes.

## 🎯 Features

### 1. Multi-Format Support
- **PDF**: Genetic test reports from 23andMe, AncestryDNA, etc.
- **CSV**: Raw genetic data files
- **TXT**: Text-based reports
- **Images** (PNG/JPG): Scanned reports or screenshots

### 2. AI-Powered Analysis
- Automatic variant extraction using OCR and LLM
- Pattern matching for 54 essential genes
- Risk level assessment (Optimal 🟢 / Moderate 🟠 / High Risk 🔴)
- OpenAI integration for enhanced extraction

### 3. Comprehensive Reporting
- Overall health score
- Traffic light visualization
- Genetic strengths identification
- Risk areas and recommendations
- Results organized by 8 categories

## 📋 How to Use

### Step 1: Access the Tool

Navigate to: `/coach/dna-analysis`

**Requirements**:
- Coach account (authenticated)
- Client ID (UUID of the client)
- DNA report file (max 10MB)

### Step 2: Upload DNA Report

1. Enter the **Client ID** (you can get this from your client list)
2. Click the upload area or drag & drop the DNA report file
3. Supported formats: PDF, CSV, TXT, PNG, JPG
4. Click "Analyze DNA Report"

### Step 3: Wait for Analysis

The AI service will:
- Extract text from the document (OCR if needed)
- Identify genetic variants for 54 genes
- Calculate risk levels
- Generate personalized recommendations

⏱️ **Analysis Time**: 10-60 seconds depending on file size

### Step 4: Review Results

The report includes:

#### Overview Cards
- 🟢 **Optimal Variants**: Genes with no concerning variants
- 🟠 **Moderate Variants**: Genes needing attention
- 🔴 **High Risk Variants**: Genes requiring intervention

#### Analysis Summary
- Overall genetic health score (0-100%)
- Text summary of findings

#### Genetic Strengths
- Areas where the client has favorable genetics
- Natural advantages for health and performance

#### Areas for Attention
- Genetic risks identified
- Specific recommendations for each risk

#### Detailed Gene Analysis
Results organized by category:
1. **Metabolism & Weight** (FTO, MC4R, PPARG, ADRB2, UCP1)
2. **Insulin Sensitivity** (TCF7L2, IRS1, PPARGC1A, ADIPOQ)
3. **Inflammation/Detox** (IL6, TNF, CRP, GSTM1, GSTT1, SOD2)
4. **Methylation & Longevity** (MTHFR, MTR, MTRR, COMT, APOE, FOXO3, SIRT1)
5. **Muscle Recovery** (ACTN3, ACE, AMPD1, IL6R, CKM, VDR)
6. **Stress/Hormones** (NR3C1, FKBP5, OXTR, SHBG, CYP19A1)
7. **Cognitive** (BDNF, DRD2, SLC6A4, KIBRA)
8. **Cardiovascular** (NOS3, AGT, LPL, CETP, APOA5, PON1)

Each gene shows:
- Gene symbol and full name
- Function description
- Detected variant (e.g., CT, AA, GG)
- Risk level with color coding
- Specific recommendations

## 🔍 Understanding Risk Levels

### 🟢 Optimal (Green)
- No concerning variants detected
- Favorable genetic profile
- Continue standard health practices

### 🟠 Moderate (Orange)
- Heterozygous variants (mixed genes)
- Moderate risk factors
- Implement targeted interventions
- Monitor relevant biomarkers

### 🔴 High Risk (Red)
- Homozygous risk variants
- Requires immediate attention
- Aggressive intervention protocols
- Regular monitoring essential

## 💡 Sample Use Cases

### Case 1: MTHFR Gene
**Detected**: CT (Moderate)
**Impact**: 40% reduced enzyme activity
**Recommendations**:
- Methylfolate 400-800mcg daily
- Methylcobalamin B12 1000mcg
- Monitor homocysteine levels

### Case 2: FTO Gene
**Detected**: AA (High Risk)
**Impact**: Increased appetite, obesity risk
**Recommendations**:
- Strict meal timing with IF protocols
- Very high protein (2.0-2.5g/kg)
- Increase NEAT
- Track calories consistently

### Case 3: ACTN3 Gene
**Detected**: RR (Optimal)
**Impact**: High fast-twitch muscle fibers
**Recommendations**:
- Excel at power/strength training
- Sprint training highly effective
- Lower reps, heavy weight

## 🔐 Security & Privacy

- **Coach-Only Access**: Only authenticated coaches can upload reports
- **Client Verification**: System verifies coach has access to client
- **Secure Storage**: All reports encrypted at rest
- **HIPAA Compliant**: Follow all data protection protocols

## 📊 API Endpoints

### Upload and Analyze
```
POST /api/v1/reports/dna/upload
Headers: Authorization: Bearer <token>
Body: FormData with 'file' and 'clientId'
```

### Get Report Details
```
GET /api/v1/reports/dna/:reportId
Headers: Authorization: Bearer <token>
```

### Get Client Reports
```
GET /api/v1/reports/dna/client/:clientId
Headers: Authorization: Bearer <token>
```

### Export PDF
```
GET /api/v1/reports/dna/:reportId/export/pdf
Headers: Authorization: Bearer <token>
```

### Delete Report
```
DELETE /api/v1/reports/dna/:reportId
Headers: Authorization: Bearer <token>
```

## 🛠️ Troubleshooting

### "Upload failed" Error
- Check file size (max 10MB)
- Verify file format (PDF, CSV, TXT, PNG, JPG)
- Ensure valid authentication token
- Confirm client ID is correct

### "No variants detected"
- Document may not contain genetic data
- Try uploading raw data file (CSV format)
- Check if document is readable (not corrupted)

### "Analysis timeout"
- Large files may take longer
- Try again with smaller file
- Check AI service status

### "Coach does not have access"
- Verify client is assigned to your account
- Check client ID is correct
- Contact admin if issue persists

## 📱 Future Enhancements

Coming soon:
- ✅ PDF export of reports
- ✅ Comparison with previous reports
- ✅ Automated program generation based on DNA
- ✅ Direct integration with supplement protocols
- ✅ Blood biomarker + DNA combined analysis

## 📞 Support

For technical issues or questions:
- Email: support@healthcoach.com
- Documentation: `/docs/dna-analysis`
- Video Tutorial: Available in coach dashboard

---

**Last Updated**: 2026-01-02
**Version**: 1.0.0
