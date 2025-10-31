'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

export function Reviews({ resourceId }: { resourceId: string }) {
  const { toast } = useToast()
  const [reviews, setReviews] = useState<any[]>([])
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
  })

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/resources/${resourceId}/reviews`)
        if (response.ok) {
          const data = await response.json()
          setReviews(data.reviews)
        }
      } catch (error) {
        // Handle error
      }
    }

    fetchReviews()
  }, [resourceId])

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/resources/${resourceId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview),
      })

      if (response.ok) {
        toast({
          title: 'Review submitted successfully',
        })
        // Refresh reviews
        const newReviewsResponse = await fetch(`/api/resources/${resourceId}/reviews`)
        if (newReviewsResponse.ok) {
          const data = await newReviewsResponse.json()
          setReviews(data.reviews)
        }
      } else {
        toast({
          title: 'Failed to submit review',
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
    <Card>
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          {reviews.map((review) => (
            <div key={review.id} className="mb-4">
              <p className="font-semibold">{review.user.name}</p>
              <p>{review.comment}</p>
              <p className="text-sm text-muted-foreground">
                Rating: {review.rating}/5
              </p>
            </div>
          ))}
        </div>
        <form onSubmit={handleAddReview} className="mt-6">
          <Textarea
            placeholder="Write a review..."
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          />
          <Button type="submit" className="mt-4">
            Submit Review
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
