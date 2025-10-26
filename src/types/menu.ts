import { Recipe } from './recipe'

export type Menu = {
  id: string
  recipeId: string
  date: Date
  createdAt: Date
  recipe: Recipe
}

export type MenuFormData = {
  recipeId: string
  date: Date
}
