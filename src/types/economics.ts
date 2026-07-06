export type EconomicReference = {
  value: number;
  label: string;
  unit: string;
  source: string;
  sourceUrl?: string;
  lastUpdated: string;
  note?: string;
};

export type EconomicReferences = {
  smicNetMonthly: EconomicReference;
  medianNetSalaryMonthly: EconomicReference;
  classicNetMonthlyIncome: EconomicReference;
  defaultSavingsRate: EconomicReference;
  rsaSingleMonthly: EconomicReference;
  averageRentMonthly: EconomicReference;
  groceryBasket: EconomicReference;
  foodAidMeal: EconomicReference;
  annualBanquesAlimentairesMeals: EconomicReference;
  annualRestosDuCoeurMeals: EconomicReference;
  povertyThresholdMonthly: EconomicReference;
  educationCostPerStudentYear: EconomicReference;
  childFedOneYear: EconomicReference;
  schoolConstructionCost: EconomicReference;
  localHospitalConstructionCost: EconomicReference;
  globalHungerFundingNeedAnnual: EconomicReference;
  waterWellCost: EconomicReference;
  socialHousingUnitCost: EconomicReference;
  stateNetRevenueAnnual: EconomicReference;
  popularCarPrice: EconomicReference;
  medianWealth: EconomicReference;
  averageWealth: EconomicReference;
  averageApartmentPrice: EconomicReference;
  averageHomePrice: EconomicReference;
};

export type Billionaire = {
  slug: string;
  name: string;
  netWorthEUR: number;
  imageSrc: string;
  imageAlt: string;
  sourceLabel: string;
  sourceUrl?: string;
  annualGainEUR: number;
  annualGainLabel: string;
  annualGainSourceLabel: string;
  annualGainSourceUrl?: string;
  annualGainLastUpdated: string;
  annualGainNote: string;
  lastUpdated: string;
};

export type CompareOptions = {
  amount: number;
  customMonthlyIncome?: number | null;
  careerYears?: number | null;
  savingsRate?: number | null;
  currentYear?: number;
};

export type PersonalFortuneComparisonOptions = {
  salaryMonthly: number;
  savingsTotal: number;
  netWorthEUR: number;
  savingsRate?: number | null;
  careerYears?: number | null;
};

export type PersonalFortuneComparison = {
  fraction: number;
  percentage: number;
  salaryYears: number;
  careersAt20PercentSavings: number;
  medianWealthMultiplier: number;
  foodAidMeals: number;
  groceryBaskets: number;
};

export type ConcreteEquivalents = {
  smicYears: number;
  rsaMonths: number;
  rsaYears: number;
  povertyThresholdYears: number;
  foodAidMeals: number;
  groceryBaskets: number;
  educationStudentYears: number;
  childrenFedOneYear: number;
  schoolsBuilt: number;
  localHospitalsBuilt: number;
  globalHungerFundingShare: number;
  waterWells: number;
  socialHousingUnits: number;
  averageRentYears: number;
};

export type PublicScaleRatios = {
  stateNetRevenueShare: number;
  banquesAlimentairesYearsEquivalent: number;
  restosDuCoeurYearsEquivalent: number;
};

export type TaxScenario = {
  rate: number;
  baseAmount: number;
  baseLabel: string;
  amount: number;
  concrete: ConcreteEquivalents;
  publicScale: PublicScaleRatios;
};
