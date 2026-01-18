// Enum definitions for the application
export enum UserRole {
  ADMIN = 'ADMIN',
  COACH = 'COACH',
  CLIENT = 'CLIENT',
}

export enum RiskLevel {
  OPTIMAL = 'OPTIMAL',
  MODERATE = 'MODERATE',
  HIGH_RISK = 'HIGH_RISK',
}

export enum ProgramType {
  STRENGTH = 'STRENGTH',
  HYPERTROPHY = 'HYPERTROPHY',
  ENDURANCE = 'ENDURANCE',
  WEIGHT_LOSS = 'WEIGHT_LOSS',
  GENERAL_FITNESS = 'GENERAL_FITNESS',
}

export enum DietType {
  BALANCED = 'BALANCED',
  LOW_CARB = 'LOW_CARB',
  KETO = 'KETO',
  PALEO = 'PALEO',
  VEGAN = 'VEGAN',
  VEGETARIAN = 'VEGETARIAN',
  MEDITERRANEAN = 'MEDITERRANEAN',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}
