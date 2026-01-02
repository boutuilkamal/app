import { PrismaClient, RiskLevel } from '@prisma/client';
import { GENETIC_DATA } from '../../data/genes/genetic-data';
import { BIOMARKER_DATA } from '../../data/biomarkers/biomarker-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Seed Gene Definitions
  console.log('📊 Seeding genetic data (54 genes)...');
  for (const gene of GENETIC_DATA) {
    await prisma.geneDefinition.upsert({
      where: { symbol: gene.symbol },
      update: {},
      create: {
        symbol: gene.symbol,
        name: gene.name,
        category: gene.category,
        function: gene.function,
        optimalVariant: gene.variants.optimal.alleles,
        moderateVariant: gene.variants.moderate.alleles,
        highRiskVariant: gene.variants.highRisk.alleles,
        optimalDesc: gene.variants.optimal.description,
        moderateDesc: gene.variants.moderate.description,
        highRiskDesc: gene.variants.highRisk.description,
        recommendations: {
          optimal: gene.recommendations.optimal,
          moderate: gene.recommendations.moderate,
          highRisk: gene.recommendations.highRisk,
        },
        relatedMarkers: gene.relatedMarkers,
      },
    });
  }
  console.log(`✅ Seeded ${GENETIC_DATA.length} gene definitions`);

  // Seed Biomarker Definitions
  console.log('📊 Seeding biomarker data (40 biomarkers)...');
  for (const biomarker of BIOMARKER_DATA) {
    await prisma.biomarkerDefinition.upsert({
      where: { name: biomarker.name },
      update: {},
      create: {
        name: biomarker.name,
        shortName: biomarker.shortName,
        category: biomarker.category,
        unit: biomarker.unit,
        function: biomarker.function,
        optimalMin: biomarker.optimal.min,
        optimalMax: biomarker.optimal.max,
        moderateMin: biomarker.moderate?.min,
        moderateMax: biomarker.moderate?.max,
        criticalMin: biomarker.critical?.min,
        criticalMax: biomarker.critical?.max,
        interventions: {
          optimal: biomarker.interventions.optimal,
          moderate: biomarker.interventions.moderate,
          critical: biomarker.interventions.critical,
        },
        relatedGenes: biomarker.relatedGenes,
      },
    });
  }
  console.log(`✅ Seeded ${BIOMARKER_DATA.length} biomarker definitions`);

  // Seed Exercise Library (sample data)
  console.log('💪 Seeding exercise library...');
  const exercises = [
    {
      name: 'Barbell Back Squat',
      description: 'Compound lower body exercise targeting quads, glutes, and hamstrings',
      category: 'Strength',
      muscleGroup: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
      equipment: ['Barbell', 'Squat Rack'],
      difficulty: 'Intermediate',
      instructions: [
        'Place barbell on upper back',
        'Feet shoulder-width apart',
        'Descend by bending knees and hips',
        'Keep chest up and core tight',
        'Drive through heels to stand',
      ],
      tags: ['compound', 'lower-body', 'strength'],
    },
    {
      name: 'Bench Press',
      description: 'Primary chest exercise',
      category: 'Strength',
      muscleGroup: ['Chest', 'Triceps', 'Shoulders'],
      equipment: ['Barbell', 'Bench'],
      difficulty: 'Beginner',
      instructions: [
        'Lie on bench with feet flat',
        'Grip barbell slightly wider than shoulders',
        'Lower bar to chest',
        'Press up to starting position',
      ],
      tags: ['compound', 'upper-body', 'push'],
    },
    {
      name: 'Deadlift',
      description: 'Full body compound exercise',
      category: 'Strength',
      muscleGroup: ['Back', 'Glutes', 'Hamstrings', 'Core'],
      equipment: ['Barbell'],
      difficulty: 'Advanced',
      instructions: [
        'Stand with feet hip-width',
        'Grip barbell outside legs',
        'Keep back straight',
        'Drive through heels to lift',
        'Lower with control',
      ],
      tags: ['compound', 'full-body', 'strength'],
    },
  ];

  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { name: exercise.name },
      update: {},
      create: exercise,
    });
  }
  console.log(`✅ Seeded ${exercises.length} exercises`);

  // Seed Recipe Library (sample data)
  console.log('🍽️ Seeding recipe library...');
  const recipes = [
    {
      name: 'Grilled Salmon with Vegetables',
      description: 'High-protein, omega-3 rich meal',
      category: 'Main Course',
      dietTags: ['Keto', 'Paleo', 'Low-Carb', 'Anti-Inflammatory'],
      functionTags: ['Heart Health', 'Brain Health', 'Anti-Inflammatory'],
      prepTimeMinutes: 15,
      cookTimeMinutes: 20,
      servings: 2,
      calories: 450,
      proteinGrams: 40,
      carbsGrams: 15,
      fatGrams: 28,
      fiberGrams: 6,
      ingredients: [
        { item: 'Salmon fillet', amount: '2', unit: 'pieces' },
        { item: 'Olive oil', amount: '2', unit: 'tbsp' },
        { item: 'Broccoli', amount: '1', unit: 'cup' },
        { item: 'Bell peppers', amount: '1', unit: 'cup' },
        { item: 'Lemon', amount: '1', unit: 'whole' },
      ],
      instructions: [
        'Preheat grill to medium-high',
        'Season salmon with salt and pepper',
        'Grill salmon 5-6 minutes per side',
        'Sauté vegetables in olive oil',
        'Serve with lemon wedges',
      ],
    },
    {
      name: 'Quinoa Buddha Bowl',
      description: 'Plant-based protein bowl',
      category: 'Main Course',
      dietTags: ['Vegan', 'Vegetarian', 'Mediterranean'],
      functionTags: ['Energy', 'Gut Health', 'Anti-Inflammatory'],
      prepTimeMinutes: 10,
      cookTimeMinutes: 25,
      servings: 2,
      calories: 380,
      proteinGrams: 15,
      carbsGrams: 52,
      fatGrams: 14,
      fiberGrams: 12,
      ingredients: [
        { item: 'Quinoa', amount: '1', unit: 'cup' },
        { item: 'Chickpeas', amount: '1', unit: 'can' },
        { item: 'Kale', amount: '2', unit: 'cups' },
        { item: 'Avocado', amount: '1', unit: 'whole' },
        { item: 'Tahini', amount: '2', unit: 'tbsp' },
      ],
      instructions: [
        'Cook quinoa according to package',
        'Roast chickpeas at 400°F for 20 min',
        'Massage kale with olive oil',
        'Assemble bowl with all ingredients',
        'Drizzle with tahini dressing',
      ],
    },
  ];

  for (const recipe of recipes) {
    await prisma.recipe.upsert({
      where: { name: recipe.name },
      update: {},
      create: recipe,
    });
  }
  console.log(`✅ Seeded ${recipes.length} recipes`);

  // Seed Supplement Library (sample data)
  console.log('💊 Seeding supplement library...');
  const supplements = [
    {
      name: 'Omega-3 Fish Oil',
      description: 'Essential fatty acids EPA and DHA for heart and brain health',
      category: 'Essential Fatty Acids',
      mechanisms: [
        'Anti-inflammatory',
        'Supports cardiovascular health',
        'Enhances brain function',
        'Improves cell membrane integrity',
      ],
      benefits: [
        'Reduces inflammation',
        'Lowers triglycerides',
        'Supports cognitive function',
        'May reduce depression',
      ],
      sideEffects: ['Fishy aftertaste', 'Mild digestive upset', 'Blood thinning'],
      interactions: ['Blood thinners', 'Aspirin'],
      contraindications: ['Bleeding disorders', 'Upcoming surgery'],
      recommendedDosage: '2-4g EPA/DHA combined daily',
      forms: ['Softgels', 'Liquid', 'Triglyceride form', 'Ethyl ester'],
      relatedGenes: ['APOE', 'BDNF'],
      relatedBiomarkers: ['Triglycerides', 'CRP', 'Omega-3 Index'],
    },
    {
      name: 'Vitamin D3',
      description: 'Essential vitamin for bone health, immune function, and hormone production',
      category: 'Vitamins',
      mechanisms: [
        'Calcium absorption',
        'Immune modulation',
        'Gene expression regulation',
      ],
      benefits: [
        'Strong bones',
        'Immune support',
        'Mood enhancement',
        'Muscle function',
      ],
      sideEffects: ['Rare: hypercalcemia if excessive'],
      interactions: ['Calcium supplements'],
      contraindications: ['Hypercalcemia', 'Kidney disease'],
      recommendedDosage: '2000-5000 IU daily (based on levels)',
      forms: ['Softgels', 'Tablets', 'Liquid drops'],
      relatedGenes: ['VDR'],
      relatedBiomarkers: ['25-OH Vitamin D', 'Calcium', 'PTH'],
    },
    {
      name: 'Magnesium Glycinate',
      description: 'Highly bioavailable magnesium for muscle, nerve, and sleep support',
      category: 'Minerals',
      mechanisms: [
        'Cofactor for 300+ enzymes',
        'NMDA receptor regulation',
        'Muscle relaxation',
      ],
      benefits: [
        'Improved sleep quality',
        'Reduced muscle cramps',
        'Stress reduction',
        'Blood pressure support',
      ],
      sideEffects: ['Mild: digestive upset if dose too high'],
      interactions: ['Bisphosphonates', 'Antibiotics'],
      contraindications: ['Severe kidney disease'],
      recommendedDosage: '200-400mg elemental magnesium daily',
      forms: ['Capsules', 'Powder'],
      relatedGenes: ['COMT', 'VDR'],
      relatedBiomarkers: ['Magnesium (RBC)'],
    },
  ];

  for (const supplement of supplements) {
    await prisma.supplement.upsert({
      where: { name: supplement.name },
      update: {},
      create: supplement,
    });
  }
  console.log(`✅ Seeded ${supplements.length} supplements`);

  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
