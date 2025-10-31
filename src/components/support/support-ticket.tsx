'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export function SupportTicket() {
  const { toast } = useToast()
  const [tickets, setTickets] = useState<any[]>([])
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
  })

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('/api/support/tickets')
        if (response.ok) {
          const data = await response.json()
          setTickets(data.tickets)
        }
      } catch (error) {
        // Handle error
      }
    }

    fetchTickets()
  }, [])

  const handleAddTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTicket),
      })

      if (response.ok) {
        toast({
          title: 'Support ticket submitted successfully',
        })
        // Refresh tickets
        const newTicketsResponse = await fetch('/api/support/tickets')
        if (newTicketsResponse.ok) {
          const data = await newTicketsResponse.json()
          setTickets(data.tickets)
        }
      } else {
        toast({
          title: 'Failed to submit support ticket',
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
        <CardTitle>Support Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          {tickets.map((ticket) => (
            <div key={ticket.id} className="mb-4">
              <p className="font-semibold">{ticket.subject}</p>
              <p>{ticket.description}</p>
              <p className="text-sm text-muted-foreground">
                Status: {ticket.status}
              </p>
            </div>
          ))}
        </div>
        <form onSubmit={handleAddTicket} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={newTicket.subject}
              onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your issue..."
              value={newTicket.description}
              onChange={(e) =>
                setNewTicket({ ...newTicket, description: e.target.value })
              }
            />
          </div>
          <Button type="submit">Submit Ticket</Button>
        </form>
      </CardContent>
    </Card>
  )
}
