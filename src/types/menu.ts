import { Recipe } from './recipe'

export type Menu = {
  id: string
  recipeId: string | null
  date: Date
  memo: string | null
  createdAt: Date
  recipe: Recipe | null
}

export type MenuFormData = {
  recipeId?: string
  date: Date
  memo?: string
}
