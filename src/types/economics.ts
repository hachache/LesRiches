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
  rsaSingleMonthly: EconomicReference;
  averageRentMonthly: EconomicReference;
  groceryBasket: EconomicReference;
  foodAidMeal: EconomicReference;
  popularCarPrice: EconomicReference;
  medianWealth: EconomicReference;
  averageWealth: EconomicReference;
  averageApartmentPrice: EconomicReference;
  averageHomePrice: EconomicReference;
};

export type Billionaire = {
  name: string;
  netWorthEUR: number;
  imageSrc: string;
  imageAlt: string;
  sourceLabel: string;
  sourceUrl?: string;
  lastUpdated: string;
};

export type CompareOptions = {
  amount: number;
  customMonthlyIncome?: number | null;
  careerYears?: number | null;
  savingsRate?: number | null;
  currentYear?: number;
};
