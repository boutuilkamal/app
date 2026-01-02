export const BIOMARKER_CATEGORIES = {
  METABOLIC: 'Metabolic Health',
  CARDIOVASCULAR: 'Cardiovascular',
  INFLAMMATION: 'Inflammation',
  HORMONES: 'Hormones',
  VITAMINS: 'Vitamins & Minerals',
  THYROID: 'Thyroid Function',
  LIVER: 'Liver Function',
  KIDNEY: 'Kidney Function',
  BLOOD: 'Blood Health',
} as const;

export interface BiomarkerRange {
  min: number;
  max: number;
}

export interface BiomarkerData {
  name: string;
  shortName: string;
  category: string;
  unit: string;
  function: string;
  optimal: BiomarkerRange;
  moderate?: BiomarkerRange;
  critical?: BiomarkerRange;
  interventions: {
    optimal: string[];
    moderate: string[];
    critical: string[];
  };
  relatedGenes: string[];
}

export const BIOMARKER_DATA: BiomarkerData[] = [
  // ===== METABOLIC HEALTH =====
  {
    name: 'Fasting Glucose',
    shortName: 'Glucose',
    category: BIOMARKER_CATEGORIES.METABOLIC,
    unit: 'mg/dL',
    function: 'Primary blood sugar marker. Indicates glucose metabolism and diabetes risk.',
    optimal: { min: 70, max: 85 },
    moderate: { min: 86, max: 99 },
    critical: { min: 100, max: 200 },
    interventions: {
      optimal: [
        'Maintain balanced diet',
        'Regular physical activity',
        'Continue healthy habits',
      ],
      moderate: [
        'Reduce refined carbohydrates',
        'Increase fiber intake (30-40g/day)',
        'Resistance training 3x/week',
        'Consider berberine 500mg 2-3x/day',
        'Monitor fasting glucose monthly',
      ],
      critical: [
        'Low glycemic index diet',
        'Eliminate refined sugars',
        'Berberine 500mg 3x/day before meals',
        'Alpha-lipoic acid 600mg/day',
        'Chromium picolinate 200-400mcg',
        'Exercise daily (30+ min)',
        'Medical evaluation recommended',
        'Continuous glucose monitor',
      ],
    },
    relatedGenes: ['TCF7L2', 'IRS1', 'PPARG', 'FTO'],
  },
  {
    name: 'Hemoglobin A1c',
    shortName: 'HbA1c',
    category: BIOMARKER_CATEGORIES.METABOLIC,
    unit: '%',
    function: '3-month average blood sugar. Gold standard for diabetes screening and monitoring.',
    optimal: { min: 4.5, max: 5.2 },
    moderate: { min: 5.3, max: 5.6 },
    critical: { min: 5.7, max: 10.0 },
    interventions: {
      optimal: [
        'Continue current diet',
        'Regular activity',
        'Annual monitoring',
      ],
      moderate: [
        'Reduce carbohydrate intake',
        'Increase protein and fiber',
        'Regular exercise (150+ min/week)',
        'Cinnamon supplementation',
        'Monitor every 3-6 months',
      ],
      critical: [
        'Low-carb or ketogenic diet',
        'Berberine 1500mg/day',
        'Alpha-lipoic acid',
        'Resistance training 4-5x/week',
        'Medical intervention likely needed',
        'Monitor every 3 months',
        'Diabetes education program',
      ],
    },
    relatedGenes: ['TCF7L2', 'IRS1', 'PPARGC1A'],
  },
  {
    name: 'Fasting Insulin',
    shortName: 'Insulin',
    category: BIOMARKER_CATEGORIES.METABOLIC,
    unit: 'μIU/mL',
    function: 'Measures insulin levels. Early marker of insulin resistance before glucose rises.',
    optimal: { min: 2, max: 5 },
    moderate: { min: 6, max: 10 },
    critical: { min: 11, max: 50 },
    interventions: {
      optimal: [
        'Excellent insulin sensitivity',
        'Maintain current habits',
        'Flexible diet approach',
      ],
      moderate: [
        'Time-restricted eating (16:8)',
        'Lower carbohydrate intake',
        'Increase physical activity',
        'Magnesium supplementation',
        'Prioritize sleep quality',
      ],
      critical: [
        'Intermittent fasting or low-carb diet',
        'Berberine 500mg 3x/day',
        'Inositol 2-4g/day',
        'Magnesium 400-600mg',
        'HIIT + resistance training',
        'Eliminate refined sugars',
        'Medical evaluation for metabolic syndrome',
      ],
    },
    relatedGenes: ['IRS1', 'PPARG', 'TCF7L2', 'ADIPOQ'],
  },
  {
    name: 'Triglycerides',
    shortName: 'TG',
    category: BIOMARKER_CATEGORIES.METABOLIC,
    unit: 'mg/dL',
    function: 'Blood fat levels. High levels indicate insulin resistance and cardiovascular risk.',
    optimal: { min: 40, max: 80 },
    moderate: { min: 81, max: 149 },
    critical: { min: 150, max: 500 },
    interventions: {
      optimal: [
        'Excellent metabolic health',
        'Continue current diet',
        'Regular activity',
      ],
      moderate: [
        'Reduce carbohydrate intake',
        'Omega-3 supplementation (2g EPA/DHA)',
        'Limit alcohol',
        'Increase cardio exercise',
        'Reduce sugar intake',
      ],
      critical: [
        'Low-carb diet',
        'High-dose omega-3 (3-4g EPA/DHA)',
        'Eliminate refined sugars completely',
        'Avoid/limit alcohol',
        'Niacin (under medical supervision)',
        'Regular aerobic exercise',
        'Medical evaluation for metabolic syndrome',
      ],
    },
    relatedGenes: ['APOA5', 'LPL', 'PPARG'],
  },

  // ===== CARDIOVASCULAR =====
  {
    name: 'Total Cholesterol',
    shortName: 'TC',
    category: BIOMARKER_CATEGORIES.CARDIOVASCULAR,
    unit: 'mg/dL',
    function: 'Sum of all cholesterol types. General cardiovascular risk indicator.',
    optimal: { min: 150, max: 200 },
    moderate: { min: 201, max: 239 },
    critical: { min: 240, max: 400 },
    interventions: {
      optimal: [
        'Healthy cholesterol levels',
        'Continue heart-healthy diet',
        'Regular exercise',
      ],
      moderate: [
        'Mediterranean diet',
        'Plant sterols/stanols',
        'Increase soluble fiber',
        'Regular cardio exercise',
        'Omega-3 supplementation',
      ],
      critical: [
        'Strict diet modification',
        'High-dose plant sterols (2-3g)',
        'Red yeast rice (if appropriate)',
        'Niacin or other lipid therapy',
        'Daily exercise',
        'Medical evaluation recommended',
      ],
    },
    relatedGenes: ['APOE', 'LPL', 'CETP'],
  },
  {
    name: 'LDL Cholesterol',
    shortName: 'LDL-C',
    category: BIOMARKER_CATEGORIES.CARDIOVASCULAR,
    unit: 'mg/dL',
    function: '"Bad" cholesterol. Primary driver of atherosclerosis and heart disease.',
    optimal: { min: 50, max: 100 },
    moderate: { min: 101, max: 129 },
    critical: { min: 130, max: 300 },
    interventions: {
      optimal: [
        'Excellent LDL levels',
        'Continue current approach',
        'Heart-healthy lifestyle',
      ],
      moderate: [
        'Reduce saturated fat',
        'Plant sterols 2g/day',
        'Soluble fiber (oats, beans)',
        'Regular exercise',
        'Consider berberine',
      ],
      critical: [
        'Strict dietary changes',
        'Eliminate trans fats',
        'Plant sterols 2-3g',
        'Red yeast rice or statin therapy',
        'Daily exercise',
        'Medical consultation needed',
      ],
    },
    relatedGenes: ['APOE', 'PON1', 'LPL'],
  },
  {
    name: 'HDL Cholesterol',
    shortName: 'HDL-C',
    category: BIOMARKER_CATEGORIES.CARDIOVASCULAR,
    unit: 'mg/dL',
    function: '"Good" cholesterol. Removes cholesterol from arteries. Protective against heart disease.',
    optimal: { min: 60, max: 100 },
    moderate: { min: 40, max: 59 },
    critical: { min: 20, max: 39 },
    interventions: {
      optimal: [
        'Excellent HDL levels',
        'Continue healthy habits',
        'Cardioprotective',
      ],
      moderate: [
        'Increase aerobic exercise',
        'Omega-3 supplementation',
        'Moderate alcohol (if appropriate)',
        'Healthy fats (olive oil, nuts)',
        'Lose weight if overweight',
      ],
      critical: [
        'Daily cardio exercise',
        'High-dose omega-3',
        'Niacin to raise HDL',
        'Mediterranean diet',
        'Weight loss critical',
        'Avoid trans fats',
        'Medical evaluation needed',
      ],
    },
    relatedGenes: ['CETP', 'APOA5', 'LPL'],
  },
  {
    name: 'ApoB',
    shortName: 'ApoB',
    category: BIOMARKER_CATEGORIES.CARDIOVASCULAR,
    unit: 'mg/dL',
    function: 'Number of atherogenic particles. Superior cardiovascular risk marker to LDL-C.',
    optimal: { min: 40, max: 80 },
    moderate: { min: 81, max: 100 },
    critical: { min: 101, max: 200 },
    interventions: {
      optimal: [
        'Excellent particle count',
        'Low cardiovascular risk',
        'Continue current habits',
      ],
      moderate: [
        'Reduce saturated fat',
        'Increase fiber intake',
        'Regular cardio exercise',
        'Omega-3 supplementation',
        'Plant sterols',
      ],
      critical: [
        'Aggressive dietary changes',
        'High-dose plant sterols',
        'Omega-3 3-4g/day',
        'Daily exercise',
        'Likely need lipid-lowering therapy',
        'Medical consultation essential',
      ],
    },
    relatedGenes: ['APOE', 'APOA5', 'LPL'],
  },
  {
    name: 'Lipoprotein(a)',
    shortName: 'Lp(a)',
    category: BIOMARKER_CATEGORIES.CARDIOVASCULAR,
    unit: 'mg/dL',
    function: 'Genetic cardiovascular risk factor. Thrombotic and atherogenic.',
    optimal: { min: 0, max: 14 },
    moderate: { min: 15, max: 30 },
    critical: { min: 31, max: 200 },
    interventions: {
      optimal: [
        'Low genetic CV risk',
        'Standard prevention',
        'Regular monitoring',
      ],
      moderate: [
        'Optimize other CV risk factors',
        'High-dose omega-3',
        'Niacin may help (controversial)',
        'Regular exercise',
        'Monitor closely',
      ],
      critical: [
        'Aggressive CV risk reduction',
        'High-dose niacin (under supervision)',
        'Omega-3 3-4g/day',
        'Optimize LDL, blood pressure',
        'Daily exercise',
        'Consider PCSK9 inhibitors',
        'Cardiology consultation',
      ],
    },
    relatedGenes: ['APOE', 'LPA'],
  },
  {
    name: 'Homocysteine',
    shortName: 'Hcy',
    category: BIOMARKER_CATEGORIES.CARDIOVASCULAR,
    unit: 'μmol/L',
    function: 'Amino acid linked to cardiovascular disease, dementia, and stroke risk.',
    optimal: { min: 5, max: 8 },
    moderate: { min: 9, max: 12 },
    critical: { min: 13, max: 50 },
    interventions: {
      optimal: [
        'Excellent methylation',
        'Low vascular risk',
        'Continue B-vitamin intake',
      ],
      moderate: [
        'Methylfolate 400-800mcg',
        'Methylcobalamin (B12) 1000mcg',
        'P5P (B6) 25-50mg',
        'Increase leafy greens',
      ],
      critical: [
        'High-dose methylfolate 800-1000mcg',
        'Methylcobalamin 2000mcg+',
        'P5P 50-100mg',
        'TMG (betaine) 1000-2000mg',
        'Retest in 8-12 weeks',
        'Medical evaluation for MTHFR',
      ],
    },
    relatedGenes: ['MTHFR', 'MTR', 'MTRR', 'COMT'],
  },

  // ===== INFLAMMATION =====
  {
    name: 'C-Reactive Protein (high-sensitivity)',
    shortName: 'hs-CRP',
    category: BIOMARKER_CATEGORIES.INFLAMMATION,
    unit: 'mg/L',
    function: 'Systemic inflammation marker. Predicts cardiovascular disease and chronic disease risk.',
    optimal: { min: 0, max: 1.0 },
    moderate: { min: 1.1, max: 3.0 },
    critical: { min: 3.1, max: 20.0 },
    interventions: {
      optimal: [
        'Low inflammation',
        'Continue anti-inflammatory diet',
        'Regular exercise',
      ],
      moderate: [
        'Anti-inflammatory diet',
        'Omega-3 2-3g/day',
        'Curcumin 500-1000mg',
        'Regular exercise',
        'Identify inflammation sources',
      ],
      critical: [
        'Strict anti-inflammatory protocol',
        'High-dose omega-3 (3-4g EPA/DHA)',
        'Curcumin 1000-2000mg',
        'Eliminate refined foods',
        'Rule out infection/autoimmune disease',
        'Daily exercise',
        'Medical evaluation essential',
      ],
    },
    relatedGenes: ['IL6', 'TNF', 'CRP'],
  },
  {
    name: 'Erythrocyte Sedimentation Rate',
    shortName: 'ESR',
    category: BIOMARKER_CATEGORIES.INFLAMMATION,
    unit: 'mm/hr',
    function: 'Non-specific inflammation marker. Elevated in autoimmune diseases and infections.',
    optimal: { min: 0, max: 10 },
    moderate: { min: 11, max: 20 },
    critical: { min: 21, max: 100 },
    interventions: {
      optimal: [
        'No significant inflammation',
        'Standard health maintenance',
      ],
      moderate: [
        'Anti-inflammatory foods',
        'Omega-3 supplementation',
        'Monitor for symptoms',
        'Retest in 3 months',
      ],
      critical: [
        'Medical evaluation needed',
        'Rule out autoimmune disease',
        'Anti-inflammatory protocol',
        'Investigate underlying causes',
      ],
    },
    relatedGenes: ['IL6', 'TNF'],
  },
  {
    name: 'Fibrinogen',
    shortName: 'Fibrinogen',
    category: BIOMARKER_CATEGORIES.INFLAMMATION,
    unit: 'mg/dL',
    function: 'Clotting factor and inflammation marker. High levels increase cardiovascular risk.',
    optimal: { min: 200, max: 300 },
    moderate: { min: 301, max: 400 },
    critical: { min: 401, max: 700 },
    interventions: {
      optimal: [
        'Normal clotting and inflammation',
        'Standard health practices',
      ],
      moderate: [
        'Anti-inflammatory diet',
        'Omega-3 supplementation',
        'Regular exercise',
        'Nattokinase (if appropriate)',
      ],
      critical: [
        'Medical evaluation',
        'High-dose omega-3',
        'Nattokinase or lumbrokinase',
        'Daily exercise',
        'Investigate inflammation sources',
      ],
    },
    relatedGenes: ['IL6', 'CRP'],
  },

  // ===== HORMONES =====
  {
    name: 'Total Testosterone',
    shortName: 'Total T',
    category: BIOMARKER_CATEGORIES.HORMONES,
    unit: 'ng/dL',
    function: 'Primary male sex hormone. Affects muscle mass, libido, energy, and mood.',
    optimal: { min: 600, max: 1000 },
    moderate: { min: 400, max: 599 },
    critical: { min: 100, max: 399 },
    interventions: {
      optimal: [
        'Excellent testosterone levels',
        'Continue strength training',
        'Maintain healthy lifestyle',
      ],
      moderate: [
        'Increase resistance training',
        'Optimize sleep (8+ hours)',
        'Zinc 30-50mg',
        'Vitamin D optimization',
        'Reduce stress',
        'Adequate dietary fat',
      ],
      critical: [
        'Medical evaluation (possible TRT)',
        'Heavy resistance training',
        'Optimize all lifestyle factors',
        'Zinc, magnesium, vitamin D',
        'D-aspartic acid',
        'Tongkat ali or fenugreek',
        'Rule out underlying conditions',
      ],
    },
    relatedGenes: ['SHBG', 'CYP19A1'],
  },
  {
    name: 'Free Testosterone',
    shortName: 'Free T',
    category: BIOMARKER_CATEGORIES.HORMONES,
    unit: 'pg/mL',
    function: 'Bioavailable testosterone. More accurate than total testosterone for symptom correlation.',
    optimal: { min: 12, max: 25 },
    moderate: { min: 8, max: 11.9 },
    critical: { min: 1, max: 7.9 },
    interventions: {
      optimal: [
        'Excellent bioavailable testosterone',
        'Continue current approach',
      ],
      moderate: [
        'Lower SHBG if elevated (boron, magnesium)',
        'Resistance training',
        'Optimize body composition',
        'Reduce insulin spikes',
      ],
      critical: [
        'Medical evaluation needed',
        'Boron 6-9mg to lower SHBG',
        'Lifestyle optimization',
        'Consider TRT',
        'Rule out metabolic issues',
      ],
    },
    relatedGenes: ['SHBG', 'CYP19A1'],
  },
  {
    name: 'Estradiol',
    shortName: 'E2',
    category: BIOMARKER_CATEGORIES.HORMONES,
    unit: 'pg/mL',
    function: 'Primary estrogen. Important for bone health, libido, and mood in both sexes.',
    optimal: { min: 20, max: 30 },
    moderate: { min: 10, max: 19 },
    critical: { min: 1, max: 9 },
    interventions: {
      optimal: [
        'Balanced estrogen levels',
        'Healthy hormone balance',
      ],
      moderate: [
        'Support aromatization (zinc)',
        'Healthy body fat percentage',
        'Adequate dietary fat',
      ],
      critical: [
        'Medical evaluation',
        'Investigate aromatase function',
        'Support hormone production',
        'Consider HRT if appropriate',
      ],
    },
    relatedGenes: ['CYP19A1', 'COMT'],
  },
  {
    name: 'Sex Hormone Binding Globulin',
    shortName: 'SHBG',
    category: BIOMARKER_CATEGORIES.HORMONES,
    unit: 'nmol/L',
    function: 'Binds sex hormones. High levels reduce free testosterone.',
    optimal: { min: 20, max: 40 },
    moderate: { min: 41, max: 60 },
    critical: { min: 61, max: 150 },
    interventions: {
      optimal: [
        'Ideal SHBG levels',
        'Good free hormone availability',
      ],
      moderate: [
        'Boron 6-9mg/day',
        'Magnesium supplementation',
        'Reduce sugar/insulin spikes',
        'Resistance training',
      ],
      critical: [
        'Boron 9-12mg',
        'Nettle root extract',
        'Low-carb diet',
        'Vitamin D optimization',
        'Heavy resistance training',
        'Medical evaluation',
      ],
    },
    relatedGenes: ['SHBG'],
  },
  {
    name: 'Cortisol (morning)',
    shortName: 'Cortisol',
    category: BIOMARKER_CATEGORIES.HORMONES,
    unit: 'μg/dL',
    function: 'Stress hormone. Should be highest in morning. Chronic elevation harmful.',
    optimal: { min: 10, max: 18 },
    moderate: { min: 6, max: 9.9 },
    critical: { min: 1, max: 5.9 },
    interventions: {
      optimal: [
        'Healthy cortisol rhythm',
        'Good stress response',
        'Continue current habits',
      ],
      moderate: [
        'Stress management practices',
        'Adequate sleep',
        'Adaptogenic herbs',
        'Reduce caffeine if high',
      ],
      critical: [
        'Medical evaluation (adrenal insufficiency?)',
        'Investigate HPA axis',
        'Support adrenal function',
        'Licorice root (if low)',
        'Rule out Addison\'s disease',
      ],
    },
    relatedGenes: ['NR3C1', 'FKBP5'],
  },
  {
    name: 'DHEA-Sulfate',
    shortName: 'DHEA-S',
    category: BIOMARKER_CATEGORIES.HORMONES,
    unit: 'μg/dL',
    function: 'Precursor to sex hormones. Anti-aging and stress-buffering hormone.',
    optimal: { min: 250, max: 450 },
    moderate: { min: 150, max: 249 },
    critical: { min: 50, max: 149 },
    interventions: {
      optimal: [
        'Excellent DHEA levels',
        'Good stress resilience',
        'Anti-aging benefit',
      ],
      moderate: [
        'Stress management',
        'Adequate sleep',
        'Consider DHEA supplementation (25-50mg)',
        'Adaptogenic herbs',
      ],
      critical: [
        'Medical evaluation',
        'DHEA supplementation (50-100mg)',
        'Investigate adrenal function',
        'Lifestyle optimization',
        'Monitor and retest',
      ],
    },
    relatedGenes: ['NR3C1'],
  },

  // ===== THYROID FUNCTION =====
  {
    name: 'Thyroid Stimulating Hormone',
    shortName: 'TSH',
    category: BIOMARKER_CATEGORIES.THYROID,
    unit: 'mIU/L',
    function: 'Pituitary hormone that regulates thyroid. High TSH indicates hypothyroidism.',
    optimal: { min: 0.5, max: 2.0 },
    moderate: { min: 2.1, max: 4.5 },
    critical: { min: 4.6, max: 20.0 },
    interventions: {
      optimal: [
        'Excellent thyroid function',
        'Good metabolic rate',
        'Annual monitoring',
      ],
      moderate: [
        'Monitor thyroid closely',
        'Selenium 200mcg',
        'Iodine adequacy (not excess)',
        'Reduce goitrogens if high intake',
        'Retest in 3-6 months',
      ],
      critical: [
        'Medical evaluation needed',
        'Likely hypothyroidism',
        'May need thyroid hormone replacement',
        'Selenium and zinc',
        'Rule out Hashimoto\'s (TPO antibodies)',
      ],
    },
    relatedGenes: ['VDR'],
  },
  {
    name: 'Free T4 (Thyroxine)',
    shortName: 'Free T4',
    category: BIOMARKER_CATEGORIES.THYROID,
    unit: 'ng/dL',
    function: 'Inactive thyroid hormone. Converted to active T3.',
    optimal: { min: 1.0, max: 1.5 },
    moderate: { min: 0.8, max: 0.99 },
    critical: { min: 0.4, max: 0.79 },
    interventions: {
      optimal: [
        'Good T4 production',
        'Normal thyroid function',
      ],
      moderate: [
        'Support thyroid function',
        'Selenium and zinc',
        'Adequate iodine',
        'Monitor T3 conversion',
      ],
      critical: [
        'Medical evaluation',
        'Likely need thyroid medication',
        'Investigate thyroid antibodies',
        'Selenium 200mcg',
      ],
    },
    relatedGenes: [],
  },
  {
    name: 'Free T3 (Triiodothyronine)',
    shortName: 'Free T3',
    category: BIOMARKER_CATEGORIES.THYROID,
    unit: 'pg/mL',
    function: 'Active thyroid hormone. Regulates metabolism, energy, and body temperature.',
    optimal: { min: 3.2, max: 4.2 },
    moderate: { min: 2.5, max: 3.19 },
    critical: { min: 1.5, max: 2.49 },
    interventions: {
      optimal: [
        'Excellent active thyroid hormone',
        'Good metabolic function',
      ],
      moderate: [
        'Support T4 to T3 conversion',
        'Selenium 200mcg',
        'Zinc 30mg',
        'Iron adequacy',
        'Reduce stress (cortisol inhibits conversion)',
      ],
      critical: [
        'Medical evaluation',
        'May need T3 medication',
        'High-dose selenium and zinc',
        'Investigate conversion issues',
        'Ashwagandha for thyroid support',
      ],
    },
    relatedGenes: [],
  },
  {
    name: 'Reverse T3',
    shortName: 'rT3',
    category: BIOMARKER_CATEGORIES.THYROID,
    unit: 'ng/dL',
    function: 'Inactive form of T3. High levels block thyroid function despite normal TSH.',
    optimal: { min: 8, max: 15 },
    moderate: { min: 16, max: 20 },
    critical: { min: 21, max: 40 },
    interventions: {
      optimal: [
        'Normal T3 metabolism',
        'No thyroid blocking',
      ],
      moderate: [
        'Reduce stress (major driver)',
        'Selenium for conversion',
        'Adequate sleep',
        'Lower inflammation',
      ],
      critical: [
        'Aggressive stress reduction',
        'Selenium 200-400mcg',
        'Iron optimization',
        'Address inflammation',
        'May need T3 medication',
        'Medical evaluation',
      ],
    },
    relatedGenes: [],
  },

  // ===== VITAMINS & MINERALS =====
  {
    name: 'Vitamin D (25-OH)',
    shortName: 'Vitamin D',
    category: BIOMARKER_CATEGORIES.VITAMINS,
    unit: 'ng/mL',
    function: 'Essential for bone health, immune function, mood, and muscle function.',
    optimal: { min: 50, max: 80 },
    moderate: { min: 30, max: 49 },
    critical: { min: 10, max: 29 },
    interventions: {
      optimal: [
        'Excellent vitamin D status',
        'Continue supplementation',
        'Regular sun exposure',
      ],
      moderate: [
        'Vitamin D3 3000-5000 IU/day',
        'Vitamin K2 MK-7 200mcg',
        'Magnesium for activation',
        'Retest in 3 months',
      ],
      critical: [
        'High-dose vitamin D3 (10,000 IU for 8 weeks, then 5000 IU)',
        'Vitamin K2 essential',
        'Magnesium 400-600mg',
        'Increase sun exposure',
        'Retest in 8-12 weeks',
      ],
    },
    relatedGenes: ['VDR'],
  },
  {
    name: 'Vitamin B12',
    shortName: 'B12',
    category: BIOMARKER_CATEGORIES.VITAMINS,
    unit: 'pg/mL',
    function: 'Critical for nerve function, DNA synthesis, and methylation.',
    optimal: { min: 500, max: 1000 },
    moderate: { min: 300, max: 499 },
    critical: { min: 100, max: 299 },
    interventions: {
      optimal: [
        'Excellent B12 status',
        'Good methylation',
        'Continue current intake',
      ],
      moderate: [
        'Methylcobalamin 1000-2000mcg',
        'Increase B12-rich foods',
        'Monitor if vegetarian/vegan',
      ],
      critical: [
        'High-dose methylcobalamin (2000mcg+)',
        'Consider B12 injections',
        'Investigate absorption issues',
        'Check MMA for functional deficiency',
        'Retest in 8-12 weeks',
      ],
    },
    relatedGenes: ['MTR', 'MTRR', 'MTHFR'],
  },
  {
    name: 'Folate (Serum)',
    shortName: 'Folate',
    category: BIOMARKER_CATEGORIES.VITAMINS,
    unit: 'ng/mL',
    function: 'Essential for DNA synthesis, methylation, and cardiovascular health.',
    optimal: { min: 10, max: 20 },
    moderate: { min: 5, max: 9.9 },
    critical: { min: 2, max: 4.9 },
    interventions: {
      optimal: [
        'Excellent folate status',
        'Good methylation capacity',
      ],
      moderate: [
        'Methylfolate (5-MTHF) 400-800mcg',
        'Increase leafy greens',
        'Avoid folic acid (synthetic)',
      ],
      critical: [
        'High-dose methylfolate 800-1000mcg',
        'Increase folate-rich foods',
        'Rule out malabsorption',
        'MTHFR testing recommended',
      ],
    },
    relatedGenes: ['MTHFR', 'MTR'],
  },
  {
    name: 'Magnesium (RBC)',
    shortName: 'Magnesium',
    category: BIOMARKER_CATEGORIES.VITAMINS,
    unit: 'mg/dL',
    function: 'Critical for 300+ enzymatic reactions, muscle function, sleep, and stress response.',
    optimal: { min: 6.0, max: 6.5 },
    moderate: { min: 5.0, max: 5.9 },
    critical: { min: 3.0, max: 4.9 },
    interventions: {
      optimal: [
        'Excellent magnesium status',
        'Good muscle and nerve function',
      ],
      moderate: [
        'Magnesium glycinate 400mg',
        'Increase magnesium-rich foods',
        'Reduce calcium excess',
      ],
      critical: [
        'High-dose magnesium (600-800mg)',
        'Magnesium glycinate or threonate',
        'Transdermal magnesium',
        'Reduce magnesium loss (alcohol, stress)',
        'Retest in 8 weeks',
      ],
    },
    relatedGenes: ['COMT', 'VDR'],
  },
  {
    name: 'Ferritin',
    shortName: 'Ferritin',
    category: BIOMARKER_CATEGORIES.VITAMINS,
    unit: 'ng/mL',
    function: 'Iron storage protein. Low indicates iron deficiency, very high indicates inflammation.',
    optimal: { min: 50, max: 150 },
    moderate: { min: 30, max: 49 },
    critical: { min: 10, max: 29 },
    interventions: {
      optimal: [
        'Healthy iron stores',
        'Good oxygen transport',
      ],
      moderate: [
        'Iron-rich foods (red meat, spinach)',
        'Vitamin C with meals',
        'Avoid tea/coffee with meals',
        'Consider iron supplement',
      ],
      critical: [
        'Iron supplementation essential',
        'Vitamin C for absorption',
        'Investigate blood loss causes',
        'Ferrous bisglycinate 25-50mg',
        'Monitor and retest',
      ],
    },
    relatedGenes: [],
  },
  {
    name: 'Omega-3 Index',
    shortName: 'Omega-3',
    category: BIOMARKER_CATEGORIES.VITAMINS,
    unit: '%',
    function: 'Percentage of EPA+DHA in red blood cell membranes. Cardiovascular and brain health marker.',
    optimal: { min: 8.0, max: 12.0 },
    moderate: { min: 4.0, max: 7.9 },
    critical: { min: 1.0, max: 3.9 },
    interventions: {
      optimal: [
        'Excellent omega-3 status',
        'Cardio and neuroprotection',
        'Continue fish/supplementation',
      ],
      moderate: [
        'Increase fatty fish (2-3x/week)',
        'EPA/DHA supplement (1-2g/day)',
        'Retest in 3-4 months',
      ],
      critical: [
        'High-dose omega-3 (3-4g EPA/DHA)',
        'Fatty fish 3-4x/week',
        'Reduce omega-6 intake',
        'Retest in 3-4 months',
      ],
    },
    relatedGenes: ['APOE', 'BDNF'],
  },

  // ===== LIVER FUNCTION =====
  {
    name: 'Alanine Aminotransferase',
    shortName: 'ALT',
    category: BIOMARKER_CATEGORIES.LIVER,
    unit: 'U/L',
    function: 'Liver enzyme. Elevated indicates liver damage or inflammation.',
    optimal: { min: 10, max: 25 },
    moderate: { min: 26, max: 40 },
    critical: { min: 41, max: 200 },
    interventions: {
      optimal: [
        'Excellent liver health',
        'Normal liver function',
      ],
      moderate: [
        'Reduce alcohol consumption',
        'Milk thistle 200-400mg',
        'NAC for liver support',
        'Weight loss if overweight',
        'Retest in 3 months',
      ],
      critical: [
        'Medical evaluation needed',
        'Eliminate alcohol',
        'Milk thistle + NAC',
        'Rule out fatty liver disease',
        'Weight loss critical',
        'Investigate medication side effects',
      ],
    },
    relatedGenes: ['GSTM1', 'GSTT1'],
  },
  {
    name: 'Aspartate Aminotransferase',
    shortName: 'AST',
    category: BIOMARKER_CATEGORIES.LIVER,
    unit: 'U/L',
    function: 'Enzyme in liver and muscle. Elevated indicates tissue damage.',
    optimal: { min: 10, max: 30 },
    moderate: { min: 31, max: 45 },
    critical: { min: 46, max: 200 },
    interventions: {
      optimal: [
        'Normal tissue health',
        'Good liver function',
      ],
      moderate: [
        'Evaluate liver health',
        'Check if muscle damage (CK)',
        'Liver support supplements',
        'Reduce alcohol',
      ],
      critical: [
        'Medical evaluation',
        'Rule out liver disease',
        'Check muscle damage markers',
        'Liver protective supplements',
        'Eliminate hepatotoxic substances',
      ],
    },
    relatedGenes: ['GSTM1', 'GSTT1'],
  },
  {
    name: 'Gamma-Glutamyl Transferase',
    shortName: 'GGT',
    category: BIOMARKER_CATEGORIES.LIVER,
    unit: 'U/L',
    function: 'Liver enzyme sensitive to alcohol and oxidative stress. Cardiovascular risk marker.',
    optimal: { min: 10, max: 20 },
    moderate: { min: 21, max: 40 },
    critical: { min: 41, max: 200 },
    interventions: {
      optimal: [
        'Low oxidative stress',
        'Healthy liver function',
      ],
      moderate: [
        'Reduce/eliminate alcohol',
        'NAC 600-1200mg',
        'Milk thistle',
        'Increase antioxidants',
      ],
      critical: [
        'Eliminate alcohol completely',
        'High-dose NAC',
        'Milk thistle + alpha-lipoic acid',
        'Medical evaluation',
        'Rule out bile duct issues',
      ],
    },
    relatedGenes: ['GSTM1', 'GSTT1'],
  },

  // ===== KIDNEY FUNCTION =====
  {
    name: 'Creatinine',
    shortName: 'Creatinine',
    category: BIOMARKER_CATEGORIES.KIDNEY,
    unit: 'mg/dL',
    function: 'Waste product filtered by kidneys. Marker of kidney function.',
    optimal: { min: 0.7, max: 1.2 },
    moderate: { min: 1.21, max: 1.5 },
    critical: { min: 1.51, max: 5.0 },
    interventions: {
      optimal: [
        'Excellent kidney function',
        'Normal waste filtration',
      ],
      moderate: [
        'Monitor kidney function',
        'Adequate hydration',
        'Reduce protein if very high',
        'Retest in 3-6 months',
      ],
      critical: [
        'Medical evaluation needed',
        'Investigate kidney function (GFR)',
        'Monitor blood pressure',
        'Reduce nephrotoxic substances',
        'Possible kidney disease',
      ],
    },
    relatedGenes: [],
  },
  {
    name: 'Blood Urea Nitrogen',
    shortName: 'BUN',
    category: BIOMARKER_CATEGORIES.KIDNEY,
    unit: 'mg/dL',
    function: 'Protein breakdown product. Reflects kidney function and protein metabolism.',
    optimal: { min: 10, max: 20 },
    moderate: { min: 21, max: 29 },
    critical: { min: 30, max: 80 },
    interventions: {
      optimal: [
        'Normal protein metabolism',
        'Good kidney function',
      ],
      moderate: [
        'Increase hydration',
        'Monitor protein intake',
        'Retest with creatinine',
      ],
      critical: [
        'Medical evaluation',
        'Rule out kidney disease',
        'Investigate dehydration',
        'Check BUN/Creatinine ratio',
      ],
    },
    relatedGenes: [],
  },
  {
    name: 'Estimated Glomerular Filtration Rate',
    shortName: 'eGFR',
    category: BIOMARKER_CATEGORIES.KIDNEY,
    unit: 'mL/min/1.73m²',
    function: 'Estimate of kidney filtration capacity. Lower values indicate reduced kidney function.',
    optimal: { min: 90, max: 130 },
    moderate: { min: 60, max: 89 },
    critical: { min: 15, max: 59 },
    interventions: {
      optimal: [
        'Excellent filtration capacity',
        'Maintain hydration and blood pressure control',
      ],
      moderate: [
        'Monitor kidney function (repeat labs)',
        'Optimize blood pressure and glucose control',
        'Avoid NSAID overuse',
        'Review high-protein intake if excessive',
      ],
      critical: [
        'Medical evaluation recommended',
        'Investigate chronic kidney disease causes',
        'Strict blood pressure and glucose management',
        'Avoid nephrotoxic substances',
      ],
    },
    relatedGenes: [],
  },
  {
    name: 'Uric Acid',
    shortName: 'Uric Acid',
    category: BIOMARKER_CATEGORIES.METABOLIC,
    unit: 'mg/dL',
    function: 'Purine metabolism marker. High levels correlate with gout risk, insulin resistance, and cardiometabolic risk.',
    optimal: { min: 4.0, max: 6.0 },
    moderate: { min: 6.1, max: 7.0 },
    critical: { min: 7.1, max: 10.0 },
    interventions: {
      optimal: [
        'Healthy purine metabolism',
        'Maintain hydration and balanced diet',
      ],
      moderate: [
        'Increase hydration',
        'Reduce high-fructose intake and excess alcohol',
        'Emphasize weight management and insulin sensitivity',
        'Vitamin C intake may help',
      ],
      critical: [
        'Medical evaluation (gout/metabolic risk)',
        'Limit fructose, beer/spirits, and ultra-processed foods',
        'Weight loss if overweight',
        'Consider tart cherry (symptom support) and monitor trends',
      ],
    },
    relatedGenes: ['SLC2A2', 'TCF7L2'],
  },
  {
    name: 'Total Bilirubin',
    shortName: 'Bilirubin',
    category: BIOMARKER_CATEGORIES.LIVER,
    unit: 'mg/dL',
    function: 'Breakdown product of hemoglobin processed by liver. Elevated levels can indicate bile flow issues or hemolysis.',
    optimal: { min: 0.4, max: 1.0 },
    moderate: { min: 1.1, max: 1.5 },
    critical: { min: 1.6, max: 5.0 },
    interventions: {
      optimal: [
        'Normal bile processing and liver clearance',
        'Maintain healthy lifestyle',
      ],
      moderate: [
        'Recheck with full liver panel (ALT/AST/ALP/GGT)',
        'Optimize hydration and reduce alcohol',
        'Review medications/supplements',
      ],
      critical: [
        'Medical evaluation recommended',
        'Rule out bile duct obstruction, hepatitis, hemolysis',
        'Avoid alcohol and hepatotoxic exposures',
      ],
    },
    relatedGenes: ['GSTM1', 'GSTT1', 'GSTP1'],
  },
  {
    name: 'Alkaline Phosphatase',
    shortName: 'ALP',
    category: BIOMARKER_CATEGORIES.LIVER,
    unit: 'U/L',
    function: 'Enzyme related to bile ducts and bone turnover. High levels may indicate cholestasis or bone remodeling.',
    optimal: { min: 45, max: 90 },
    moderate: { min: 91, max: 120 },
    critical: { min: 121, max: 300 },
    interventions: {
      optimal: [
        'Normal bile duct and bone-related enzyme activity',
        'Maintain balanced nutrition',
      ],
      moderate: [
        'Recheck with GGT and bilirubin to localize source',
        'Review vitamin D status and bone health',
        'Reduce alcohol and processed foods',
      ],
      critical: [
        'Medical evaluation recommended',
        'Rule out bile duct issues, gallbladder disease, or bone pathology',
        'Full liver panel and imaging as indicated',
      ],
    },
    relatedGenes: ['GSTM1', 'GSTT1'],
  },
  {
    name: 'Hemoglobin',
    shortName: 'Hgb',
    category: BIOMARKER_CATEGORIES.BLOOD,
    unit: 'g/dL',
    function: 'Oxygen-carrying protein in red blood cells. Low levels suggest anemia and reduced performance capacity.',
    optimal: { min: 13.5, max: 17.5 },
    moderate: { min: 12.5, max: 13.4 },
    critical: { min: 8.0, max: 12.4 },
    interventions: {
      optimal: [
        'Healthy oxygen transport capacity',
        'Support performance with balanced nutrition',
      ],
      moderate: [
        'Assess iron status (ferritin, iron, transferrin)',
        'Increase iron-rich foods + vitamin C',
        'Review menstrual blood loss, GI symptoms, training load',
      ],
      critical: [
        'Medical evaluation recommended',
        'Rule out iron deficiency, B12/folate deficiency, bleeding',
        'Targeted supplementation under supervision',
      ],
    },
    relatedGenes: ['MTHFR', 'MTR', 'MTRR'],
  },
  {
    name: 'White Blood Cell Count',
    shortName: 'WBC',
    category: BIOMARKER_CATEGORIES.BLOOD,
    unit: '10^9/L',
    function: 'Immune cell count. Elevated values can reflect infection, inflammation, or stress.',
    optimal: { min: 4.0, max: 7.5 },
    moderate: { min: 7.6, max: 10.0 },
    critical: { min: 10.1, max: 20.0 },
    interventions: {
      optimal: [
        'Normal immune cell range',
        'Maintain recovery and sleep',
      ],
      moderate: [
        'Assess recent infection, training stress, and sleep debt',
        'Anti-inflammatory nutrition and hydration',
        'Retest if symptomatic',
      ],
      critical: [
        'Medical evaluation recommended (possible infection/inflammation)',
        'Investigate symptoms and additional inflammatory markers',
        'Do not ignore persistent elevation',
      ],
    },
    relatedGenes: ['IL6', 'TNF', 'CRP'],
  },
];

export const getBiomarkerByName = (name: string): BiomarkerData | undefined => {
  return BIOMARKER_DATA.find(
    (marker) =>
      marker.name.toLowerCase() === name.toLowerCase() ||
      marker.shortName.toLowerCase() === name.toLowerCase()
  );
};

export const getBiomarkersByCategory = (category: string): BiomarkerData[] => {
  return BIOMARKER_DATA.filter((marker) => marker.category === category);
};

export const getAllBiomarkerCategories = (): string[] => {
  return Object.values(BIOMARKER_CATEGORIES);
};

export const getRiskLevelForValue = (
  biomarker: BiomarkerData,
  value: number
): 'optimal' | 'moderate' | 'critical' => {
  if (value >= biomarker.optimal.min && value <= biomarker.optimal.max) {
    return 'optimal';
  }

  if (biomarker.moderate) {
    if (value >= biomarker.moderate.min && value <= biomarker.moderate.max) {
      return 'moderate';
    }
  }

  return 'critical';
};

export const getTrafficLightColor = (riskLevel: 'optimal' | 'moderate' | 'critical'): string => {
  switch (riskLevel) {
    case 'optimal':
      return '🟢';
    case 'moderate':
      return '🟠';
    case 'critical':
      return '🔴';
    default:
      return '⚪';
  }
};
