'use client'

import { useFavorites } from '@/hooks/use-favorites'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function FavoriteButton({ resourceId }: { resourceId: string }) {
  const { favorites, addFavorite, removeFavorite } = useFavorites()
  const { toast } = useToast()
  const isFavorite = favorites.includes(resourceId)

  const handleToggleFavorite = async () => {
    try {
      const method = isFavorite ? 'DELETE' : 'POST'
      const response = await fetch(`/api/favorites`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resourceId }),
      })

      if (response.ok) {
        if (isFavorite) {
          removeFavorite(resourceId)
          toast({
            title: 'Removed from favorites',
          })
        } else {
          addFavorite(resourceId)
          toast({
            title: 'Added to favorites',
          })
        }
      } else {
        toast({
          title: 'Failed to update favorites',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'An error occurred',
        variant: 'destructive',
      })
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleToggleFavorite}>
      <Heart
        className={`h-6 w-6 ${
          isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'
        }`}
      />
    </Button>
  )
}
