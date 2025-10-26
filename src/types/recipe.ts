export type Recipe = {
  id: string
  name: string
  category: string
  ingredients: Ingredient[]
  steps: Step[]
  cookingTime?: number | null
  servings?: number | null
  imageUrl?: string | null
  tags?: string | null
  memo?: string | null
  createdAt: Date
  updatedAt: Date
}

export type Ingredient = {
  name: string
  quantity: string
}

export type Step = {
  order: number
  description: string
}

export type RecipeFormData = {
  name: string
  category: string
  ingredients: Ingredient[]
  steps: Step[]
  cookingTime?: number
  servings?: number
  imageUrl?: string
  tags?: string
  memo?: string
}

export const CATEGORIES = [
  '和食',
  '洋食',
  '中華',
  'その他',
] as const
