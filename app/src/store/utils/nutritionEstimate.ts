const KCAL_PER_GRAM = 1.4;
const PROTEIN_PER_GRAM = 0.08;
const CARBS_PER_GRAM = 0.14;
const FAT_PER_GRAM = 0.05;

export const estimateNutrition = (grams: number) => {
  const portion = Math.max(grams, 1);
  return {
    calories: Math.round(portion * KCAL_PER_GRAM),
    protein: Number((portion * PROTEIN_PER_GRAM).toFixed(1)),
    carbs: Number((portion * CARBS_PER_GRAM).toFixed(1)),
    fat: Number((portion * FAT_PER_GRAM).toFixed(1)),
  };
};

export const toNumber = (value: string | number | null | undefined) => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};
