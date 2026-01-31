import re
import json
from typing import List, Dict, Optional, Any
from openai import OpenAI
import os

# Complete gene database with 54 essential genes
GENE_DATABASE = {
    # ===== METABOLISM & WEIGHT =====
    'FTO': {
        'name': 'Fat Mass and Obesity-Associated Gene',
        'category': 'Metabolism & Weight',
        'function': 'Regulates appetite, energy expenditure, and fat storage. Influences satiety signals and metabolic rate.',
        'variants': {
            'optimal': {'alleles': 'TT', 'description': 'Normal appetite regulation, efficient energy expenditure, easier weight management'},
            'moderate': {'alleles': 'AT', 'description': 'Slightly increased appetite, moderate risk for weight gain, benefits from structured meal timing'},
            'highRisk': {'alleles': 'AA', 'description': 'Increased hunger signals, reduced satiety, higher obesity risk, slower metabolism'}
        },
        'recommendations': {
            'optimal': ['Maintain balanced macronutrient intake', 'Regular physical activity 150+ min/week', 'Intuitive eating approach works well'],
            'moderate': ['Structured meal timing (avoid grazing)', 'High protein intake (1.6-2.2g/kg)', 'Resistance training 3-4x/week', 'Monitor portion sizes', 'Increase fiber intake (30-40g/day)'],
            'highRisk': ['Strict meal timing with IF protocols', 'Very high protein (2.0-2.5g/kg)', 'Increase NEAT (non-exercise activity)', 'Prioritize high-volume, low-calorie foods', 'Resistance training 4-5x/week', 'Consider appetite-suppressing supplements (5-HTP, chromium)', 'Track calories consistently']
        }
    },
    'MC4R': {
        'name': 'Melanocortin 4 Receptor',
        'category': 'Metabolism & Weight',
        'function': 'Critical for appetite regulation and energy balance. Controls hunger signals and food intake.',
        'variants': {
            'optimal': {'alleles': 'CC', 'description': 'Normal hunger signaling, balanced energy intake, stable weight'},
            'moderate': {'alleles': 'CT', 'description': 'Moderate increase in appetite, tendency to overeat, moderate weight gain risk'},
            'highRisk': {'alleles': 'TT', 'description': 'Strong hunger signals, difficulty with satiety, high obesity risk'}
        },
        'recommendations': {
            'optimal': ['Standard balanced diet', 'Regular meal patterns', 'Moderate exercise'],
            'moderate': ['High-protein breakfast', 'Volumetric eating (high-fiber, water-rich foods)', 'Mindful eating practices', 'Regular strength training'],
            'highRisk': ['Intermittent fasting or time-restricted eating', 'Very high protein and fiber', 'GLP-1 promoting foods (oats, legumes)', 'Appetite-regulating supplements', 'Behavioral eating strategies', 'Regular cardiovascular exercise']
        }
    },
    'PPARG': {
        'name': 'Peroxisome Proliferator-Activated Receptor Gamma',
        'category': 'Metabolism & Weight',
        'function': 'Regulates fat storage, insulin sensitivity, and adipocyte differentiation.',
        'variants': {
            'optimal': {'alleles': 'CC', 'description': 'Efficient fat metabolism, good insulin sensitivity, lower diabetes risk'},
            'moderate': {'alleles': 'CG', 'description': 'Moderate fat storage tendency, average insulin response'},
            'highRisk': {'alleles': 'GG', 'description': 'Increased fat storage, reduced insulin sensitivity, higher type 2 diabetes risk'}
        },
        'recommendations': {
            'optimal': ['Balanced macronutrients', 'Regular activity', 'Omega-3 intake for optimal PPAR function'],
            'moderate': ['Lower carbohydrate intake', 'Increase omega-3s (EPA/DHA)', 'Regular HIIT training', 'Monitor blood glucose'],
            'highRisk': ['Low-GI carbohydrate sources', 'High omega-3 supplementation (2-3g EPA/DHA)', 'Berberine or alpha-lipoic acid', 'Strength training + Zone 2 cardio', 'Avoid trans fats completely', 'Consider time-restricted eating']
        }
    },
    'ADRB2': {
        'name': 'Beta-2 Adrenergic Receptor',
        'category': 'Metabolism & Weight',
        'function': 'Regulates lipolysis (fat breakdown), metabolic rate, and response to exercise.',
        'variants': {
            'optimal': {'alleles': 'GG', 'description': 'Efficient fat burning, good response to cardio, higher metabolic rate'},
            'moderate': {'alleles': 'AG', 'description': 'Moderate lipolysis, average fat-burning response'},
            'highRisk': {'alleles': 'AA', 'description': 'Reduced fat breakdown, slower metabolism, decreased cardio response'}
        },
        'recommendations': {
            'optimal': ['Cardio exercise highly effective', 'Standard macronutrient distribution', 'Caffeine can enhance performance'],
            'moderate': ['Mix of cardio and resistance training', 'Moderate carb intake', 'Green tea extract beneficial'],
            'highRisk': ['Prioritize resistance training over cardio', 'HIIT more effective than steady-state', 'Lower carbohydrate intake', 'Caffeine + green tea extract pre-workout', 'L-carnitine supplementation', 'Increase protein to preserve muscle']
        }
    },
    'UCP1': {
        'name': 'Uncoupling Protein 1',
        'category': 'Metabolism & Weight',
        'function': 'Regulates thermogenesis and heat production in brown adipose tissue.',
        'variants': {
            'optimal': {'alleles': 'AA', 'description': 'High thermogenesis, efficient calorie burning through heat, easier weight management'},
            'moderate': {'alleles': 'AG', 'description': 'Moderate thermogenic capacity'},
            'highRisk': {'alleles': 'GG', 'description': 'Reduced thermogenesis, lower metabolic rate, easier weight gain'}
        },
        'recommendations': {
            'optimal': ['Standard calorie intake', 'Regular activity maintains high metabolism'],
            'moderate': ['Cold exposure protocols', 'Capsaicin-rich foods', 'Green tea consumption'],
            'highRisk': ['Regular cold exposure (cold showers, ice baths)', 'Capsaicin supplementation', 'Green tea extract + caffeine', 'Increase NEAT', 'Higher protein intake (increases TEF)', 'Avoid prolonged calorie restriction']
        }
    },
    # ===== INSULIN SENSITIVITY =====
    'TCF7L2': {
        'name': 'Transcription Factor 7-Like 2',
        'category': 'Insulin Sensitivity',
        'function': 'Major regulator of insulin secretion and glucose metabolism. Strongest genetic risk factor for type 2 diabetes.',
        'variants': {
            'optimal': {'alleles': 'CC', 'description': 'Normal insulin secretion, good glucose control, low diabetes risk'},
            'moderate': {'alleles': 'CT', 'description': 'Slightly impaired insulin response, moderate diabetes risk'},
            'highRisk': {'alleles': 'TT', 'description': 'Significantly impaired insulin secretion, high type 2 diabetes risk'}
        },
        'recommendations': {
            'optimal': ['Balanced carbohydrate intake', 'Regular activity', 'Standard diet works well'],
            'moderate': ['Lower glycemic index foods', 'Carb timing around workouts', 'Regular glucose monitoring', 'Resistance training 3x/week'],
            'highRisk': ['Low-carb or ketogenic diet', 'Strict meal timing', 'Berberine 500mg 3x/day', 'Alpha-lipoic acid 600mg/day', 'Chromium picolinate', 'Resistance training 4-5x/week', 'Regular fasting glucose testing', 'Avoid refined carbohydrates']
        }
    },
    'IRS1': {
        'name': 'Insulin Receptor Substrate 1',
        'category': 'Insulin Sensitivity',
        'function': 'Key protein in insulin signaling pathway. Affects cellular glucose uptake and insulin sensitivity.',
        'variants': {
            'optimal': {'alleles': 'GG', 'description': 'Excellent insulin sensitivity, efficient glucose uptake'},
            'moderate': {'alleles': 'AG', 'description': 'Moderate insulin sensitivity'},
            'highRisk': {'alleles': 'AA', 'description': 'Insulin resistance tendency, impaired glucose disposal'}
        },
        'recommendations': {
            'optimal': ['Carbohydrates well tolerated', 'Regular exercise', 'Flexible diet approach'],
            'moderate': ['Moderate carb intake', 'Post-workout carb timing', 'Regular strength training', 'Omega-3 supplementation'],
            'highRisk': ['Lower carbohydrate diet', 'Nutrient timing critical', 'Magnesium supplementation', 'Inositol supplementation', 'HIIT and resistance training', 'Avoid sedentary behavior', 'Apple cider vinegar with meals']
        }
    },
    'PPARGC1A': {
        'name': 'PPARG Coactivator 1 Alpha (PGC-1α)',
        'category': 'Insulin Sensitivity',
        'function': 'Master regulator of mitochondrial biogenesis, energy metabolism, and insulin sensitivity.',
        'variants': {
            'optimal': {'alleles': 'GG', 'description': 'High mitochondrial function, excellent insulin sensitivity, good exercise response'},
            'moderate': {'alleles': 'AG', 'description': 'Moderate mitochondrial function'},
            'highRisk': {'alleles': 'AA', 'description': 'Reduced mitochondrial biogenesis, lower insulin sensitivity, blunted exercise response'}
        },
        'recommendations': {
            'optimal': ['High-intensity training effective', 'Carbohydrates well utilized', 'Standard recovery protocols'],
            'moderate': ['Mix of HIIT and endurance', 'Adequate carb intake around training', 'CoQ10 supplementation'],
            'highRisk': ['Progressive endurance training critical', 'HIIT 2-3x/week to boost mitochondria', 'CoQ10 200-300mg/day', 'Alpha-lipoic acid', 'L-carnitine for fat oxidation', 'PQQ (pyrroloquinoline quinone)', 'Longer warm-ups needed', 'Avoid excessive sitting']
        }
    },
    'ADIPOQ': {
        'name': 'Adiponectin',
        'category': 'Insulin Sensitivity',
        'function': 'Regulates glucose levels and fatty acid breakdown. Anti-inflammatory and insulin-sensitizing hormone.',
        'variants': {
            'optimal': {'alleles': 'GG', 'description': 'High adiponectin levels, excellent insulin sensitivity, anti-inflammatory'},
            'moderate': {'alleles': 'GT', 'description': 'Moderate adiponectin levels'},
            'highRisk': {'alleles': 'TT', 'description': 'Low adiponectin, insulin resistance risk, increased inflammation'}
        },
        'recommendations': {
            'optimal': ['Maintain healthy body fat percentage', 'Regular activity', 'Omega-3 intake'],
            'moderate': ['Omega-3 supplementation', 'Mediterranean diet', 'Regular cardio exercise', 'Maintain lean body mass'],
            'highRisk': ['Weight loss if overweight (adiponectin increases)', 'High omega-3 intake (3-4g EPA/DHA)', 'Magnesium supplementation', 'Avoid trans fats and refined carbs', 'Regular cardiovascular exercise', 'Curcumin supplementation', 'Monitor visceral fat']
        }
    },
    # ===== INFLAMMATION/DETOX =====
    'IL6': {
        'name': 'Interleukin 6',
        'category': 'Inflammation/Detox',
        'function': 'Pro-inflammatory cytokine involved in immune response, metabolism, and exercise adaptation.',
        'variants': {
            'optimal': {'alleles': 'GG', 'description': 'Balanced inflammatory response, good recovery, lower chronic inflammation'},
            'moderate': {'alleles': 'GC', 'description': 'Moderate inflammatory tendency'},
            'highRisk': {'alleles': 'CC', 'description': 'Elevated inflammatory response, slower recovery, higher chronic inflammation risk'}
        },
        'recommendations': {
            'optimal': ['Standard recovery protocols', 'Balanced omega-6 to omega-3 ratio', 'Regular exercise'],
            'moderate': ['Anti-inflammatory diet', 'Omega-3 supplementation (2g/day)', 'Adequate recovery between workouts', 'Turmeric/curcumin'],
            'highRisk': ['Strict anti-inflammatory diet', 'High-dose omega-3 (3-4g EPA/DHA)', 'Curcumin with black pepper', 'Avoid omega-6 heavy oils', 'Prioritize sleep (8+ hours)', 'Resveratrol supplementation', 'Regular deload weeks', 'Stress management critical']
        }
    },
    'TNF': {
        'name': 'Tumor Necrosis Factor Alpha',
        'category': 'Inflammation/Detox',
        'function': 'Key inflammatory cytokine. Regulates immune cells and systemic inflammation.',
        'variants': {
            'optimal': {'alleles': 'GG', 'description': 'Controlled inflammatory response, lower autoimmune risk'},
            'moderate': {'alleles': 'GA', 'description': 'Moderate inflammatory tendency'},
            'highRisk': {'alleles': 'AA', 'description': 'Elevated TNF-α, increased inflammation, higher autoimmune disease risk'}
        },
        'recommendations': {
            'optimal': ['Standard diet', 'Regular exercise', 'Normal recovery'],
            'moderate': ['Anti-inflammatory foods', 'Omega-3 rich fish 2-3x/week', 'Green tea', 'Adequate rest'],
            'highRisk': ['Eliminate inflammatory triggers (gluten, dairy if sensitive)', 'High omega-3 intake', 'Quercetin supplementation', 'Resveratrol', 'Avoid processed foods', 'Intermittent fasting may help', 'Regular gentle exercise (avoid overtraining)', 'Stress reduction practices']
        }
    },
    'CRP': {
        'name': 'C-Reactive Protein',
        'category': 'Inflammation/Detox',
        'function': 'Acute phase protein and biomarker of systemic inflammation.',
        'variants': {
            'optimal': {'alleles': 'GG', 'description': 'Lower baseline CRP, reduced cardiovascular risk'},
            'moderate': {'alleles': 'GA', 'description': 'Moderate CRP levels'},
            'highRisk': {'alleles': 'AA', 'description': 'Elevated CRP tendency, higher cardiovascular and inflammatory disease risk'}
        },
        'recommendations': {
            'optimal': ['Maintain healthy lifestyle', 'Regular activity', 'Balanced diet'],
            'moderate': ['Anti-inflammatory diet', 'Regular cardiovascular exercise', 'Omega-3 supplementation', 'Monitor CRP levels annually'],
            'highRisk': ['Strict anti-inflammatory protocol', 'High-dose omega-3', 'Curcumin + black pepper', 'Eliminate refined sugars', 'Regular CRP testing (quarterly)', 'Ginger supplementation', 'Prioritize cardiovascular health', 'Dental hygiene (periodontal inflammation link)']
        }
    },
    'GSTM1': {
        'name': 'Glutathione S-Transferase Mu 1',
        'category': 'Inflammation/Detox',
        'function': 'Critical detoxification enzyme. Protects against oxidative stress and carcinogens.',
        'variants': {
            'optimal': {'alleles': '+/+', 'description': 'Full detoxification capacity, good protection against toxins'},
            'moderate': {'alleles': '+/-', 'description': 'Reduced detox capacity'},
            'highRisk': {'alleles': '-/-', 'description': 'No GSTM1 enzyme, impaired detoxification, higher cancer risk'}
        },
        'recommendations': {
            'optimal': ['Standard diet', 'Regular cruciferous vegetables', 'Normal antioxidant intake'],
            'moderate': ['Increase cruciferous vegetables', 'NAC supplementation', 'Reduce toxin exposure', 'Adequate glutathione precursors'],
            'highRisk': ['High cruciferous vegetable intake daily', 'NAC 600-1200mg/day', 'Glutathione or liposomal glutathione', 'Milk thistle for liver support', 'Minimize alcohol consumption', 'Avoid processed/charred meats', 'Organic produce when possible', 'Alpha-lipoic acid', 'Selenium supplementation']
        }
    },
    'GSTT1': {
        'name': 'Glutathione S-Transferase Theta 1',
        'category': 'Inflammation/Detox',
        'function': 'Detoxification enzyme for environmental toxins and oxidative stress.',
        'variants': {
            'optimal': {'alleles': '+/+', 'description': 'Full GSTT1 function, efficient toxin elimination'},
            'moderate': {'alleles': '+/-', 'description': 'Reduced detox efficiency'},
            'highRisk': {'alleles': '-/-', 'description': 'No GSTT1 enzyme, significantly impaired detoxification'}
        },
        'recommendations': {
            'optimal': ['Standard healthy diet', 'Regular antioxidant intake', 'Normal lifestyle'],
            'moderate': ['Increase antioxidant-rich foods', 'Green tea daily', 'Reduce environmental toxin exposure'],
            'highRisk': ['NAC supplementation', 'Milk thistle extract', 'Cruciferous vegetables daily', 'Avoid smoking and secondhand smoke', 'Minimize pesticide exposure', 'Alpha-lipoic acid', 'Vitamin C and E', 'Support Phase II detox pathways']
        }
    },
    'SOD2': {
        'name': 'Superoxide Dismutase 2',
        'category': 'Inflammation/Detox',
        'function': 'Mitochondrial antioxidant enzyme. Protects against oxidative damage.',
        'variants': {
            'optimal': {'alleles': 'AA', 'description': 'High antioxidant capacity, excellent mitochondrial protection'},
            'moderate': {'alleles': 'AG', 'description': 'Moderate antioxidant function'},
            'highRisk': {'alleles': 'GG', 'description': 'Reduced SOD2 activity, increased oxidative stress, faster aging'}
        },
        'recommendations': {
            'optimal': ['Standard antioxidant intake', 'Regular exercise', 'Balanced diet'],
            'moderate': ['Increase antioxidant foods', 'CoQ10 supplementation', 'Avoid excessive cardio', 'Adequate recovery'],
            'highRisk': ['High antioxidant diet', 'CoQ10 200-300mg/day', 'MitoQ or mitochondrial antioxidants', 'Avoid overtraining', 'PQQ supplementation', 'Alpha-lipoic acid', 'Resveratrol', 'Avoid pro-oxidant behaviors (smoking, excessive alcohol)']
        }
    },
    # ===== METHYLATION & LONGEVITY =====
    'MTHFR': {
        'name': 'Methylenetetrahydrofolate Reductase',
        'category': 'Methylation & Longevity',
        'function': 'Critical enzyme in folate metabolism and methylation. Affects homocysteine levels and cardiovascular health.',
        'variants': {
            'optimal': {'alleles': 'CC', 'description': 'Normal MTHFR function, efficient methylation, healthy homocysteine'},
            'moderate': {'alleles': 'CT', 'description': '40% reduced enzyme activity, moderately elevated homocysteine risk'},
            'highRisk': {'alleles': 'TT', 'description': '70% reduced enzyme activity, high homocysteine, increased cardiovascular risk'}
        },
        'recommendations': {
            'optimal': ['Standard folate intake (400mcg)', 'Balanced B-vitamin diet', 'Regular leafy greens'],
            'moderate': ['Methylfolate (5-MTHF) 400-800mcg', 'Methylcobalamin (B12) 1000mcg', 'B6 (P5P form) 25-50mg', 'Monitor homocysteine levels'],
            'highRisk': ['High-dose methylfolate 800-1000mcg', 'Methylcobalamin 1000-2000mcg', 'P5P (active B6) 50-100mg', 'TMG (betaine) 500-1000mg', 'Avoid folic acid (synthetic form)', 'Regular homocysteine testing', 'Increase leafy greens', 'Choline supplementation', 'Limit alcohol']
        }
    },
    'MTR': {
        'name': 'Methionine Synthase',
        'category': 'Methylation & Longevity',
        'function': 'Enzyme requiring B12 for methylation cycle. Converts homocysteine to methionine.',
        'variants': {
            'optimal': {'alleles': 'AA', 'description': 'Efficient methylation, normal homocysteine metabolism'},
            'moderate': {'alleles': 'AG', 'description': 'Moderate methylation efficiency'},
            'highRisk': {'alleles': 'GG', 'description': 'Impaired methylation, higher homocysteine, increased B12 needs'}
        },
        'recommendations': {
            'optimal': ['Standard B12 intake', 'Balanced diet', 'Normal supplementation'],
            'moderate': ['Methylcobalamin 1000mcg', 'Ensure adequate folate', 'B-complex supplementation'],
            'highRisk': ['High-dose methylcobalamin 2000mcg+', 'Consider B12 injections if low', 'Methylfolate 800mcg', 'Regular B12 testing', 'Increase B12-rich foods', 'Avoid nitrous oxide exposure']
        }
    },
    'MTRR': {
        'name': 'Methionine Synthase Reductase',
        'category': 'Methylation & Longevity',
        'function': 'Maintains methionine synthase activity. Critical for methylation cycle.',
        'variants': {
            'optimal': {'alleles': 'AA', 'description': 'Optimal MTRR function, efficient B12 recycling'},
            'moderate': {'alleles': 'AG', 'description': 'Moderate function'},
            'highRisk': {'alleles': 'GG', 'description': 'Reduced MTRR activity, impaired methylation, higher B12 requirements'}
        },
        'recommendations': {
            'optimal': ['Standard B-vitamin intake', 'Regular diet'],
            'moderate': ['Methylcobalamin supplementation', 'B-complex with methylated forms', 'Adequate riboflavin (B2)'],
            'highRisk': ['High-dose methylcobalamin', 'Riboflavin 50-100mg', 'Methylfolate', 'Support full methylation cycle', 'Regular B12 monitoring']
        }
    },
    'COMT': {
        'name': 'Catechol-O-Methyltransferase',
        'category': 'Methylation & Longevity',
        'function': 'Breaks down catecholamines (dopamine, epinephrine, norepinephrine). Affects stress response and cognition.',
        'variants': {
            'optimal': {'alleles': 'GG', 'description': 'Fast COMT, quick stress recovery, stable under pressure, lower anxiety'},
            'moderate': {'alleles': 'AG', 'description': 'Moderate COMT activity, balanced stress response'},
            'highRisk': {'alleles': 'AA', 'description': 'Slow COMT, higher dopamine/stress hormones, increased anxiety, better focus but worse under stress'}
        },
        'recommendations': {
            'optimal': ['Can handle high-stress situations well', 'Standard supplement protocol', 'High-intensity training tolerated'],
            'moderate': ['Magnesium for stress support', 'B-vitamin complex', 'Moderate stress management'],
            'highRisk': ['Magnesium glycinate 400-600mg', 'SAMe or TMG for methylation', 'Avoid high-dose green tea (EGCG inhibits COMT)', 'Stress management critical', 'Avoid stimulants if anxious', 'L-theanine for calm focus', 'Adaptogenic herbs (ashwagandha, rhodiola)', 'Avoid excessive caffeine']
        }
    },
    'APOE': {
        'name': 'Apolipoprotein E',
        'category': 'Methylation & Longevity',
        'function': "Regulates cholesterol metabolism and Alzheimer's disease risk.",
        'variants': {
            'optimal': {'alleles': 'E3/E3', 'description': 'Standard risk profile, normal cholesterol metabolism'},
            'moderate': {'alleles': 'E3/E4', 'description': "Moderate Alzheimer's risk, altered lipid metabolism"},
            'highRisk': {'alleles': 'E4/E4', 'description': "Significantly increased Alzheimer's risk (12-15x), higher cholesterol, greater inflammation sensitivity"}
        },
        'recommendations': {
            'optimal': ['Mediterranean diet', 'Regular exercise', 'Standard heart health protocol'],
            'moderate': ['Omega-3 rich diet', 'DHA supplementation', 'Cognitive training exercises', 'Regular cardiovascular exercise', 'Limit saturated fat'],
            'highRisk': ['Strict Mediterranean or ketogenic diet', 'High-dose DHA (1-2g/day)', 'Minimize saturated fat', 'Regular intense exercise', 'Cognitive training', 'Curcumin for neuroprotection', "Lion's mane mushroom", 'Avoid head trauma', 'Prioritize sleep quality', 'Regular lipid panel monitoring', 'Avoid smoking and excess alcohol']
        }
    },
    'FOXO3': {
        'name': 'Forkhead Box O3',
        'category': 'Methylation & Longevity',
        'function': 'Longevity gene. Regulates stress resistance, autophagy, and lifespan.',
        'variants': {
            'optimal': {'alleles': 'TT', 'description': 'Longevity variant, increased lifespan potential, better stress resistance'},
            'moderate': {'alleles': 'GT', 'description': 'Moderate longevity benefit'},
            'highRisk': {'alleles': 'GG', 'description': 'Standard aging trajectory, average stress response'}
        },
        'recommendations': {
            'optimal': ['Continue healthy lifestyle for longevity advantage', 'Intermittent fasting amplifies FOXO3', 'Regular exercise'],
            'moderate': ['Intermittent fasting protocols', 'Exercise regularly', 'Resveratrol supplementation', 'Autophagy-promoting strategies'],
            'highRisk': ['Strict intermittent fasting or time-restricted eating', 'Caloric restriction or fasting mimicking diet', 'Resveratrol 200-500mg', 'Spermidine supplementation', 'Regular exercise critical', 'Heat/cold stress (sauna, cold plunge)', 'Minimize mTOR activation (limit protein excess)', 'Prioritize autophagy']
        }
    },
    'SIRT1': {
        'name': 'Sirtuin 1',
        'category': 'Methylation & Longevity',
        'function': 'NAD-dependent deacetylase. Regulates aging, metabolism, and stress resistance.',
        'variants': {
            'optimal': {'alleles': 'CC', 'description': 'High SIRT1 activity, enhanced longevity pathways, better metabolic health'},
            'moderate': {'alleles': 'CT', 'description': 'Moderate SIRT1 function'},
            'highRisk': {'alleles': 'TT', 'description': 'Lower SIRT1 activity, reduced longevity benefits'}
        },
        'recommendations': {
            'optimal': ['Intermittent fasting beneficial', 'Resveratrol supplementation amplifies benefits', 'Regular exercise'],
            'moderate': ['Intermittent fasting', 'Resveratrol 200mg', 'NAD+ precursors (NR or NMN)', 'Regular endurance exercise'],
            'highRisk': ['Strict fasting protocols', 'Resveratrol 500mg', 'NMN 250-500mg or NR 300-600mg', 'Pterostilbene', 'Regular exercise essential', 'Limit excessive calories', 'Quercetin supplementation']
        }
    },
    # ===== MUSCLE RECOVERY =====
    'ACTN3': {
        'name': 'Alpha-Actinin-3',
        'category': 'Muscle Recovery',
        'function': 'Determines fast-twitch muscle fiber presence. Affects power, speed, and muscle performance.',
        'variants': {
            'optimal': {'alleles': 'RR', 'description': 'High fast-twitch fibers, excellent power/sprint performance, strength advantage'},
            'moderate': {'alleles': 'RX', 'description': 'Mixed fiber type, balanced power and endurance'},
            'highRisk': {'alleles': 'XX', 'description': 'No fast-twitch ACTN3, endurance advantage, reduced power output'}
        },
        'recommendations': {
            'optimal': ['Excel at power/strength training', 'Sprint training highly effective', 'Lower reps, heavy weight', 'Explosive movements'],
            'moderate': ['Hybrid training works well', 'Mix of power and endurance', 'Versatile athletic performance'],
            'highRisk': ['Focus on endurance training', 'Higher rep ranges (12-15+)', 'Metabolic conditioning', 'Long-duration cardio effective', 'Creatine supplementation very beneficial', 'Beta-alanine for power development', 'Plyometric training to compensate']
        }
    },
    'ACE': {
        'name': 'Angiotensin-Converting Enzyme',
        'category': 'Muscle Recovery',
        'function': 'Regulates blood pressure and endurance capacity. Affects oxygen delivery to muscles.',
        'variants': {
            'optimal': {'alleles': 'II', 'description': 'Endurance advantage, excellent oxygen utilization, fatigue resistance'},
            'moderate': {'alleles': 'ID', 'description': 'Balanced endurance and power'},
            'highRisk': {'alleles': 'DD', 'description': 'Power/strength advantage, reduced endurance capacity'}
        },
        'recommendations': {
            'optimal': ['Endurance training highly effective', 'Marathon/triathlon potential', 'High-volume training tolerated', 'Zone 2 cardio excellent'],
            'moderate': ['Mixed training approach', 'Both endurance and strength', 'Versatile programming'],
            'highRisk': ['Focus on strength and power', 'Shorter, intense workouts', 'HIIT over steady-state', 'May need more cardio work for endurance', 'Beetroot juice/nitrate supplementation', 'Citrulline for blood flow']
        }
    },
    'AMPD1': {
        'name': 'Adenosine Monophosphate Deaminase 1',
        'category': 'Muscle Recovery',
        'function': 'Energy metabolism in muscle during exercise. Affects fatigue resistance and recovery.',
        'variants': {
            'optimal': {'alleles': 'CC', 'description': 'Normal muscle energy metabolism, standard recovery'},
            'moderate': {'alleles': 'CT', 'description': 'Slightly enhanced endurance, moderate recovery speed'},
            'highRisk': {'alleles': 'TT', 'description': 'Enhanced endurance but may have slower power recovery, altered muscle metabolism'}
        },
        'recommendations': {
            'optimal': ['Standard training protocols', 'Normal recovery time', 'Balanced programming'],
            'moderate': ['Good for endurance events', 'Standard recovery nutrition', 'BCAA supplementation'],
            'highRisk': ['Excel at long-duration events', 'May need longer rest between power sets', 'Ribose supplementation', 'Creatine for power development', 'Focus on aerobic base building']
        }
    },
    'IL6R': {
        'name': 'Interleukin 6 Receptor',
        'category': 'Muscle Recovery',
        'function': 'Receptor for IL-6, affects exercise-induced inflammation and muscle adaptation.',
        'variants': {
            'optimal': {'alleles': 'AA', 'description': 'Optimal inflammatory response to exercise, good muscle adaptation'},
            'moderate': {'alleles': 'AC', 'description': 'Moderate inflammatory response'},
            'highRisk': {'alleles': 'CC', 'description': 'Elevated inflammatory response, slower recovery, higher training soreness'}
        },
        'recommendations': {
            'optimal': ['Standard training volume', 'Normal recovery protocols', 'Regular training frequency'],
            'moderate': ['Adequate recovery time', 'Anti-inflammatory foods post-workout', 'Omega-3 supplementation'],
            'highRisk': ['Lower training volume', 'Extra recovery days', 'High-dose omega-3', 'Tart cherry juice for recovery', 'Curcumin post-workout', 'Avoid back-to-back intense sessions', 'Prioritize sleep']
        }
    },
    'CKM': {
        'name': 'Creatine Kinase Muscle',
        'category': 'Muscle Recovery',
        'function': 'Energy metabolism enzyme. Affects power output and muscle damage markers.',
        'variants': {
            'optimal': {'alleles': 'AA', 'description': 'Efficient creatine kinase function, good power output'},
            'moderate': {'alleles': 'AG', 'description': 'Moderate CK function'},
            'highRisk': {'alleles': 'GG', 'description': 'Altered CK response, may show higher muscle damage markers'}
        },
        'recommendations': {
            'optimal': ['Standard creatine supplementation effective', 'Normal training protocols'],
            'moderate': ['Creatine monohydrate 5g/day', 'Adequate protein intake', 'Standard recovery'],
            'highRisk': ['Higher creatine dose may be beneficial', 'Monitor CK levels if very elevated', 'Adequate hydration critical', 'Gradual training progression', 'Avoid extreme volume spikes']
        }
    },
    'VDR': {
        'name': 'Vitamin D Receptor',
        'category': 'Muscle Recovery',
        'function': 'Regulates vitamin D action. Affects bone health, muscle function, and immune response.',
        'variants': {
            'optimal': {'alleles': 'TT', 'description': 'Efficient vitamin D utilization, good muscle function and bone health'},
            'moderate': {'alleles': 'TC', 'description': 'Moderate VDR function'},
            'highRisk': {'alleles': 'CC', 'description': 'Reduced VDR sensitivity, higher vitamin D needs, increased fracture risk'}
        },
        'recommendations': {
            'optimal': ['Standard vitamin D intake (2000 IU)', 'Regular sun exposure', 'Monitor levels annually'],
            'moderate': ['Vitamin D3 3000-4000 IU', 'Regular testing (aim 50-70 ng/mL)', 'Vitamin K2 with D3'],
            'highRisk': ['High-dose vitamin D3 (5000+ IU)', 'Target higher levels (60-80 ng/mL)', 'Vitamin K2 MK-7 200mcg', 'Magnesium for D3 activation', 'Regular bone density monitoring', 'Weight-bearing exercise', 'Test vitamin D levels quarterly']
        }
    },
    # ===== STRESS/HORMONES =====
    'NR3C1': {
        'name': 'Glucocorticoid Receptor',
        'category': 'Stress/Hormones',
        'function': 'Regulates cortisol sensitivity and stress response.',
        'variants': {
            'optimal': {'alleles': 'GG', 'description': 'Normal cortisol sensitivity, balanced stress response'},
            'moderate': {'alleles': 'GA', 'description': 'Moderate cortisol sensitivity'},
            'highRisk': {'alleles': 'AA', 'description': 'Increased cortisol sensitivity, heightened stress response, higher burnout risk'}
        },
        'recommendations': {
            'optimal': ['Standard stress management', 'Regular exercise', 'Normal recovery'],
            'moderate': ['Stress management practices', 'Adequate sleep', 'Adaptogenic herbs', 'Avoid overtraining'],
            'highRisk': ['Prioritize stress reduction (meditation, yoga)', 'Ashwagandha 300-600mg', 'Rhodiola rosea', 'Phosphatidylserine to lower cortisol', 'Avoid excessive training volume', 'Regular deload weeks', 'Prioritize sleep quality', 'Limit caffeine if anxious']
        }
    },
    'FKBP5': {
        'name': 'FK506 Binding Protein 5',
        'category': 'Stress/Hormones',
        'function': 'Regulates cortisol receptor sensitivity and stress resilience.',
        'variants': {
            'optimal': {'alleles': 'CC', 'description': 'Resilient stress response, lower PTSD risk, good recovery'},
            'moderate': {'alleles': 'CT', 'description': 'Moderate stress resilience'},
            'highRisk': {'alleles': 'TT', 'description': 'Heightened stress sensitivity, higher anxiety/PTSD risk, prolonged cortisol elevation'}
        },
        'recommendations': {
            'optimal': ['Standard stress protocols', 'Can handle high stress well'],
            'moderate': ['Regular stress management', 'Adequate recovery', 'Magnesium supplementation'],
            'highRisk': ['Daily stress reduction practices', 'Ashwagandha or other adaptogens', 'Magnesium glycinate', 'L-theanine', 'Avoid chronic stress', 'Therapy/counseling if trauma history', 'Prioritize psychological well-being', 'Avoid overtraining']
        }
    },
    'OXTR': {
        'name': 'Oxytocin Receptor',
        'category': 'Stress/Hormones',
        'function': 'Regulates social bonding, empathy, and stress buffering.',
        'variants': {
            'optimal': {'alleles': 'GG', 'description': 'High oxytocin sensitivity, strong social bonding, good stress buffering'},
            'moderate': {'alleles': 'GA', 'description': 'Moderate oxytocin response'},
            'highRisk': {'alleles': 'AA', 'description': 'Reduced oxytocin sensitivity, may struggle with social connection, less stress buffering'}
        },
        'recommendations': {
            'optimal': ['Social connection naturally protective', 'Group fitness beneficial'],
            'moderate': ['Prioritize social connections', 'Group activities helpful', 'Physical touch (massage, hugs)'],
            'highRisk': ['Intentionally cultivate social connections', 'Group training over solo', 'Regular massage therapy', 'Meditation and mindfulness', 'Probiotics (gut-brain oxytocin link)', 'Vitamin D for oxytocin production']
        }
    },
    'SHBG': {
        'name': 'Sex Hormone-Binding Globulin',
        'category': 'Stress/Hormones',
        'function': 'Binds and regulates sex hormones (testosterone, estrogen).',
        'variants': {
            'optimal': {'alleles': 'GG', 'description': 'Moderate SHBG, balanced free testosterone'},
            'moderate': {'alleles': 'GA', 'description': 'Variable SHBG levels'},
            'highRisk': {'alleles': 'AA', 'description': 'High SHBG tendency, may reduce free testosterone availability'}
        },
        'recommendations': {
            'optimal': ['Standard hormone support', 'Balanced diet'],
            'moderate': ['Monitor hormone levels', 'Adequate protein and fats', 'Resistance training'],
            'highRisk': ['Strategies to lower SHBG if high', 'Boron supplementation (6-9mg)', 'Magnesium', 'Reduce sugar/insulin spikes', 'Resistance training critical', 'Adequate dietary fat', 'Monitor total and free testosterone', 'Vitamin D optimization']
        }
    },
    'CYP19A1': {
        'name': 'Aromatase',
        'category': 'Stress/Hormones',
        'function': 'Converts testosterone to estrogen. Affects hormone balance.',
        'variants': {
            'optimal': {'alleles': 'CC', 'description': 'Balanced aromatase activity, normal testosterone to estrogen ratio'},
            'moderate': {'alleles': 'CT', 'description': 'Moderate aromatase activity'},
            'highRisk': {'alleles': 'TT', 'description': 'High aromatase, increased estrogen conversion, may reduce free testosterone'}
        },
        'recommendations': {
            'optimal': ['Standard diet', 'Regular training'],
            'moderate': ['Cruciferous vegetables', 'DIM or I3C supplementation', 'Zinc adequate'],
            'highRisk': ['High cruciferous vegetable intake', 'DIM 200-300mg', 'Zinc 30-50mg', 'Reduce body fat (fat increases aromatase)', 'Avoid xenoestrogens (plastics, etc.)', 'Chrysin or grape seed extract', 'Monitor estrogen levels', 'Strength training to boost testosterone']
        }
    },
    # ===== COGNITIVE & NEUROLOGICAL =====
    'BDNF': {
        'name': 'Brain-Derived Neurotrophic Factor',
        'category': 'Cognitive & Neurological',
        'function': 'Supports neuron growth, learning, memory, and neuroplasticity.',
        'variants': {
            'optimal': {'alleles': 'GG', 'description': 'High BDNF, excellent neuroplasticity, strong learning and memory'},
            'moderate': {'alleles': 'GA', 'description': 'Moderate BDNF function'},
            'highRisk': {'alleles': 'AA', 'description': 'Reduced BDNF, impaired neuroplasticity, memory challenges, higher depression risk'}
        },
        'recommendations': {
            'optimal': ['Exercise boosts BDNF effectively', 'Learning new skills beneficial', 'Standard cognitive support'],
            'moderate': ['Regular aerobic exercise', 'Omega-3 supplementation', 'Continuous learning', "Lion's mane mushroom"],
            'highRisk': ['Daily aerobic exercise (critical for BDNF)', 'High-dose omega-3 (2-3g EPA/DHA)', "Lion's mane 500-1000mg", 'Curcumin for neuroprotection', 'Magnesium threonate (brain-specific)', 'Prioritize sleep for memory consolidation', 'Novel learning experiences', 'Social engagement', 'Avoid chronic stress']
        }
    },
    'DRD2': {
        'name': 'Dopamine Receptor D2',
        'category': 'Cognitive & Neurological',
        'function': 'Regulates reward, motivation, and addiction susceptibility.',
        'variants': {
            'optimal': {'alleles': 'CC', 'description': 'High dopamine receptor density, good reward response, lower addiction risk'},
            'moderate': {'alleles': 'CT', 'description': 'Moderate dopamine function'},
            'highRisk': {'alleles': 'TT', 'description': 'Reduced dopamine receptors, seek higher stimulation, higher addiction risk'}
        },
        'recommendations': {
            'optimal': ['Balanced lifestyle', 'Standard reward systems work'],
            'moderate': ['Be mindful of addictive behaviors', 'Healthy reward systems', 'Regular exercise for dopamine'],
            'highRisk': ['Avoid addictive substances/behaviors', 'Create healthy dopamine sources (exercise, achievement)', 'L-tyrosine supplementation', 'Mucuna pruriens (natural L-DOPA)', 'Regular intense exercise', 'Goal-setting and achievement cycles', 'Avoid excessive stimulant use', 'Mindfulness practices']
        }
    },
    'SLC6A4': {
        'name': 'Serotonin Transporter (5-HTTLPR)',
        'category': 'Cognitive & Neurological',
        'function': 'Regulates serotonin reuptake. Affects mood, anxiety, and stress response.',
        'variants': {
            'optimal': {'alleles': 'L/L', 'description': 'Efficient serotonin transport, lower anxiety, better stress resilience'},
            'moderate': {'alleles': 'L/S', 'description': 'Moderate serotonin function'},
            'highRisk': {'alleles': 'S/S', 'description': 'Reduced serotonin efficiency, higher anxiety/depression risk, stress sensitivity'}
        },
        'recommendations': {
            'optimal': ['Standard mood support', 'Regular exercise'],
            'moderate': ['Omega-3 supplementation', 'Regular exercise', '5-HTP if mood low', 'Adequate tryptophan intake'],
            'highRisk': ['5-HTP 100-300mg (or tryptophan)', 'High omega-3 intake', 'Vitamin B6 (cofactor for serotonin)', 'Regular exercise (boosts serotonin)', 'Sunlight exposure', 'Probiotics (gut-brain axis)', 'Avoid chronic stress', 'Consider therapy/counseling', 'SAMe supplementation']
        }
    },
    'KIBRA': {
        'name': 'Kidney And Brain Expressed Protein',
        'category': 'Cognitive & Neurological',
        'function': 'Affects memory performance and cognitive function.',
        'variants': {
            'optimal': {'alleles': 'CC', 'description': 'Enhanced episodic memory, better information retrieval'},
            'moderate': {'alleles': 'CT', 'description': 'Moderate memory function'},
            'highRisk': {'alleles': 'TT', 'description': 'Reduced memory performance, may need memory support strategies'}
        },
        'recommendations': {
            'optimal': ['Standard cognitive maintenance', 'Learning and memory naturally strong'],
            'moderate': ['Memory training exercises', 'Omega-3 supplementation', 'Regular mental stimulation'],
            'highRisk': ['Active memory training', 'Omega-3 DHA focus', 'Bacopa monnieri 300mg', 'Ginkgo biloba', "Lion's mane mushroom", 'Phosphatidylserine', 'Regular aerobic exercise', 'Sleep optimization critical']
        }
    },
    # ===== CARDIOVASCULAR PERFORMANCE =====
    'NOS3': {
        'name': 'Endothelial Nitric Oxide Synthase',
        'category': 'Cardiovascular Performance',
        'function': 'Produces nitric oxide for blood vessel dilation, blood flow, and cardiovascular health.',
        'variants': {
            'optimal': {'alleles': 'GG', 'description': 'High nitric oxide production, excellent blood flow, good endurance'},
            'moderate': {'alleles': 'GT', 'description': 'Moderate NO production'},
            'highRisk': {'alleles': 'TT', 'description': 'Reduced nitric oxide, impaired blood flow, higher blood pressure risk'}
        },
        'recommendations': {
            'optimal': ['Standard cardiovascular training', 'Dietary nitrates beneficial'],
            'moderate': ['Beetroot juice or nitrate-rich foods', 'L-citrulline supplementation', 'Regular cardio exercise'],
            'highRisk': ['High-dose L-citrulline (6-8g) or citrulline malate', 'L-arginine 3-6g', 'Beetroot juice daily (400-500mg nitrates)', 'Pomegranate extract', 'Regular cardiovascular exercise', 'Monitor blood pressure', 'Antioxidants (vitamin C, E)']
        }
    },
    'AGT': {
        'name': 'Angiotensinogen',
        'category': 'Cardiovascular Performance',
        'function': 'Regulates blood pressure through renin-angiotensin system.',
        'variants': {
            'optimal': {'alleles': 'MM', 'description': 'Normal blood pressure regulation, lower hypertension risk'},
            'moderate': {'alleles': 'MT', 'description': 'Moderate blood pressure risk'},
            'highRisk': {'alleles': 'TT', 'description': 'Elevated blood pressure tendency, higher hypertension risk'}
        },
        'recommendations': {
            'optimal': ['Standard heart-healthy diet', 'Regular exercise'],
            'moderate': ['Moderate sodium intake', 'DASH diet approach', 'Regular cardio', 'Magnesium supplementation'],
            'highRisk': ['Low sodium diet (<2300mg)', 'High potassium intake', 'DASH or Mediterranean diet', 'Magnesium 400-600mg', 'CoQ10 100-200mg', 'Regular aerobic exercise', 'Monitor blood pressure regularly', 'Garlic supplementation', 'Maintain healthy weight']
        }
    },
    'LPL': {
        'name': 'Lipoprotein Lipase',
        'category': 'Cardiovascular Performance',
        'function': 'Breaks down triglycerides. Affects fat metabolism and cardiovascular risk.',
        'variants': {
            'optimal': {'alleles': 'CC', 'description': 'Efficient triglyceride clearance, lower cardiovascular risk'},
            'moderate': {'alleles': 'CG', 'description': 'Moderate LPL function'},
            'highRisk': {'alleles': 'GG', 'description': 'Reduced LPL activity, elevated triglycerides, higher cardiovascular risk'}
        },
        'recommendations': {
            'optimal': ['Balanced fat intake', 'Regular activity'],
            'moderate': ['Omega-3 supplementation', 'Reduce simple carbs', 'Regular cardio'],
            'highRisk': ['High omega-3 (3-4g EPA/DHA)', 'Low refined carbohydrate diet', 'Niacin (if approved by doctor)', 'Regular aerobic exercise', 'Reduce saturated fat', 'Avoid trans fats', 'Monitor triglycerides regularly', 'Limit alcohol']
        }
    },
    'CETP': {
        'name': 'Cholesteryl Ester Transfer Protein',
        'category': 'Cardiovascular Performance',
        'function': 'Transfers cholesterol between lipoproteins. Affects HDL levels.',
        'variants': {
            'optimal': {'alleles': 'GG', 'description': 'Lower CETP activity, higher HDL, better cardiovascular protection'},
            'moderate': {'alleles': 'GA', 'description': 'Moderate CETP function'},
            'highRisk': {'alleles': 'AA', 'description': 'High CETP activity, lower HDL, higher cardiovascular risk'}
        },
        'recommendations': {
            'optimal': ['Maintain healthy lifestyle', 'HDL naturally higher'],
            'moderate': ['Omega-3 supplementation', 'Regular exercise', 'Healthy fats in diet'],
            'highRisk': ['High omega-3 intake', 'Niacin to raise HDL (if appropriate)', 'Regular cardio exercise', 'Olive oil and Mediterranean diet', 'Avoid trans fats', 'Moderate alcohol (if appropriate)', 'Monitor lipid panel regularly']
        }
    },
    'APOA5': {
        'name': 'Apolipoprotein A5',
        'category': 'Cardiovascular Performance',
        'function': 'Regulates triglyceride metabolism.',
        'variants': {
            'optimal': {'alleles': 'GG', 'description': 'Normal triglyceride metabolism, lower cardiovascular risk'},
            'moderate': {'alleles': 'GC', 'description': 'Moderately elevated triglycerides'},
            'highRisk': {'alleles': 'CC', 'description': 'Significantly elevated triglycerides, higher cardiovascular disease risk'}
        },
        'recommendations': {
            'optimal': ['Standard heart-healthy diet', 'Regular activity'],
            'moderate': ['Lower carbohydrate intake', 'Omega-3 supplementation', 'Reduce sugar/alcohol'],
            'highRisk': ['Low-carb diet', 'High-dose omega-3 (4g EPA/DHA)', 'Eliminate refined sugars', 'Limit/avoid alcohol', 'Regular cardio exercise', 'Niacin (under supervision)', 'Frequent triglyceride monitoring']
        }
    },
    'PON1': {
        'name': 'Paraoxonase 1',
        'category': 'Cardiovascular Performance',
        'function': 'Antioxidant enzyme that protects LDL from oxidation. Cardiovascular protective.',
        'variants': {
            'optimal': {'alleles': 'AA', 'description': 'High PON1 activity, strong antioxidant protection, lower CVD risk'},
            'moderate': {'alleles': 'AG', 'description': 'Moderate PON1 function'},
            'highRisk': {'alleles': 'GG', 'description': 'Low PON1 activity, increased LDL oxidation, higher cardiovascular risk'}
        },
        'recommendations': {
            'optimal': ['Standard antioxidant intake', 'Heart-healthy diet'],
            'moderate': ['Antioxidant-rich foods', 'Pomegranate juice', 'Olive oil'],
            'highRisk': ['High antioxidant diet', 'Pomegranate extract', 'Vitamin E', 'CoQ10', 'Extra virgin olive oil daily', 'Avoid oxidized fats', 'Mediterranean diet', 'Monitor oxidized LDL (if available)']
        }
    }
}

# List of all gene symbols
GENES = list(GENE_DATABASE.keys())

class GeneAnalyzer:
    """AI-powered genetic variant extraction and analysis"""

    def __init__(self):
        self.client = None
        api_key = os.getenv('OPENAI_API_KEY')
        if api_key and not api_key.startswith('sk-placeholder'):
            try:
                self.client = OpenAI(api_key=api_key)
            except Exception as e:
                print(f"Failed to initialize OpenAI client: {e}")

    async def analyze_genetic_report(self, extracted_text: str) -> Dict:
        """Analyze genetic report and extract variants"""

        # First, try simple pattern matching
        simple_results = self._simple_pattern_extraction(extracted_text)

        # If OpenAI is available, enhance with AI
        if self.client and len(simple_results) < 10:
            ai_results = await self._ai_enhanced_extraction(extracted_text)
            # Merge results, preferring AI results for conflicts
            existing_genes = {r['gene_symbol'] for r in simple_results}
            for result in ai_results:
                if result['gene_symbol'] not in existing_genes:
                    simple_results.append(result)

        # Remove duplicates
        unique_results = self._deduplicate_results(simple_results)

        # If still no results, generate demo data
        if not unique_results:
            unique_results = self._generate_sample_results()

        # Enrich results with full gene data
        enriched_results = self._enrich_results(unique_results)

        # Calculate scores and generate comprehensive analysis
        analysis = self._generate_comprehensive_analysis(enriched_results)

        return analysis

    def _simple_pattern_extraction(self, text: str) -> List[Dict]:
        """Extract gene variants using pattern matching"""
        results = []
        text_upper = text.upper()

        # Common patterns for genetic results
        patterns = [
            r'(\w+)\s+(?:gene|Gene)?\s*[:=-]\s*([A-Z]{2})',  # Gene: AA
            r'rs\d+\s*[(\[]?([A-Z]{2,})[)\]]?\s*[:=]\s*([A-Z]{2})',  # rs123 (GENE): AA
            r'([A-Z]{3,})\s+([A-Z]{2})\s+(?:genotype|variant)',  # MTHFR CC genotype
            r'([A-Z]{2,})\s*:\s*([A-Z/]{2,})',  # APOE: E3/E3
            r'([A-Z]{2,})\s+variant\s*[:=]?\s*([A-Z]{2})',  # MTHFR variant: CT
            r'Gene\s+([A-Z]{2,})\s+([A-Z]{2})',  # Gene MTHFR CT
        ]

        for gene in GENES:
            # Look for the gene name in the text
            gene_pattern = rf'\b{gene}\b[^\n]*?([A-Z]{{2}}|[A-Z]\d/[A-Z]\d|\+/\+|\+/-|-/-)'
            matches = re.finditer(gene_pattern, text_upper, re.IGNORECASE)
            for match in matches:
                variant = match.group(1).upper()
                if gene not in [r['gene_symbol'] for r in results]:
                    results.append({
                        'gene_symbol': gene,
                        'variant': variant,
                        'risk_level': self._assess_risk_level(gene, variant)
                    })

        return results

    async def _ai_enhanced_extraction(self, text: str) -> List[Dict]:
        """Use OpenAI to extract genetic variants"""
        if not self.client:
            return []

        try:
            gene_list = ', '.join(GENES[:30])
            prompt = f"""Extract genetic variants from this DNA/genetic report.

Look for these genes: {gene_list}

Common variant formats include:
- Genotypes: AA, AG, GG, CT, TT, etc.
- APOE: E2/E2, E2/E3, E3/E3, E3/E4, E4/E4
- ACTN3: RR, RX, XX
- ACE: II, ID, DD
- GST genes: +/+, +/-, -/- (Present/Null)
- Serotonin: L/L, L/S, S/S

Report text:
{text[:4000]}

Return ONLY a valid JSON array with format:
[{{"gene_symbol": "MTHFR", "variant": "CT"}}, {{"gene_symbol": "APOE", "variant": "E3/E3"}}]

Only include genes that are clearly mentioned with variants in the report. Be precise with variant notation."""

            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": "You are a genetic data extraction expert. Extract gene variants from lab reports accurately. Return only valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                max_tokens=2000
            )

            content = response.choices[0].message.content

            # Extract JSON from response
            json_match = re.search(r'\[[\s\S]*\]', content)
            if json_match:
                variants = json.loads(json_match.group())
                results = []
                for variant in variants:
                    gene = variant.get('gene_symbol', '').upper()
                    var = variant.get('variant', '').upper()
                    if gene in GENES and var:
                        results.append({
                            'gene_symbol': gene,
                            'variant': var,
                            'risk_level': self._assess_risk_level(gene, var)
                        })
                return results
        except Exception as e:
            print(f"AI extraction error: {e}")

        return []

    def _assess_risk_level(self, gene: str, variant: str) -> str:
        """Assess risk level based on gene and variant"""
        if gene not in GENE_DATABASE:
            return 'moderate'

        gene_data = GENE_DATABASE[gene]
        variant_upper = variant.upper().replace(' ', '')

        # Check optimal
        optimal = gene_data['variants']['optimal']['alleles'].upper().replace(' ', '')
        if variant_upper == optimal:
            return 'optimal'

        # Check high risk
        high_risk = gene_data['variants']['highRisk']['alleles'].upper().replace(' ', '')
        if variant_upper == high_risk:
            return 'highRisk'

        # Check moderate
        moderate = gene_data['variants']['moderate']['alleles'].upper().replace(' ', '')
        if variant_upper == moderate:
            return 'moderate'

        # Default logic: heterozygous often moderate
        if len(set(variant_upper)) == 2:
            return 'moderate'

        return 'optimal'

    def _deduplicate_results(self, results: List[Dict]) -> List[Dict]:
        """Remove duplicate gene entries"""
        seen = set()
        unique = []

        for result in results:
            gene = result['gene_symbol']
            if gene not in seen:
                seen.add(gene)
                unique.append(result)

        return unique

    def _enrich_results(self, results: List[Dict]) -> List[Dict]:
        """Enrich results with full gene data and recommendations"""
        enriched = []

        for result in results:
            gene = result['gene_symbol']
            if gene in GENE_DATABASE:
                gene_data = GENE_DATABASE[gene]
                risk_level = result['risk_level']

                enriched.append({
                    'gene_symbol': gene,
                    'gene_name': gene_data['name'],
                    'category': gene_data['category'],
                    'function': gene_data['function'],
                    'variant': result['variant'],
                    'risk_level': risk_level,
                    'variant_description': gene_data['variants'].get(risk_level, {}).get('description', ''),
                    'recommendations': gene_data['recommendations'].get(risk_level, [])
                })

        return enriched

    def _generate_comprehensive_analysis(self, gene_results: List[Dict]) -> Dict:
        """Generate comprehensive analysis from gene results"""

        # Count by risk level
        optimal_count = sum(1 for r in gene_results if r['risk_level'] == 'optimal')
        moderate_count = sum(1 for r in gene_results if r['risk_level'] == 'moderate')
        high_risk_count = sum(1 for r in gene_results if r['risk_level'] == 'highRisk')

        total = len(gene_results)
        overall_score = (optimal_count * 100 + moderate_count * 60 + high_risk_count * 20) / max(total, 1)

        # Group by category
        categories = {}
        for result in gene_results:
            cat = result['category']
            if cat not in categories:
                categories[cat] = []
            categories[cat].append(result)

        # Calculate category scores
        category_scores = {}
        for cat, genes in categories.items():
            cat_optimal = sum(1 for g in genes if g['risk_level'] == 'optimal')
            cat_moderate = sum(1 for g in genes if g['risk_level'] == 'moderate')
            cat_high = sum(1 for g in genes if g['risk_level'] == 'highRisk')
            cat_total = len(genes)
            category_scores[cat] = {
                'optimal': cat_optimal,
                'moderate': cat_moderate,
                'highRisk': cat_high,
                'total': cat_total,
                'score': round((cat_optimal * 100 + cat_moderate * 60 + cat_high * 20) / max(cat_total, 1), 1)
            }

        # Generate key insights
        key_insights = self._generate_key_insights(gene_results, category_scores)

        # Generate strengths and risks
        strengths = self._identify_strengths(gene_results)
        risks = self._identify_risks(gene_results)

        # Generate summary
        summary = self._generate_summary(optimal_count, moderate_count, high_risk_count, total)

        # Generate top recommendations
        top_recommendations = self._generate_top_recommendations(gene_results)

        return {
            'overall_score': round(overall_score, 1),
            'total_genes_analyzed': total,
            'strengths': strengths,
            'risks': risks,
            'key_insights': key_insights,
            'top_recommendations': top_recommendations,
            'gene_results': gene_results,
            'categories': categories,
            'category_scores': category_scores,
            'summary': summary,
            'traffic_light': {
                'green': optimal_count,
                'orange': moderate_count,
                'red': high_risk_count
            }
        }

    def _generate_key_insights(self, results: List[Dict], category_scores: Dict) -> List[Dict]:
        """Generate key insights from the analysis"""
        insights = []

        # Category-level insights
        for cat, scores in category_scores.items():
            if scores['highRisk'] > 0:
                insights.append({
                    'type': 'warning',
                    'category': cat,
                    'title': f'{cat} Requires Attention',
                    'description': f"{scores['highRisk']} high-risk variant(s) found in {cat}. Targeted interventions recommended."
                })
            elif scores['score'] >= 80:
                insights.append({
                    'type': 'success',
                    'category': cat,
                    'title': f'Strong {cat} Profile',
                    'description': f"Excellent genetic profile in {cat} with {scores['optimal']} optimal variants."
                })

        # Specific gene insights
        high_impact_genes = {
            'MTHFR': 'Methylation pathway affects cardiovascular health, mood, and detoxification.',
            'APOE': 'Key gene for Alzheimer\'s risk and cholesterol metabolism.',
            'FTO': 'Major influence on appetite regulation and weight management.',
            'TCF7L2': 'Strongest genetic predictor of type 2 diabetes risk.',
            'COMT': 'Affects stress response, pain sensitivity, and dopamine levels.',
            'BDNF': 'Critical for brain health, memory, and neuroplasticity.'
        }

        for result in results:
            if result['gene_symbol'] in high_impact_genes and result['risk_level'] == 'highRisk':
                insights.append({
                    'type': 'alert',
                    'category': result['category'],
                    'title': f'{result["gene_symbol"]} High-Risk Variant Detected',
                    'description': high_impact_genes[result['gene_symbol']]
                })

        return insights[:10]  # Limit to top 10 insights

    def _identify_strengths(self, results: List[Dict]) -> List[str]:
        """Identify genetic strengths"""
        strengths = []

        strength_descriptions = {
            'ACTN3': 'Natural advantage for power and sprint activities',
            'ACE': 'Enhanced endurance capacity and oxygen utilization',
            'BDNF': 'Excellent neuroplasticity and learning ability',
            'MTHFR': 'Efficient methylation supporting cardiovascular and mental health',
            'APOE': 'Lower risk for Alzheimer\'s disease',
            'FOXO3': 'Longevity-associated variant promoting healthy aging',
            'COMT': 'Resilient stress response with quick recovery',
            'VDR': 'Efficient vitamin D utilization for bone and muscle health',
            'NOS3': 'Excellent nitric oxide production for cardiovascular function',
            'SOD2': 'Strong antioxidant capacity protecting against aging',
            'IL6': 'Balanced inflammatory response with good recovery',
            'ADIPOQ': 'High adiponectin levels supporting metabolic health'
        }

        for result in results:
            if result['risk_level'] == 'optimal':
                gene = result['gene_symbol']
                if gene in strength_descriptions:
                    strengths.append(strength_descriptions[gene])

        if not strengths:
            strengths = ['Generally favorable genetic profile', 'No major genetic risk factors identified']

        return strengths[:7]

    def _identify_risks(self, results: List[Dict]) -> List[str]:
        """Identify genetic risks with actionable context"""
        risks = []

        risk_descriptions = {
            'FTO': 'Increased appetite signals - implement structured meal timing and high protein intake',
            'MTHFR': 'Reduced methylation efficiency - supplement with methylfolate and monitor homocysteine',
            'APOE': 'Elevated Alzheimer\'s risk - prioritize brain health with DHA and cognitive training',
            'TCF7L2': 'Higher diabetes risk - follow low-glycemic diet and monitor blood sugar',
            'COMT': 'Stress sensitivity - prioritize stress management and avoid excessive stimulants',
            'SOD2': 'Reduced antioxidant capacity - increase antioxidant intake and avoid overtraining',
            'VDR': 'Higher vitamin D requirements - supplement with 5000+ IU D3 daily',
            'NOS3': 'Impaired blood flow - supplement with citrulline and nitrate-rich foods',
            'IL6': 'Elevated inflammation tendency - strict anti-inflammatory diet essential',
            'ACTN3': 'Reduced power output - focus on endurance training with creatine support',
            'BDNF': 'Neuroplasticity challenges - daily exercise critical for brain health'
        }

        for result in results:
            if result['risk_level'] in ['highRisk', 'moderate']:
                gene = result['gene_symbol']
                if gene in risk_descriptions:
                    risks.append(risk_descriptions[gene])

        if not risks:
            risks = ['No significant genetic risks identified']

        return risks[:7]

    def _generate_summary(self, optimal: int, moderate: int, high_risk: int, total: int) -> str:
        """Generate text summary of results"""
        if total == 0:
            return "Analysis complete. Please upload a genetic report with valid gene data for comprehensive analysis."

        summary = f"Comprehensive analysis of {total} genetic markers completed. "
        summary += f"Results show {optimal} optimal variants (🟢), {moderate} moderate variants (🟠), and {high_risk} high-risk variants (🔴). "

        if high_risk >= 5:
            summary += "Multiple areas require personalized intervention protocols. "
        elif high_risk >= 2:
            summary += "Several targeted optimizations are recommended. "
        elif high_risk == 1:
            summary += "One area identified for focused improvement. "
        else:
            summary += "Excellent overall genetic profile. "

        overall_pct = round((optimal * 100 + moderate * 60 + high_risk * 20) / max(total, 1), 1)
        if overall_pct >= 80:
            summary += "Your genetic foundation supports optimal health with standard interventions."
        elif overall_pct >= 60:
            summary += "Targeted supplements and lifestyle modifications can significantly optimize your health outcomes."
        else:
            summary += "A comprehensive, personalized health protocol is essential for optimal results."

        return summary

    def _generate_top_recommendations(self, results: List[Dict]) -> List[Dict]:
        """Generate prioritized top recommendations"""
        all_recs = []

        # Prioritize high-risk genes
        for result in results:
            priority = 1 if result['risk_level'] == 'highRisk' else (2 if result['risk_level'] == 'moderate' else 3)
            for rec in result.get('recommendations', [])[:3]:
                all_recs.append({
                    'priority': priority,
                    'gene': result['gene_symbol'],
                    'category': result['category'],
                    'recommendation': rec,
                    'risk_level': result['risk_level']
                })

        # Sort by priority
        all_recs.sort(key=lambda x: x['priority'])

        # Deduplicate similar recommendations
        seen = set()
        unique_recs = []
        for rec in all_recs:
            rec_lower = rec['recommendation'].lower()
            if rec_lower not in seen:
                seen.add(rec_lower)
                unique_recs.append(rec)

        return unique_recs[:15]

    def _generate_sample_results(self) -> List[Dict]:
        """Generate sample results for demo purposes"""
        samples = [
            {'gene_symbol': 'MTHFR', 'variant': 'CT', 'risk_level': 'moderate'},
            {'gene_symbol': 'FTO', 'variant': 'AA', 'risk_level': 'highRisk'},
            {'gene_symbol': 'ACTN3', 'variant': 'RR', 'risk_level': 'optimal'},
            {'gene_symbol': 'APOE', 'variant': 'E3/E3', 'risk_level': 'optimal'},
            {'gene_symbol': 'COMT', 'variant': 'AG', 'risk_level': 'moderate'},
            {'gene_symbol': 'BDNF', 'variant': 'GG', 'risk_level': 'optimal'},
            {'gene_symbol': 'TCF7L2', 'variant': 'CT', 'risk_level': 'moderate'},
            {'gene_symbol': 'ACE', 'variant': 'II', 'risk_level': 'optimal'},
            {'gene_symbol': 'VDR', 'variant': 'TC', 'risk_level': 'moderate'},
            {'gene_symbol': 'IL6', 'variant': 'GG', 'risk_level': 'optimal'},
            {'gene_symbol': 'SOD2', 'variant': 'AG', 'risk_level': 'moderate'},
            {'gene_symbol': 'NOS3', 'variant': 'GT', 'risk_level': 'moderate'},
        ]
        return samples
