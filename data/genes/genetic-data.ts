export const GENE_CATEGORIES = {
  METABOLISM: 'Metabolism & Weight',
  INSULIN: 'Insulin Sensitivity',
  INFLAMMATION: 'Inflammation/Detox',
  METHYLATION: 'Methylation & Longevity',
  MUSCLE: 'Muscle Recovery',
  STRESS: 'Stress/Hormones',
  COGNITIVE: 'Cognitive & Neurological',
  CARDIOVASCULAR: 'Cardiovascular Performance',
} as const;

export interface GeneData {
  symbol: string;
  name: string;
  category: string;
  function: string;
  variants: {
    optimal: { alleles: string; description: string };
    moderate: { alleles: string; description: string };
    highRisk: { alleles: string; description: string };
  };
  recommendations: {
    optimal: string[];
    moderate: string[];
    highRisk: string[];
  };
  relatedMarkers: string[];
}

export const GENETIC_DATA: GeneData[] = [
  // ===== METABOLISM & WEIGHT =====
  {
    symbol: 'FTO',
    name: 'Fat Mass and Obesity-Associated Gene',
    category: GENE_CATEGORIES.METABOLISM,
    function: 'Regulates appetite, energy expenditure, and fat storage. Influences satiety signals and metabolic rate.',
    variants: {
      optimal: {
        alleles: 'TT',
        description: 'Normal appetite regulation, efficient energy expenditure, easier weight management',
      },
      moderate: {
        alleles: 'AT',
        description: 'Slightly increased appetite, moderate risk for weight gain, benefits from structured meal timing',
      },
      highRisk: {
        alleles: 'AA',
        description: 'Increased hunger signals, reduced satiety, higher obesity risk, slower metabolism',
      },
    },
    recommendations: {
      optimal: [
        'Maintain balanced macronutrient intake',
        'Regular physical activity 150+ min/week',
        'Intuitive eating approach works well',
      ],
      moderate: [
        'Structured meal timing (avoid grazing)',
        'High protein intake (1.6-2.2g/kg)',
        'Resistance training 3-4x/week',
        'Monitor portion sizes',
        'Increase fiber intake (30-40g/day)',
      ],
      highRisk: [
        'Strict meal timing with IF protocols',
        'Very high protein (2.0-2.5g/kg)',
        'Increase NEAT (non-exercise activity)',
        'Prioritize high-volume, low-calorie foods',
        'Resistance training 4-5x/week',
        'Consider appetite-suppressing supplements (5-HTP, chromium)',
        'Track calories consistently',
      ],
    },
    relatedMarkers: ['Glucose', 'Insulin', 'HbA1c', 'Leptin'],
  },
  {
    symbol: 'MC4R',
    name: 'Melanocortin 4 Receptor',
    category: GENE_CATEGORIES.METABOLISM,
    function: 'Critical for appetite regulation and energy balance. Controls hunger signals and food intake.',
    variants: {
      optimal: {
        alleles: 'CC',
        description: 'Normal hunger signaling, balanced energy intake, stable weight',
      },
      moderate: {
        alleles: 'CT',
        description: 'Moderate increase in appetite, tendency to overeat, moderate weight gain risk',
      },
      highRisk: {
        alleles: 'TT',
        description: 'Strong hunger signals, difficulty with satiety, high obesity risk',
      },
    },
    recommendations: {
      optimal: [
        'Standard balanced diet',
        'Regular meal patterns',
        'Moderate exercise',
      ],
      moderate: [
        'High-protein breakfast',
        'Volumetric eating (high-fiber, water-rich foods)',
        'Mindful eating practices',
        'Regular strength training',
      ],
      highRisk: [
        'Intermittent fasting or time-restricted eating',
        'Very high protein and fiber',
        'GLP-1 promoting foods (oats, legumes)',
        'Appetite-regulating supplements',
        'Behavioral eating strategies',
        'Regular cardiovascular exercise',
      ],
    },
    relatedMarkers: ['Leptin', 'Ghrelin', 'Insulin'],
  },
  {
    symbol: 'PPARG',
    name: 'Peroxisome Proliferator-Activated Receptor Gamma',
    category: GENE_CATEGORIES.METABOLISM,
    function: 'Regulates fat storage, insulin sensitivity, and adipocyte differentiation.',
    variants: {
      optimal: {
        alleles: 'CC',
        description: 'Efficient fat metabolism, good insulin sensitivity, lower diabetes risk',
      },
      moderate: {
        alleles: 'CG',
        description: 'Moderate fat storage tendency, average insulin response',
      },
      highRisk: {
        alleles: 'GG',
        description: 'Increased fat storage, reduced insulin sensitivity, higher type 2 diabetes risk',
      },
    },
    recommendations: {
      optimal: [
        'Balanced macronutrients',
        'Regular activity',
        'Omega-3 intake for optimal PPAR function',
      ],
      moderate: [
        'Lower carbohydrate intake',
        'Increase omega-3s (EPA/DHA)',
        'Regular HIIT training',
        'Monitor blood glucose',
      ],
      highRisk: [
        'Low-GI carbohydrate sources',
        'High omega-3 supplementation (2-3g EPA/DHA)',
        'Berberine or alpha-lipoic acid',
        'Strength training + Zone 2 cardio',
        'Avoid trans fats completely',
        'Consider time-restricted eating',
      ],
    },
    relatedMarkers: ['Glucose', 'Insulin', 'HbA1c', 'Triglycerides', 'HDL'],
  },
  {
    symbol: 'ADRB2',
    name: 'Beta-2 Adrenergic Receptor',
    category: GENE_CATEGORIES.METABOLISM,
    function: 'Regulates lipolysis (fat breakdown), metabolic rate, and response to exercise.',
    variants: {
      optimal: {
        alleles: 'GG',
        description: 'Efficient fat burning, good response to cardio, higher metabolic rate',
      },
      moderate: {
        alleles: 'AG',
        description: 'Moderate lipolysis, average fat-burning response',
      },
      highRisk: {
        alleles: 'AA',
        description: 'Reduced fat breakdown, slower metabolism, decreased cardio response',
      },
    },
    recommendations: {
      optimal: [
        'Cardio exercise highly effective',
        'Standard macronutrient distribution',
        'Caffeine can enhance performance',
      ],
      moderate: [
        'Mix of cardio and resistance training',
        'Moderate carb intake',
        'Green tea extract beneficial',
      ],
      highRisk: [
        'Prioritize resistance training over cardio',
        'HIIT more effective than steady-state',
        'Lower carbohydrate intake',
        'Caffeine + green tea extract pre-workout',
        'L-carnitine supplementation',
        'Increase protein to preserve muscle',
      ],
    },
    relatedMarkers: ['Triglycerides', 'Free fatty acids', 'Cortisol'],
  },
  {
    symbol: 'UCP1',
    name: 'Uncoupling Protein 1',
    category: GENE_CATEGORIES.METABOLISM,
    function: 'Regulates thermogenesis and heat production in brown adipose tissue.',
    variants: {
      optimal: {
        alleles: 'AA',
        description: 'High thermogenesis, efficient calorie burning through heat, easier weight management',
      },
      moderate: {
        alleles: 'AG',
        description: 'Moderate thermogenic capacity',
      },
      highRisk: {
        alleles: 'GG',
        description: 'Reduced thermogenesis, lower metabolic rate, easier weight gain',
      },
    },
    recommendations: {
      optimal: [
        'Standard calorie intake',
        'Regular activity maintains high metabolism',
      ],
      moderate: [
        'Cold exposure protocols',
        'Capsaicin-rich foods',
        'Green tea consumption',
      ],
      highRisk: [
        'Regular cold exposure (cold showers, ice baths)',
        'Capsaicin supplementation',
        'Green tea extract + caffeine',
        'Increase NEAT',
        'Higher protein intake (increases TEF)',
        'Avoid prolonged calorie restriction',
      ],
    },
    relatedMarkers: ['Thyroid hormones', 'Metabolic rate'],
  },

  // ===== INSULIN SENSITIVITY =====
  {
    symbol: 'TCF7L2',
    name: 'Transcription Factor 7-Like 2',
    category: GENE_CATEGORIES.INSULIN,
    function: 'Major regulator of insulin secretion and glucose metabolism. Strongest genetic risk factor for type 2 diabetes.',
    variants: {
      optimal: {
        alleles: 'CC',
        description: 'Normal insulin secretion, good glucose control, low diabetes risk',
      },
      moderate: {
        alleles: 'CT',
        description: 'Slightly impaired insulin response, moderate diabetes risk',
      },
      highRisk: {
        alleles: 'TT',
        description: 'Significantly impaired insulin secretion, high type 2 diabetes risk',
      },
    },
    recommendations: {
      optimal: [
        'Balanced carbohydrate intake',
        'Regular activity',
        'Standard diet works well',
      ],
      moderate: [
        'Lower glycemic index foods',
        'Carb timing around workouts',
        'Regular glucose monitoring',
        'Resistance training 3x/week',
      ],
      highRisk: [
        'Low-carb or ketogenic diet',
        'Strict meal timing',
        'Berberine 500mg 3x/day',
        'Alpha-lipoic acid 600mg/day',
        'Chromium picolinate',
        'Resistance training 4-5x/week',
        'Regular fasting glucose testing',
        'Avoid refined carbohydrates',
      ],
    },
    relatedMarkers: ['Glucose', 'Insulin', 'HbA1c', 'C-peptide'],
  },
  {
    symbol: 'IRS1',
    name: 'Insulin Receptor Substrate 1',
    category: GENE_CATEGORIES.INSULIN,
    function: 'Key protein in insulin signaling pathway. Affects cellular glucose uptake and insulin sensitivity.',
    variants: {
      optimal: {
        alleles: 'GG',
        description: 'Excellent insulin sensitivity, efficient glucose uptake',
      },
      moderate: {
        alleles: 'AG',
        description: 'Moderate insulin sensitivity',
      },
      highRisk: {
        alleles: 'AA',
        description: 'Insulin resistance tendency, impaired glucose disposal',
      },
    },
    recommendations: {
      optimal: [
        'Carbohydrates well tolerated',
        'Regular exercise',
        'Flexible diet approach',
      ],
      moderate: [
        'Moderate carb intake',
        'Post-workout carb timing',
        'Regular strength training',
        'Omega-3 supplementation',
      ],
      highRisk: [
        'Lower carbohydrate diet',
        'Nutrient timing critical',
        'Magnesium supplementation',
        'Inositol supplementation',
        'HIIT and resistance training',
        'Avoid sedentary behavior',
        'Apple cider vinegar with meals',
      ],
    },
    relatedMarkers: ['Insulin', 'Glucose', 'HOMA-IR', 'Triglycerides'],
  },
  {
    symbol: 'PPARGC1A',
    name: 'PPARG Coactivator 1 Alpha (PGC-1α)',
    category: GENE_CATEGORIES.INSULIN,
    function: 'Master regulator of mitochondrial biogenesis, energy metabolism, and insulin sensitivity.',
    variants: {
      optimal: {
        alleles: 'GG',
        description: 'High mitochondrial function, excellent insulin sensitivity, good exercise response',
      },
      moderate: {
        alleles: 'AG',
        description: 'Moderate mitochondrial function',
      },
      highRisk: {
        alleles: 'AA',
        description: 'Reduced mitochondrial biogenesis, lower insulin sensitivity, blunted exercise response',
      },
    },
    recommendations: {
      optimal: [
        'High-intensity training effective',
        'Carbohydrates well utilized',
        'Standard recovery protocols',
      ],
      moderate: [
        'Mix of HIIT and endurance',
        'Adequate carb intake around training',
        'CoQ10 supplementation',
      ],
      highRisk: [
        'Progressive endurance training critical',
        'HIIT 2-3x/week to boost mitochondria',
        'CoQ10 200-300mg/day',
        'Alpha-lipoic acid',
        'L-carnitine for fat oxidation',
        'PQQ (pyrroloquinoline quinone)',
        'Longer warm-ups needed',
        'Avoid excessive sitting',
      ],
    },
    relatedMarkers: ['Insulin', 'Glucose', 'Lactate', 'VO2 max'],
  },
  {
    symbol: 'ADIPOQ',
    name: 'Adiponectin',
    category: GENE_CATEGORIES.INSULIN,
    function: 'Regulates glucose levels and fatty acid breakdown. Anti-inflammatory and insulin-sensitizing hormone.',
    variants: {
      optimal: {
        alleles: 'GG',
        description: 'High adiponectin levels, excellent insulin sensitivity, anti-inflammatory',
      },
      moderate: {
        alleles: 'GT',
        description: 'Moderate adiponectin levels',
      },
      highRisk: {
        alleles: 'TT',
        description: 'Low adiponectin, insulin resistance risk, increased inflammation',
      },
    },
    recommendations: {
      optimal: [
        'Maintain healthy body fat percentage',
        'Regular activity',
        'Omega-3 intake',
      ],
      moderate: [
        'Omega-3 supplementation',
        'Mediterranean diet',
        'Regular cardio exercise',
        'Maintain lean body mass',
      ],
      highRisk: [
        'Weight loss if overweight (adiponectin increases)',
        'High omega-3 intake (3-4g EPA/DHA)',
        'Magnesium supplementation',
        'Avoid trans fats and refined carbs',
        'Regular cardiovascular exercise',
        'Curcumin supplementation',
        'Monitor visceral fat',
      ],
    },
    relatedMarkers: ['Adiponectin', 'Insulin', 'CRP', 'Triglycerides'],
  },

  // ===== INFLAMMATION/DETOX =====
  {
    symbol: 'IL6',
    name: 'Interleukin 6',
    category: GENE_CATEGORIES.INFLAMMATION,
    function: 'Pro-inflammatory cytokine involved in immune response, metabolism, and exercise adaptation.',
    variants: {
      optimal: {
        alleles: 'GG',
        description: 'Balanced inflammatory response, good recovery, lower chronic inflammation',
      },
      moderate: {
        alleles: 'GC',
        description: 'Moderate inflammatory tendency',
      },
      highRisk: {
        alleles: 'CC',
        description: 'Elevated inflammatory response, slower recovery, higher chronic inflammation risk',
      },
    },
    recommendations: {
      optimal: [
        'Standard recovery protocols',
        'Balanced omega-6 to omega-3 ratio',
        'Regular exercise',
      ],
      moderate: [
        'Anti-inflammatory diet',
        'Omega-3 supplementation (2g/day)',
        'Adequate recovery between workouts',
        'Turmeric/curcumin',
      ],
      highRisk: [
        'Strict anti-inflammatory diet',
        'High-dose omega-3 (3-4g EPA/DHA)',
        'Curcumin with black pepper',
        'Avoid omega-6 heavy oils',
        'Prioritize sleep (8+ hours)',
        'Resveratrol supplementation',
        'Regular deload weeks',
        'Stress management critical',
      ],
    },
    relatedMarkers: ['CRP', 'IL-6', 'ESR', 'Fibrinogen'],
  },
  {
    symbol: 'TNF',
    name: 'Tumor Necrosis Factor Alpha',
    category: GENE_CATEGORIES.INFLAMMATION,
    function: 'Key inflammatory cytokine. Regulates immune cells and systemic inflammation.',
    variants: {
      optimal: {
        alleles: 'GG',
        description: 'Controlled inflammatory response, lower autoimmune risk',
      },
      moderate: {
        alleles: 'GA',
        description: 'Moderate inflammatory tendency',
      },
      highRisk: {
        alleles: 'AA',
        description: 'Elevated TNF-α, increased inflammation, higher autoimmune disease risk',
      },
    },
    recommendations: {
      optimal: [
        'Standard diet',
        'Regular exercise',
        'Normal recovery',
      ],
      moderate: [
        'Anti-inflammatory foods',
        'Omega-3 rich fish 2-3x/week',
        'Green tea',
        'Adequate rest',
      ],
      highRisk: [
        'Eliminate inflammatory triggers (gluten, dairy if sensitive)',
        'High omega-3 intake',
        'Quercetin supplementation',
        'Resveratrol',
        'Avoid processed foods',
        'Intermittent fasting may help',
        'Regular gentle exercise (avoid overtraining)',
        'Stress reduction practices',
      ],
    },
    relatedMarkers: ['CRP', 'TNF-α', 'IL-6'],
  },
  {
    symbol: 'CRP',
    name: 'C-Reactive Protein',
    category: GENE_CATEGORIES.INFLAMMATION,
    function: 'Acute phase protein and biomarker of systemic inflammation.',
    variants: {
      optimal: {
        alleles: 'GG',
        description: 'Lower baseline CRP, reduced cardiovascular risk',
      },
      moderate: {
        alleles: 'GA',
        description: 'Moderate CRP levels',
      },
      highRisk: {
        alleles: 'AA',
        description: 'Elevated CRP tendency, higher cardiovascular and inflammatory disease risk',
      },
    },
    recommendations: {
      optimal: [
        'Maintain healthy lifestyle',
        'Regular activity',
        'Balanced diet',
      ],
      moderate: [
        'Anti-inflammatory diet',
        'Regular cardiovascular exercise',
        'Omega-3 supplementation',
        'Monitor CRP levels annually',
      ],
      highRisk: [
        'Strict anti-inflammatory protocol',
        'High-dose omega-3',
        'Curcumin + black pepper',
        'Eliminate refined sugars',
        'Regular CRP testing (quarterly)',
        'Ginger supplementation',
        'Prioritize cardiovascular health',
        'Dental hygiene (periodontal inflammation link)',
      ],
    },
    relatedMarkers: ['CRP', 'IL-6', 'Fibrinogen'],
  },
  {
    symbol: 'GSTM1',
    name: 'Glutathione S-Transferase Mu 1',
    category: GENE_CATEGORIES.INFLAMMATION,
    function: 'Critical detoxification enzyme. Protects against oxidative stress and carcinogens.',
    variants: {
      optimal: {
        alleles: 'Present/Present',
        description: 'Full detoxification capacity, good protection against toxins',
      },
      moderate: {
        alleles: 'Present/Null',
        description: 'Reduced detox capacity',
      },
      highRisk: {
        alleles: 'Null/Null',
        description: 'No GSTM1 enzyme, impaired detoxification, higher cancer risk',
      },
    },
    recommendations: {
      optimal: [
        'Standard diet',
        'Regular cruciferous vegetables',
        'Normal antioxidant intake',
      ],
      moderate: [
        'Increase cruciferous vegetables',
        'NAC supplementation',
        'Reduce toxin exposure',
        'Adequate glutathione precursors',
      ],
      highRisk: [
        'High cruciferous vegetable intake daily',
        'NAC 600-1200mg/day',
        'Glutathione or liposomal glutathione',
        'Milk thistle for liver support',
        'Minimize alcohol consumption',
        'Avoid processed/charred meats',
        'Organic produce when possible',
        'Alpha-lipoic acid',
        'Selenium supplementation',
      ],
    },
    relatedMarkers: ['Liver enzymes', 'Glutathione', 'Oxidative stress markers'],
  },
  {
    symbol: 'GSTT1',
    name: 'Glutathione S-Transferase Theta 1',
    category: GENE_CATEGORIES.INFLAMMATION,
    function: 'Detoxification enzyme for environmental toxins and oxidative stress.',
    variants: {
      optimal: {
        alleles: 'Present/Present',
        description: 'Full GSTT1 function, efficient toxin elimination',
      },
      moderate: {
        alleles: 'Present/Null',
        description: 'Reduced detox efficiency',
      },
      highRisk: {
        alleles: 'Null/Null',
        description: 'No GSTT1 enzyme, significantly impaired detoxification',
      },
    },
    recommendations: {
      optimal: [
        'Standard healthy diet',
        'Regular antioxidant intake',
        'Normal lifestyle',
      ],
      moderate: [
        'Increase antioxidant-rich foods',
        'Green tea daily',
        'Reduce environmental toxin exposure',
      ],
      highRisk: [
        'NAC supplementation',
        'Milk thistle extract',
        'Cruciferous vegetables daily',
        'Avoid smoking and secondhand smoke',
        'Minimize pesticide exposure',
        'Alpha-lipoic acid',
        'Vitamin C and E',
        'Support Phase II detox pathways',
      ],
    },
    relatedMarkers: ['Liver enzymes', 'Bilirubin', 'Glutathione'],
  },
  {
    symbol: 'SOD2',
    name: 'Superoxide Dismutase 2',
    category: GENE_CATEGORIES.INFLAMMATION,
    function: 'Mitochondrial antioxidant enzyme. Protects against oxidative damage.',
    variants: {
      optimal: {
        alleles: 'AA',
        description: 'High antioxidant capacity, excellent mitochondrial protection',
      },
      moderate: {
        alleles: 'AG',
        description: 'Moderate antioxidant function',
      },
      highRisk: {
        alleles: 'GG',
        description: 'Reduced SOD2 activity, increased oxidative stress, faster aging',
      },
    },
    recommendations: {
      optimal: [
        'Standard antioxidant intake',
        'Regular exercise',
        'Balanced diet',
      ],
      moderate: [
        'Increase antioxidant foods',
        'CoQ10 supplementation',
        'Avoid excessive cardio',
        'Adequate recovery',
      ],
      highRisk: [
        'High antioxidant diet',
        'CoQ10 200-300mg/day',
        'MitoQ or mitochondrial antioxidants',
        'Avoid overtraining',
        'PQQ supplementation',
        'Alpha-lipoic acid',
        'Resveratrol',
        'Avoid pro-oxidant behaviors (smoking, excessive alcohol)',
      ],
    },
    relatedMarkers: ['Oxidative stress markers', 'MDA', '8-OHdG'],
  },

  // ===== METHYLATION & LONGEVITY =====
  {
    symbol: 'MTHFR',
    name: 'Methylenetetrahydrofolate Reductase',
    category: GENE_CATEGORIES.METHYLATION,
    function: 'Critical enzyme in folate metabolism and methylation. Affects homocysteine levels and cardiovascular health.',
    variants: {
      optimal: {
        alleles: 'CC',
        description: 'Normal MTHFR function, efficient methylation, healthy homocysteine',
      },
      moderate: {
        alleles: 'CT',
        description: '40% reduced enzyme activity, moderately elevated homocysteine risk',
      },
      highRisk: {
        alleles: 'TT',
        description: '70% reduced enzyme activity, high homocysteine, increased cardiovascular risk',
      },
    },
    recommendations: {
      optimal: [
        'Standard folate intake (400mcg)',
        'Balanced B-vitamin diet',
        'Regular leafy greens',
      ],
      moderate: [
        'Methylfolate (5-MTHF) 400-800mcg',
        'Methylcobalamin (B12) 1000mcg',
        'B6 (P5P form) 25-50mg',
        'Monitor homocysteine levels',
      ],
      highRisk: [
        'High-dose methylfolate 800-1000mcg',
        'Methylcobalamin 1000-2000mcg',
        'P5P (active B6) 50-100mg',
        'TMG (betaine) 500-1000mg',
        'Avoid folic acid (synthetic form)',
        'Regular homocysteine testing',
        'Increase leafy greens',
        'Choline supplementation',
        'Limit alcohol',
      ],
    },
    relatedMarkers: ['Homocysteine', 'B12', 'Folate', 'MMA'],
  },
  {
    symbol: 'MTR',
    name: 'Methionine Synthase',
    category: GENE_CATEGORIES.METHYLATION,
    function: 'Enzyme requiring B12 for methylation cycle. Converts homocysteine to methionine.',
    variants: {
      optimal: {
        alleles: 'AA',
        description: 'Efficient methylation, normal homocysteine metabolism',
      },
      moderate: {
        alleles: 'AG',
        description: 'Moderate methylation efficiency',
      },
      highRisk: {
        alleles: 'GG',
        description: 'Impaired methylation, higher homocysteine, increased B12 needs',
      },
    },
    recommendations: {
      optimal: [
        'Standard B12 intake',
        'Balanced diet',
        'Normal supplementation',
      ],
      moderate: [
        'Methylcobalamin 1000mcg',
        'Ensure adequate folate',
        'B-complex supplementation',
      ],
      highRisk: [
        'High-dose methylcobalamin 2000mcg+',
        'Consider B12 injections if low',
        'Methylfolate 800mcg',
        'Regular B12 testing',
        'Increase B12-rich foods',
        'Avoid nitrous oxide exposure',
      ],
    },
    relatedMarkers: ['B12', 'Homocysteine', 'MMA', 'Folate'],
  },
  {
    symbol: 'MTRR',
    name: 'Methionine Synthase Reductase',
    category: GENE_CATEGORIES.METHYLATION,
    function: 'Maintains methionine synthase activity. Critical for methylation cycle.',
    variants: {
      optimal: {
        alleles: 'AA',
        description: 'Optimal MTRR function, efficient B12 recycling',
      },
      moderate: {
        alleles: 'AG',
        description: 'Moderate function',
      },
      highRisk: {
        alleles: 'GG',
        description: 'Reduced MTRR activity, impaired methylation, higher B12 requirements',
      },
    },
    recommendations: {
      optimal: [
        'Standard B-vitamin intake',
        'Regular diet',
      ],
      moderate: [
        'Methylcobalamin supplementation',
        'B-complex with methylated forms',
        'Adequate riboflavin (B2)',
      ],
      highRisk: [
        'High-dose methylcobalamin',
        'Riboflavin 50-100mg',
        'Methylfolate',
        'Support full methylation cycle',
        'Regular B12 monitoring',
      ],
    },
    relatedMarkers: ['B12', 'Homocysteine', 'Riboflavin'],
  },
  {
    symbol: 'COMT',
    name: 'Catechol-O-Methyltransferase',
    category: GENE_CATEGORIES.METHYLATION,
    function: 'Breaks down catecholamines (dopamine, epinephrine, norepinephrine). Affects stress response and cognition.',
    variants: {
      optimal: {
        alleles: 'GG (Val/Val)',
        description: 'Fast COMT, quick stress recovery, stable under pressure, lower anxiety',
      },
      moderate: {
        alleles: 'AG (Val/Met)',
        description: 'Moderate COMT activity, balanced stress response',
      },
      highRisk: {
        alleles: 'AA (Met/Met)',
        description: 'Slow COMT, higher dopamine/stress hormones, increased anxiety, better focus but worse under stress',
      },
    },
    recommendations: {
      optimal: [
        'Can handle high-stress situations well',
        'Standard supplement protocol',
        'High-intensity training tolerated',
      ],
      moderate: [
        'Magnesium for stress support',
        'B-vitamin complex',
        'Moderate stress management',
      ],
      highRisk: [
        'Magnesium glycinate 400-600mg',
        'SAMe or TMG for methylation',
        'Avoid high-dose green tea (EGCG inhibits COMT)',
        'Stress management critical',
        'Avoid stimulants if anxious',
        'L-theanine for calm focus',
        'Adaptogenic herbs (ashwagandha, rhodiola)',
        'Avoid excessive caffeine',
      ],
    },
    relatedMarkers: ['Cortisol', 'Catecholamines', 'Magnesium'],
  },
  {
    symbol: 'APOE',
    name: 'Apolipoprotein E',
    category: GENE_CATEGORIES.METHYLATION,
    function: 'Regulates cholesterol metabolism and Alzheimer\'s disease risk.',
    variants: {
      optimal: {
        alleles: 'E3/E3',
        description: 'Standard risk profile, normal cholesterol metabolism',
      },
      moderate: {
        alleles: 'E2/E3, E3/E4',
        description: 'Moderate Alzheimer\'s risk (E3/E4), altered lipid metabolism',
      },
      highRisk: {
        alleles: 'E4/E4',
        description: 'Significantly increased Alzheimer\'s risk (12-15x), higher cholesterol, greater inflammation sensitivity',
      },
    },
    recommendations: {
      optimal: [
        'Mediterranean diet',
        'Regular exercise',
        'Standard heart health protocol',
      ],
      moderate: [
        'Omega-3 rich diet',
        'DHA supplementation',
        'Cognitive training exercises',
        'Regular cardiovascular exercise',
        'Limit saturated fat',
      ],
      highRisk: [
        'Strict Mediterranean or ketogenic diet',
        'High-dose DHA (1-2g/day)',
        'Minimize saturated fat',
        'Regular intense exercise',
        'Cognitive training',
        'Curcumin for neuroprotection',
        'Lion\'s mane mushroom',
        'Avoid head trauma',
        'Prioritize sleep quality',
        'Regular lipid panel monitoring',
        'Avoid smoking and excess alcohol',
      ],
    },
    relatedMarkers: ['Total cholesterol', 'LDL', 'ApoB', 'CRP'],
  },
  {
    symbol: 'FOXO3',
    name: 'Forkhead Box O3',
    category: GENE_CATEGORIES.METHYLATION,
    function: 'Longevity gene. Regulates stress resistance, autophagy, and lifespan.',
    variants: {
      optimal: {
        alleles: 'TT',
        description: 'Longevity variant, increased lifespan potential, better stress resistance',
      },
      moderate: {
        alleles: 'GT',
        description: 'Moderate longevity benefit',
      },
      highRisk: {
        alleles: 'GG',
        description: 'Standard aging trajectory, average stress response',
      },
    },
    recommendations: {
      optimal: [
        'Continue healthy lifestyle for longevity advantage',
        'Intermittent fasting amplifies FOXO3',
        'Regular exercise',
      ],
      moderate: [
        'Intermittent fasting protocols',
        'Exercise regularly',
        'Resveratrol supplementation',
        'Autophagy-promoting strategies',
      ],
      highRisk: [
        'Strict intermittent fasting or time-restricted eating',
        'Caloric restriction or fasting mimicking diet',
        'Resveratrol 200-500mg',
        'Spermidine supplementation',
        'Regular exercise critical',
        'Heat/cold stress (sauna, cold plunge)',
        'Minimize mTOR activation (limit protein excess)',
        'Prioritize autophagy',
      ],
    },
    relatedMarkers: ['IGF-1', 'mTOR markers', 'Autophagy markers'],
  },
  {
    symbol: 'SIRT1',
    name: 'Sirtuin 1',
    category: GENE_CATEGORIES.METHYLATION,
    function: 'NAD-dependent deacetylase. Regulates aging, metabolism, and stress resistance.',
    variants: {
      optimal: {
        alleles: 'CC',
        description: 'High SIRT1 activity, enhanced longevity pathways, better metabolic health',
      },
      moderate: {
        alleles: 'CT',
        description: 'Moderate SIRT1 function',
      },
      highRisk: {
        alleles: 'TT',
        description: 'Lower SIRT1 activity, reduced longevity benefits',
      },
    },
    recommendations: {
      optimal: [
        'Intermittent fasting beneficial',
        'Resveratrol supplementation amplifies benefits',
        'Regular exercise',
      ],
      moderate: [
        'Intermittent fasting',
        'Resveratrol 200mg',
        'NAD+ precursors (NR or NMN)',
        'Regular endurance exercise',
      ],
      highRisk: [
        'Strict fasting protocols',
        'Resveratrol 500mg',
        'NMN 250-500mg or NR 300-600mg',
        'Pterostilbene',
        'Regular exercise essential',
        'Limit excessive calories',
        'Quercetin supplementation',
      ],
    },
    relatedMarkers: ['NAD+', 'Glucose', 'Insulin'],
  },

  // ===== MUSCLE RECOVERY =====
  {
    symbol: 'ACTN3',
    name: 'Alpha-Actinin-3',
    category: GENE_CATEGORIES.MUSCLE,
    function: 'Determines fast-twitch muscle fiber presence. Affects power, speed, and muscle performance.',
    variants: {
      optimal: {
        alleles: 'RR',
        description: 'High fast-twitch fibers, excellent power/sprint performance, strength advantage',
      },
      moderate: {
        alleles: 'RX',
        description: 'Mixed fiber type, balanced power and endurance',
      },
      highRisk: {
        alleles: 'XX',
        description: 'No fast-twitch ACTN3, endurance advantage, reduced power output',
      },
    },
    recommendations: {
      optimal: [
        'Excel at power/strength training',
        'Sprint training highly effective',
        'Lower reps, heavy weight',
        'Explosive movements',
      ],
      moderate: [
        'Hybrid training works well',
        'Mix of power and endurance',
        'Versatile athletic performance',
      ],
      highRisk: [
        'Focus on endurance training',
        'Higher rep ranges (12-15+)',
        'Metabolic conditioning',
        'Long-duration cardio effective',
        'Creatine supplementation very beneficial',
        'Beta-alanine for power development',
        'Plyometric training to compensate',
      ],
    },
    relatedMarkers: ['Creatine kinase', 'Lactate', 'Testosterone'],
  },
  {
    symbol: 'ACE',
    name: 'Angiotensin-Converting Enzyme',
    category: GENE_CATEGORIES.MUSCLE,
    function: 'Regulates blood pressure and endurance capacity. Affects oxygen delivery to muscles.',
    variants: {
      optimal: {
        alleles: 'II',
        description: 'Endurance advantage, excellent oxygen utilization, fatigue resistance',
      },
      moderate: {
        alleles: 'ID',
        description: 'Balanced endurance and power',
      },
      highRisk: {
        alleles: 'DD',
        description: 'Power/strength advantage, reduced endurance capacity',
      },
    },
    recommendations: {
      optimal: [
        'Endurance training highly effective',
        'Marathon/triathlon potential',
        'High-volume training tolerated',
        'Zone 2 cardio excellent',
      ],
      moderate: [
        'Mixed training approach',
        'Both endurance and strength',
        'Versatile programming',
      ],
      highRisk: [
        'Focus on strength and power',
        'Shorter, intense workouts',
        'HIIT over steady-state',
        'May need more cardio work for endurance',
        'Beetroot juice/nitrate supplementation',
        'Citrulline for blood flow',
      ],
    },
    relatedMarkers: ['Blood pressure', 'VO2 max'],
  },
  {
    symbol: 'AMPD1',
    name: 'Adenosine Monophosphate Deaminase 1',
    category: GENE_CATEGORIES.MUSCLE,
    function: 'Energy metabolism in muscle during exercise. Affects fatigue resistance and recovery.',
    variants: {
      optimal: {
        alleles: 'CC',
        description: 'Normal muscle energy metabolism, standard recovery',
      },
      moderate: {
        alleles: 'CT',
        description: 'Slightly enhanced endurance, moderate recovery speed',
      },
      highRisk: {
        alleles: 'TT',
        description: 'Enhanced endurance but may have slower power recovery, altered muscle metabolism',
      },
    },
    recommendations: {
      optimal: [
        'Standard training protocols',
        'Normal recovery time',
        'Balanced programming',
      ],
      moderate: [
        'Good for endurance events',
        'Standard recovery nutrition',
        'BCAA supplementation',
      ],
      highRisk: [
        'Excel at long-duration events',
        'May need longer rest between power sets',
        'Ribose supplementation',
        'Creatine for power development',
        'Focus on aerobic base building',
      ],
    },
    relatedMarkers: ['Lactate', 'Ammonia', 'Uric acid'],
  },
  {
    symbol: 'IL6R',
    name: 'Interleukin 6 Receptor',
    category: GENE_CATEGORIES.MUSCLE,
    function: 'Receptor for IL-6, affects exercise-induced inflammation and muscle adaptation.',
    variants: {
      optimal: {
        alleles: 'AA',
        description: 'Optimal inflammatory response to exercise, good muscle adaptation',
      },
      moderate: {
        alleles: 'AC',
        description: 'Moderate inflammatory response',
      },
      highRisk: {
        alleles: 'CC',
        description: 'Elevated inflammatory response, slower recovery, higher training soreness',
      },
    },
    recommendations: {
      optimal: [
        'Standard training volume',
        'Normal recovery protocols',
        'Regular training frequency',
      ],
      moderate: [
        'Adequate recovery time',
        'Anti-inflammatory foods post-workout',
        'Omega-3 supplementation',
      ],
      highRisk: [
        'Lower training volume',
        'Extra recovery days',
        'High-dose omega-3',
        'Tart cherry juice for recovery',
        'Curcumin post-workout',
        'Avoid back-to-back intense sessions',
        'Prioritize sleep',
      ],
    },
    relatedMarkers: ['IL-6', 'CRP', 'Creatine kinase'],
  },
  {
    symbol: 'CKM',
    name: 'Creatine Kinase Muscle',
    category: GENE_CATEGORIES.MUSCLE,
    function: 'Energy metabolism enzyme. Affects power output and muscle damage markers.',
    variants: {
      optimal: {
        alleles: 'AA',
        description: 'Efficient creatine kinase function, good power output',
      },
      moderate: {
        alleles: 'AG',
        description: 'Moderate CK function',
      },
      highRisk: {
        alleles: 'GG',
        description: 'Altered CK response, may show higher muscle damage markers',
      },
    },
    recommendations: {
      optimal: [
        'Standard creatine supplementation effective',
        'Normal training protocols',
      ],
      moderate: [
        'Creatine monohydrate 5g/day',
        'Adequate protein intake',
        'Standard recovery',
      ],
      highRisk: [
        'Higher creatine dose may be beneficial',
        'Monitor CK levels if very elevated',
        'Adequate hydration critical',
        'Gradual training progression',
        'Avoid extreme volume spikes',
      ],
    },
    relatedMarkers: ['Creatine kinase', 'Myoglobin'],
  },
  {
    symbol: 'VDR',
    name: 'Vitamin D Receptor',
    category: GENE_CATEGORIES.MUSCLE,
    function: 'Regulates vitamin D action. Affects bone health, muscle function, and immune response.',
    variants: {
      optimal: {
        alleles: 'TT',
        description: 'Efficient vitamin D utilization, good muscle function and bone health',
      },
      moderate: {
        alleles: 'TC',
        description: 'Moderate VDR function',
      },
      highRisk: {
        alleles: 'CC',
        description: 'Reduced VDR sensitivity, higher vitamin D needs, increased fracture risk',
      },
    },
    recommendations: {
      optimal: [
        'Standard vitamin D intake (2000 IU)',
        'Regular sun exposure',
        'Monitor levels annually',
      ],
      moderate: [
        'Vitamin D3 3000-4000 IU',
        'Regular testing (aim 50-70 ng/mL)',
        'Vitamin K2 with D3',
      ],
      highRisk: [
        'High-dose vitamin D3 (5000+ IU)',
        'Target higher levels (60-80 ng/mL)',
        'Vitamin K2 MK-7 200mcg',
        'Magnesium for D3 activation',
        'Regular bone density monitoring',
        'Weight-bearing exercise',
        'Test vitamin D levels quarterly',
      ],
    },
    relatedMarkers: ['25-OH Vitamin D', 'PTH', 'Calcium'],
  },

  // ===== STRESS/HORMONES =====
  {
    symbol: 'NR3C1',
    name: 'Glucocorticoid Receptor',
    category: GENE_CATEGORIES.STRESS,
    function: 'Regulates cortisol sensitivity and stress response.',
    variants: {
      optimal: {
        alleles: 'GG',
        description: 'Normal cortisol sensitivity, balanced stress response',
      },
      moderate: {
        alleles: 'GA',
        description: 'Moderate cortisol sensitivity',
      },
      highRisk: {
        alleles: 'AA',
        description: 'Increased cortisol sensitivity, heightened stress response, higher burnout risk',
      },
    },
    recommendations: {
      optimal: [
        'Standard stress management',
        'Regular exercise',
        'Normal recovery',
      ],
      moderate: [
        'Stress management practices',
        'Adequate sleep',
        'Adaptogenic herbs',
        'Avoid overtraining',
      ],
      highRisk: [
        'Prioritize stress reduction (meditation, yoga)',
        'Ashwagandha 300-600mg',
        'Rhodiola rosea',
        'Phosphatidylserine to lower cortisol',
        'Avoid excessive training volume',
        'Regular deload weeks',
        'Prioritize sleep quality',
        'Limit caffeine if anxious',
      ],
    },
    relatedMarkers: ['Cortisol', 'DHEA', 'Cortisol/DHEA ratio'],
  },
  {
    symbol: 'FKBP5',
    name: 'FK506 Binding Protein 5',
    category: GENE_CATEGORIES.STRESS,
    function: 'Regulates cortisol receptor sensitivity and stress resilience.',
    variants: {
      optimal: {
        alleles: 'CC',
        description: 'Resilient stress response, lower PTSD risk, good recovery',
      },
      moderate: {
        alleles: 'CT',
        description: 'Moderate stress resilience',
      },
      highRisk: {
        alleles: 'TT',
        description: 'Heightened stress sensitivity, higher anxiety/PTSD risk, prolonged cortisol elevation',
      },
    },
    recommendations: {
      optimal: [
        'Standard stress protocols',
        'Can handle high stress well',
      ],
      moderate: [
        'Regular stress management',
        'Adequate recovery',
        'Magnesium supplementation',
      ],
      highRisk: [
        'Daily stress reduction practices',
        'Ashwagandha or other adaptogens',
        'Magnesium glycinate',
        'L-theanine',
        'Avoid chronic stress',
        'Therapy/counseling if trauma history',
        'Prioritize psychological well-being',
        'Avoid overtraining',
      ],
    },
    relatedMarkers: ['Cortisol', 'DHEA'],
  },
  {
    symbol: 'OXTR',
    name: 'Oxytocin Receptor',
    category: GENE_CATEGORIES.STRESS,
    function: 'Regulates social bonding, empathy, and stress buffering.',
    variants: {
      optimal: {
        alleles: 'GG',
        description: 'High oxytocin sensitivity, strong social bonding, good stress buffering',
      },
      moderate: {
        alleles: 'GA',
        description: 'Moderate oxytocin response',
      },
      highRisk: {
        alleles: 'AA',
        description: 'Reduced oxytocin sensitivity, may struggle with social connection, less stress buffering',
      },
    },
    recommendations: {
      optimal: [
        'Social connection naturally protective',
        'Group fitness beneficial',
      ],
      moderate: [
        'Prioritize social connections',
        'Group activities helpful',
        'Physical touch (massage, hugs)',
      ],
      highRisk: [
        'Intentionally cultivate social connections',
        'Group training over solo',
        'Regular massage therapy',
        'Meditation and mindfulness',
        'Probiotics (gut-brain oxytocin link)',
        'Vitamin D for oxytocin production',
      ],
    },
    relatedMarkers: ['Cortisol', 'Oxytocin (if available)'],
  },
  {
    symbol: 'SHBG',
    name: 'Sex Hormone-Binding Globulin',
    category: GENE_CATEGORIES.STRESS,
    function: 'Binds and regulates sex hormones (testosterone, estrogen).',
    variants: {
      optimal: {
        alleles: 'GG',
        description: 'Moderate SHBG, balanced free testosterone',
      },
      moderate: {
        alleles: 'GA',
        description: 'Variable SHBG levels',
      },
      highRisk: {
        alleles: 'AA',
        description: 'High SHBG tendency, may reduce free testosterone availability',
      },
    },
    recommendations: {
      optimal: [
        'Standard hormone support',
        'Balanced diet',
      ],
      moderate: [
        'Monitor hormone levels',
        'Adequate protein and fats',
        'Resistance training',
      ],
      highRisk: [
        'Strategies to lower SHBG if high',
        'Boron supplementation (6-9mg)',
        'Magnesium',
        'Reduce sugar/insulin spikes',
        'Resistance training critical',
        'Adequate dietary fat',
        'Monitor total and free testosterone',
        'Vitamin D optimization',
      ],
    },
    relatedMarkers: ['SHBG', 'Total testosterone', 'Free testosterone', 'Estradiol'],
  },
  {
    symbol: 'CYP19A1',
    name: 'Aromatase',
    category: GENE_CATEGORIES.STRESS,
    function: 'Converts testosterone to estrogen. Affects hormone balance.',
    variants: {
      optimal: {
        alleles: 'CC',
        description: 'Balanced aromatase activity, normal testosterone to estrogen ratio',
      },
      moderate: {
        alleles: 'CT',
        description: 'Moderate aromatase activity',
      },
      highRisk: {
        alleles: 'TT',
        description: 'High aromatase, increased estrogen conversion, may reduce free testosterone',
      },
    },
    recommendations: {
      optimal: [
        'Standard diet',
        'Regular training',
      ],
      moderate: [
        'Cruciferous vegetables',
        'DIM or I3C supplementation',
        'Zinc adequate',
      ],
      highRisk: [
        'High cruciferous vegetable intake',
        'DIM 200-300mg',
        'Zinc 30-50mg',
        'Reduce body fat (fat increases aromatase)',
        'Avoid xenoestrogens (plastics, etc.)',
        'Chrysin or grape seed extract',
        'Monitor estrogen levels',
        'Strength training to boost testosterone',
      ],
    },
    relatedMarkers: ['Testosterone', 'Estradiol', 'T/E ratio'],
  },

  // ===== COGNITIVE & NEUROLOGICAL =====
  {
    symbol: 'BDNF',
    name: 'Brain-Derived Neurotrophic Factor',
    category: GENE_CATEGORIES.COGNITIVE,
    function: 'Supports neuron growth, learning, memory, and neuroplasticity.',
    variants: {
      optimal: {
        alleles: 'GG (Val/Val)',
        description: 'High BDNF, excellent neuroplasticity, strong learning and memory',
      },
      moderate: {
        alleles: 'GA (Val/Met)',
        description: 'Moderate BDNF function',
      },
      highRisk: {
        alleles: 'AA (Met/Met)',
        description: 'Reduced BDNF, impaired neuroplasticity, memory challenges, higher depression risk',
      },
    },
    recommendations: {
      optimal: [
        'Exercise boosts BDNF effectively',
        'Learning new skills beneficial',
        'Standard cognitive support',
      ],
      moderate: [
        'Regular aerobic exercise',
        'Omega-3 supplementation',
        'Continuous learning',
        'Lion\'s mane mushroom',
      ],
      highRisk: [
        'Daily aerobic exercise (critical for BDNF)',
        'High-dose omega-3 (2-3g EPA/DHA)',
        'Lion\'s mane 500-1000mg',
        'Curcumin for neuroprotection',
        'Magnesium threonate (brain-specific)',
        'Prioritize sleep for memory consolidation',
        'Novel learning experiences',
        'Social engagement',
        'Avoid chronic stress',
      ],
    },
    relatedMarkers: ['Homocysteine', 'Vitamin D', 'Omega-3 index'],
  },
  {
    symbol: 'DRD2',
    name: 'Dopamine Receptor D2',
    category: GENE_CATEGORIES.COGNITIVE,
    function: 'Regulates reward, motivation, and addiction susceptibility.',
    variants: {
      optimal: {
        alleles: 'CC',
        description: 'High dopamine receptor density, good reward response, lower addiction risk',
      },
      moderate: {
        alleles: 'CT',
        description: 'Moderate dopamine function',
      },
      highRisk: {
        alleles: 'TT',
        description: 'Reduced dopamine receptors, seek higher stimulation, higher addiction risk',
      },
    },
    recommendations: {
      optimal: [
        'Balanced lifestyle',
        'Standard reward systems work',
      ],
      moderate: [
        'Be mindful of addictive behaviors',
        'Healthy reward systems',
        'Regular exercise for dopamine',
      ],
      highRisk: [
        'Avoid addictive substances/behaviors',
        'Create healthy dopamine sources (exercise, achievement)',
        'L-tyrosine supplementation',
        'Mucuna pruriens (natural L-DOPA)',
        'Regular intense exercise',
        'Goal-setting and achievement cycles',
        'Avoid excessive stimulant use',
        'Mindfulness practices',
      ],
    },
    relatedMarkers: ['Dopamine (if available)', 'Tyrosine'],
  },
  {
    symbol: 'SLC6A4',
    name: 'Serotonin Transporter (5-HTTLPR)',
    category: GENE_CATEGORIES.COGNITIVE,
    function: 'Regulates serotonin reuptake. Affects mood, anxiety, and stress response.',
    variants: {
      optimal: {
        alleles: 'L/L',
        description: 'Efficient serotonin transport, lower anxiety, better stress resilience',
      },
      moderate: {
        alleles: 'L/S',
        description: 'Moderate serotonin function',
      },
      highRisk: {
        alleles: 'S/S',
        description: 'Reduced serotonin efficiency, higher anxiety/depression risk, stress sensitivity',
      },
    },
    recommendations: {
      optimal: [
        'Standard mood support',
        'Regular exercise',
      ],
      moderate: [
        'Omega-3 supplementation',
        'Regular exercise',
        '5-HTP if mood low',
        'Adequate tryptophan intake',
      ],
      highRisk: [
        '5-HTP 100-300mg (or tryptophan)',
        'High omega-3 intake',
        'Vitamin B6 (cofactor for serotonin)',
        'Regular exercise (boosts serotonin)',
        'Sunlight exposure',
        'Probiotics (gut-brain axis)',
        'Avoid chronic stress',
        'Consider therapy/counseling',
        'SAMe supplementation',
      ],
    },
    relatedMarkers: ['Serotonin (if available)', 'Tryptophan', 'B6'],
  },
  {
    symbol: 'KIBRA',
    name: 'Kidney And Brain Expressed Protein',
    category: GENE_CATEGORIES.COGNITIVE,
    function: 'Affects memory performance and cognitive function.',
    variants: {
      optimal: {
        alleles: 'CC',
        description: 'Enhanced episodic memory, better information retrieval',
      },
      moderate: {
        alleles: 'CT',
        description: 'Moderate memory function',
      },
      highRisk: {
        alleles: 'TT',
        description: 'Reduced memory performance, may need memory support strategies',
      },
    },
    recommendations: {
      optimal: [
        'Standard cognitive maintenance',
        'Learning and memory naturally strong',
      ],
      moderate: [
        'Memory training exercises',
        'Omega-3 supplementation',
        'Regular mental stimulation',
      ],
      highRisk: [
        'Active memory training',
        'Omega-3 DHA focus',
        'Bacopa monnieri 300mg',
        'Ginkgo biloba',
        'Lion\'s mane mushroom',
        'Phosphatidylserine',
        'Regular aerobic exercise',
        'Sleep optimization critical',
      ],
    },
    relatedMarkers: ['Homocysteine', 'B vitamins', 'Omega-3 index'],
  },

  // ===== CARDIOVASCULAR PERFORMANCE =====
  {
    symbol: 'NOS3',
    name: 'Endothelial Nitric Oxide Synthase',
    category: GENE_CATEGORIES.CARDIOVASCULAR,
    function: 'Produces nitric oxide for blood vessel dilation, blood flow, and cardiovascular health.',
    variants: {
      optimal: {
        alleles: 'GG',
        description: 'High nitric oxide production, excellent blood flow, good endurance',
      },
      moderate: {
        alleles: 'GT',
        description: 'Moderate NO production',
      },
      highRisk: {
        alleles: 'TT',
        description: 'Reduced nitric oxide, impaired blood flow, higher blood pressure risk',
      },
    },
    recommendations: {
      optimal: [
        'Standard cardiovascular training',
        'Dietary nitrates beneficial',
      ],
      moderate: [
        'Beetroot juice or nitrate-rich foods',
        'L-citrulline supplementation',
        'Regular cardio exercise',
      ],
      highRisk: [
        'High-dose L-citrulline (6-8g) or citrulline malate',
        'L-arginine 3-6g',
        'Beetroot juice daily (400-500mg nitrates)',
        'Pomegranate extract',
        'Regular cardiovascular exercise',
        'Monitor blood pressure',
        'Antioxidants (vitamin C, E)',
      ],
    },
    relatedMarkers: ['Blood pressure', 'Homocysteine', 'Nitric oxide (if available)'],
  },
  {
    symbol: 'AGT',
    name: 'Angiotensinogen',
    category: GENE_CATEGORIES.CARDIOVASCULAR,
    function: 'Regulates blood pressure through renin-angiotensin system.',
    variants: {
      optimal: {
        alleles: 'MM',
        description: 'Normal blood pressure regulation, lower hypertension risk',
      },
      moderate: {
        alleles: 'MT',
        description: 'Moderate blood pressure risk',
      },
      highRisk: {
        alleles: 'TT',
        description: 'Elevated blood pressure tendency, higher hypertension risk',
      },
    },
    recommendations: {
      optimal: [
        'Standard heart-healthy diet',
        'Regular exercise',
      ],
      moderate: [
        'Moderate sodium intake',
        'DASH diet approach',
        'Regular cardio',
        'Magnesium supplementation',
      ],
      highRisk: [
        'Low sodium diet (<2300mg)',
        'High potassium intake',
        'DASH or Mediterranean diet',
        'Magnesium 400-600mg',
        'CoQ10 100-200mg',
        'Regular aerobic exercise',
        'Monitor blood pressure regularly',
        'Garlic supplementation',
        'Maintain healthy weight',
      ],
    },
    relatedMarkers: ['Blood pressure', 'Sodium', 'Potassium', 'Renin'],
  },
  {
    symbol: 'LPL',
    name: 'Lipoprotein Lipase',
    category: GENE_CATEGORIES.CARDIOVASCULAR,
    function: 'Breaks down triglycerides. Affects fat metabolism and cardiovascular risk.',
    variants: {
      optimal: {
        alleles: 'CC',
        description: 'Efficient triglyceride clearance, lower cardiovascular risk',
      },
      moderate: {
        alleles: 'CG',
        description: 'Moderate LPL function',
      },
      highRisk: {
        alleles: 'GG',
        description: 'Reduced LPL activity, elevated triglycerides, higher cardiovascular risk',
      },
    },
    recommendations: {
      optimal: [
        'Balanced fat intake',
        'Regular activity',
      ],
      moderate: [
        'Omega-3 supplementation',
        'Reduce simple carbs',
        'Regular cardio',
      ],
      highRisk: [
        'High omega-3 (3-4g EPA/DHA)',
        'Low refined carbohydrate diet',
        'Niacin (if approved by doctor)',
        'Regular aerobic exercise',
        'Reduce saturated fat',
        'Avoid trans fats',
        'Monitor triglycerides regularly',
        'Limit alcohol',
      ],
    },
    relatedMarkers: ['Triglycerides', 'HDL', 'LDL', 'Total cholesterol'],
  },
  {
    symbol: 'CETP',
    name: 'Cholesteryl Ester Transfer Protein',
    category: GENE_CATEGORIES.CARDIOVASCULAR,
    function: 'Transfers cholesterol between lipoproteins. Affects HDL levels.',
    variants: {
      optimal: {
        alleles: 'GG',
        description: 'Lower CETP activity, higher HDL, better cardiovascular protection',
      },
      moderate: {
        alleles: 'GA',
        description: 'Moderate CETP function',
      },
      highRisk: {
        alleles: 'AA',
        description: 'High CETP activity, lower HDL, higher cardiovascular risk',
      },
    },
    recommendations: {
      optimal: [
        'Maintain healthy lifestyle',
        'HDL naturally higher',
      ],
      moderate: [
        'Omega-3 supplementation',
        'Regular exercise',
        'Healthy fats in diet',
      ],
      highRisk: [
        'High omega-3 intake',
        'Niacin to raise HDL (if appropriate)',
        'Regular cardio exercise',
        'Olive oil and Mediterranean diet',
        'Avoid trans fats',
        'Moderate alcohol (if appropriate)',
        'Monitor lipid panel regularly',
      ],
    },
    relatedMarkers: ['HDL', 'LDL', 'Total cholesterol', 'ApoA1'],
  },
  {
    symbol: 'APOA5',
    name: 'Apolipoprotein A5',
    category: GENE_CATEGORIES.CARDIOVASCULAR,
    function: 'Regulates triglyceride metabolism.',
    variants: {
      optimal: {
        alleles: 'GG',
        description: 'Normal triglyceride metabolism, lower cardiovascular risk',
      },
      moderate: {
        alleles: 'GC',
        description: 'Moderately elevated triglycerides',
      },
      highRisk: {
        alleles: 'CC',
        description: 'Significantly elevated triglycerides, higher cardiovascular disease risk',
      },
    },
    recommendations: {
      optimal: [
        'Standard heart-healthy diet',
        'Regular activity',
      ],
      moderate: [
        'Lower carbohydrate intake',
        'Omega-3 supplementation',
        'Reduce sugar/alcohol',
      ],
      highRisk: [
        'Low-carb diet',
        'High-dose omega-3 (4g EPA/DHA)',
        'Eliminate refined sugars',
        'Limit/avoid alcohol',
        'Regular cardio exercise',
        'Niacin (under supervision)',
        'Frequent triglyceride monitoring',
      ],
    },
    relatedMarkers: ['Triglycerides', 'ApoA5 (if available)', 'Non-HDL cholesterol'],
  },
  {
    symbol: 'PON1',
    name: 'Paraoxonase 1',
    category: GENE_CATEGORIES.CARDIOVASCULAR,
    function: 'Antioxidant enzyme that protects LDL from oxidation. Cardiovascular protective.',
    variants: {
      optimal: {
        alleles: 'AA',
        description: 'High PON1 activity, strong antioxidant protection, lower CVD risk',
      },
      moderate: {
        alleles: 'AG',
        description: 'Moderate PON1 function',
      },
      highRisk: {
        alleles: 'GG',
        description: 'Low PON1 activity, increased LDL oxidation, higher cardiovascular risk',
      },
    },
    recommendations: {
      optimal: [
        'Standard antioxidant intake',
        'Heart-healthy diet',
      ],
      moderate: [
        'Antioxidant-rich foods',
        'Pomegranate juice',
        'Olive oil',
      ],
      highRisk: [
        'High antioxidant diet',
        'Pomegranate extract',
        'Vitamin E',
        'CoQ10',
        'Extra virgin olive oil daily',
        'Avoid oxidized fats',
        'Mediterranean diet',
        'Monitor oxidized LDL (if available)',
      ],
    },
    relatedMarkers: ['Oxidized LDL', 'LDL', 'HDL', 'ApoB'],
  },
];

export const getGeneBySymbol = (symbol: string): GeneData | undefined => {
  return GENETIC_DATA.find((gene) => gene.symbol.toUpperCase() === symbol.toUpperCase());
};

export const getGenesByCategory = (category: string): GeneData[] => {
  return GENETIC_DATA.filter((gene) => gene.category === category);
};

export const getAllCategories = (): string[] => {
  return Object.values(GENE_CATEGORIES);
};

export const getRiskLevel = (gene: GeneData, alleles: string): 'optimal' | 'moderate' | 'highRisk' => {
  const normalizedAlleles = alleles.toUpperCase().replace(/\s/g, '');
  const optimalAlleles = gene.variants.optimal.alleles.toUpperCase().replace(/\s/g, '');
  const moderateAlleles = gene.variants.moderate.alleles.toUpperCase().replace(/\s/g, '');
  const highRiskAlleles = gene.variants.highRisk.alleles.toUpperCase().replace(/\s/g, '');

  if (normalizedAlleles === optimalAlleles) return 'optimal';
  if (normalizedAlleles === moderateAlleles) return 'moderate';
  if (normalizedAlleles === highRiskAlleles) return 'highRisk';

  return 'moderate';
};
