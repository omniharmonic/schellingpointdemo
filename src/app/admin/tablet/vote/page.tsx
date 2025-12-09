'use client'

import * as React from 'react'
import {
  Radio,
  Check,
  AlertCircle,
  Star,
  MapPin,
  Users,
  Smartphone,
  TrendingUp,
  Award,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ScanState = 'ready' | 'scanning' | 'voting' | 'success' | 'error' | 'already_voted'

interface VoteRecord {
  id: string
  userName: string
  cardId: string
  votes: number
  credits: number
  timestamp: string
}

export default function TabletVotePage() {
  const [scanState, setScanState] = React.useState<ScanState>('ready')
  const [currentUser, setCurrentUser] = React.useState<string>('')
  const [currentCardId, setCurrentCardId] = React.useState<string>('')
  const [voteCount, setVoteCount] = React.useState<number>(0)
  const [votes, setVotes] = React.useState<VoteRecord[]>([])
  const [errorMessage, setErrorMessage] = React.useState<string>('')

  // Mock session data
  const session = {
    title: 'Decentralized Identity Solutions',
    venue: 'Main Hall',
    host: 'Alice Chen',
    totalVotes: votes.reduce((sum, v) => sum + v.votes, 0),
    totalVoters: votes.length,
  }

  const handleScan = async () => {
    setScanState('scanning')
    setErrorMessage('')
    setVoteCount(0)

    // Simulate NFC scan
    setTimeout(() => {
      const mockNames = ['Alice Chen', 'Bob Martinez', 'Carol Zhang', 'David Kim', 'Emma Wilson']
      const randomName = mockNames[Math.floor(Math.random() * mockNames.length)]
      const mockCardId = `BURNER-${Math.random().toString(36).substring(2, 10).toUpperCase()}`

      // Check if already voted
      const alreadyVoted = votes.some((record) => record.cardId === mockCardId)

      if (alreadyVoted) {
        setCurrentUser(randomName)
        setCurrentCardId(mockCardId)
        setScanState('already_voted')
        setErrorMessage('You have already voted on this session.')
        setTimeout(() => setScanState('ready'), 3000)
      } else {
        setCurrentUser(randomName)
        setCurrentCardId(mockCardId)
        setScanState('voting')
      }
    }, 1500)
  }

  const handleTap = () => {
    setVoteCount((prev) => prev + 1)
  }

  const handleVoteSubmit = () => {
    if (voteCount === 0) return

    const credits = voteCount * voteCount // Quadratic cost

    const newVote: VoteRecord = {
      id: Math.random().toString(),
      userName: currentUser,
      cardId: currentCardId,
      votes: voteCount,
      credits: credits,
      timestamp: new Date().toLocaleTimeString(),
    }

    setVotes((prev) => [newVote, ...prev])
    setScanState('success')

    // Reset after 3 seconds
    setTimeout(() => {
      setScanState('ready')
      setCurrentUser('')
      setCurrentCardId('')
      setVoteCount(0)
    }, 3000)
  }

  const averageVotes = votes.length > 0
    ? (votes.reduce((sum, v) => sum + v.votes, 0) / votes.length).toFixed(1)
    : '0'

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="default">Post-Session Voting</Badge>
                <Badge variant="secondary">
                  <Star className="h-3 w-3 mr-1" />
                  Value Signal
                </Badge>
              </div>
              <h1 className="text-3xl font-bold mb-2">{session.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {session.venue}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Host: {session.host}
                </div>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div>
                <div className="text-4xl font-bold">{session.totalVotes}</div>
                <div className="text-sm text-muted-foreground">total votes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{averageVotes}</div>
                <div className="text-xs text-muted-foreground">avg per voter</div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Scan & Vote Area */}
          <Card className="p-8">
            <div className="text-center space-y-6">
              {/* Ready State */}
              {scanState === 'ready' && (
                <>
                  <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-muted relative">
                    <Smartphone className="h-20 w-20 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Rate This Session</h2>
                    <p className="text-muted-foreground">
                      Tap your burner card to allocate value votes
                    </p>
                  </div>
                  <Button onClick={handleScan} size="lg" className="w-full">
                    <Radio className="h-5 w-5 mr-2" />
                    Scan Card to Vote
                  </Button>
                </>
              )}

              {/* Scanning State */}
              {scanState === 'scanning' && (
                <>
                  <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-primary/10 relative">
                    <Smartphone className="h-20 w-20 text-primary" />
                    <div className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent animate-spin" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Scanning...</h2>
                    <p className="text-muted-foreground">Hold your card steady</p>
                  </div>
                </>
              )}

              {/* Voting State */}
              {scanState === 'voting' && (
                <>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Welcome, {currentUser}!</h2>
                    <p className="text-muted-foreground mb-4">
                      Tap the button to add votes
                    </p>
                  </div>

                  {/* Vote Counter Display */}
                  <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-primary mb-2">
                        {voteCount}
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">
                        {voteCount === 1 ? 'Vote' : 'Votes'}
                      </div>
                      <div className="text-2xl font-bold">
                        {voteCount * voteCount} Credits
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Quadratic cost: votes² = credits
                      </div>
                    </div>
                  </div>

                  {/* Tap Button */}
                  <button
                    onClick={handleTap}
                    className="w-full aspect-square max-h-64 rounded-2xl border-4 border-primary bg-primary/10 hover:bg-primary/20 active:bg-primary/30 transition-all flex items-center justify-center text-primary font-bold text-3xl shadow-lg hover:shadow-xl active:scale-95"
                  >
                    TAP TO VOTE
                  </button>

                  <div className="space-y-2">
                    <Button
                      onClick={handleVoteSubmit}
                      disabled={voteCount === 0}
                      size="lg"
                      className="w-full"
                    >
                      <Award className="h-5 w-5 mr-2" />
                      Submit {voteCount} Vote{voteCount !== 1 ? 's' : ''} ({voteCount * voteCount} Credits)
                    </Button>

                    <Button
                      onClick={() => setScanState('ready')}
                      variant="ghost"
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}

              {/* Success State */}
              {scanState === 'success' && (
                <>
                  <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-success/10">
                    <Check className="h-20 w-20 text-success" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Vote Recorded!</h2>
                    <p className="text-success">Thank you for your feedback, {currentUser}</p>
                    <p className="text-muted-foreground mt-2">
                      You allocated <strong>{voteCount} votes</strong> ({voteCount * voteCount} credits) to this session
                    </p>
                  </div>
                </>
              )}

              {/* Already Voted State */}
              {scanState === 'already_voted' && (
                <>
                  <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-amber-500/10">
                    <AlertCircle className="h-20 w-20 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Already Voted</h2>
                    <p className="text-muted-foreground">{currentUser}</p>
                    <p className="text-sm text-amber-600 mt-2">{errorMessage}</p>
                  </div>
                </>
              )}

              {/* Error State */}
              {scanState === 'error' && (
                <>
                  <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-destructive/10">
                    <AlertCircle className="h-20 w-20 text-destructive" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Error</h2>
                    <p className="text-destructive">{errorMessage}</p>
                  </div>
                  <Button onClick={() => setScanState('ready')} variant="outline" className="w-full">
                    Try Again
                  </Button>
                </>
              )}
            </div>
          </Card>

          {/* Recent Votes */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Votes</h3>
              <Badge variant="secondary">
                <TrendingUp className="h-3 w-3 mr-1" />
                {votes.length} voters
              </Badge>
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {votes.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Star className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No votes yet</p>
                  <p className="text-sm">Votes will appear here as attendees rate the session</p>
                </div>
              ) : (
                votes.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Star className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{record.userName}</div>
                        <div className="text-xs text-muted-foreground">
                          {record.timestamp} • {record.credits} credits
                        </div>
                      </div>
                    </div>
                    <Badge variant="default" className="text-lg font-bold px-3">
                      {record.votes}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="p-4 bg-muted/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium mb-1">Post-Session Voting Instructions</p>
              <p className="text-muted-foreground">
                After the session ends, attendees can use this tablet to rate how valuable the
                session was to them. Votes are weighted using quadratic voting principles - each
                person can allocate between 1-21 votes. Place this tablet near the exit for easy
                access as people leave.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
