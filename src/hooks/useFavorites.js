import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'beontrade_favorites'

/**
 * Hook de gestion des favoris via localStorage.
 * @returns {{favorites: string[], toggleFavorite: (id: string) => void, isFavorite: (id: string) => boolean}}
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState([])

  // Chargement initial depuis le localStorage
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setFavorites(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Erreur lors du chargement des favoris', error)
    }
  }, [])

  // Persistance des changements
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des favoris', error)
    }
  }, [favorites])

  const isFavorite = useCallback(
    (id) => favorites.includes(id),
    [favorites]
  )

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((fav) => fav !== id)
      }
      return [...prev, id]
    })
  }, [])

  return { favorites, toggleFavorite, isFavorite }
}
