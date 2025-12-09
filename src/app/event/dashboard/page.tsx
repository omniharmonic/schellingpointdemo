'use client'

import * as React from 'react'
import {
  Users,
  Vote,
  Clock,
  TrendingUp,
  Award,
  Activity,
  BarChart3,
  PieChart,
  DollarSign,
  TrendingDown,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NetworkGraph } from '@/components/visualization/network-graph'

export default function EventDashboardPage() {
  // Mock data - in real app, this would come from API
  const eventStats = {
    totalParticipants: 156,
    activeVoters: 142,
    totalVotesCast: 1248,
    creditsSpent: 12840,
    totalCredits: 15600,
    sessionsProposed: 24,
    votingEndsIn: '2d 14h',
    totalBudget: 10000, // $10,000 total budget
  }

  const topSessions = [
    {
      id: 1,
      title: 'Decentralized Identity Solutions',
      votes: 89,
      credits: 1247,
      trend: '+12',
    },
    {
      id: 2,
      title: 'Quadratic Funding Deep Dive',
      votes: 76,
      credits: 1089,
      trend: '+8',
    },
    {
      id: 3,
      title: 'DAOs and Community Governance',
      votes: 68,
      credits: 956,
      trend: '+15',
    },
    {
      id: 4,
      title: 'Zero-Knowledge Proofs Workshop',
      votes: 54,
      credits: 823,
      trend: '+5',
    },
    {
      id: 5,
      title: 'Web3 UX Design Patterns',
      votes: 52,
      credits: 789,
      trend: '+10',
    },
  ]

  const creditsPercentage = Math.round(
    (eventStats.creditsSpent / eventStats.totalCredits) * 100
  )

  // Calculate quadratic funding distribution
  // Formula: Each session gets funding proportional to (sum of sqrt of individual contributions)²
  const budgetDistribution = topSessions.map((session) => {
    // Simulate individual contributions (in real app, would come from actual vote data)
    const avgContributionPerVoter = session.credits / session.votes
    const qfSum = Math.sqrt(avgContributionPerVoter) * session.votes
    return {
      ...session,
      qfScore: qfSum * qfSum, // Square of sum of square roots
    }
  })

  const totalQfScore = budgetDistribution.reduce((sum, s) => sum + s.qfScore, 0)
  const budgetResults = budgetDistribution.map((session) => ({
    ...session,
    estimatedBudget: Math.round((session.qfScore / totalQfScore) * eventStats.totalBudget),
    percentage: Math.round((session.qfScore / totalQfScore) * 100),
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Event Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Real-time insights and voting statistics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Participants
              </p>
              <p className="text-2xl font-bold mt-1">
                {eventStats.totalParticipants}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {eventStats.activeVoters} active voters
              </p>
            </div>
            <Users className="h-8 w-8 text-primary/70" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Votes
              </p>
              <p className="text-2xl font-bold mt-1">
                {eventStats.totalVotesCast.toLocaleString()}
              </p>
              <p className="text-xs text-success mt-1">
                ↑ {Math.round(eventStats.totalVotesCast / eventStats.activeVoters)}{' '}
                avg per voter
              </p>
            </div>
            <Vote className="h-8 w-8 text-primary/70" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Credits Used
              </p>
              <p className="text-2xl font-bold mt-1">{creditsPercentage}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                {eventStats.creditsSpent.toLocaleString()} /{' '}
                {eventStats.totalCredits.toLocaleString()}
              </p>
            </div>
            <Activity className="h-8 w-8 text-primary/70" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Time Remaining
              </p>
              <p className="text-2xl font-bold mt-1">{eventStats.votingEndsIn}</p>
              <p className="text-xs text-destructive mt-1">Voting closes soon</p>
            </div>
            <Clock className="h-8 w-8 text-primary/70" />
          </div>
        </Card>
      </div>

      {/* Top Sessions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Award className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Top Sessions</h2>
          </div>
          <Badge variant="secondary">Live Rankings</Badge>
        </div>
        <div className="space-y-3">
          {topSessions.map((session, index) => (
            <div
              key={session.id}
              className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{session.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span>{session.votes} votes</span>
                  <span>•</span>
                  <span>{session.credits.toLocaleString()} credits</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-success text-sm font-medium">
                <TrendingUp className="h-4 w-4" />
                {session.trend}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Anticipated Budget Distribution */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Anticipated Budget Distribution</h2>
          </div>
          <Badge variant="secondary">Based on Current Votes</Badge>
        </div>

        <div className="mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Total Budget Pool</div>
          <div className="text-3xl font-bold">${eventStats.totalBudget.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Distributed using quadratic funding formula
          </div>
        </div>

        <div className="space-y-3">
          {budgetResults.map((session, index) => (
            <div
              key={session.id}
              className="p-4 rounded-lg border bg-card hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs">
                      {index + 1}
                    </div>
                    <h3 className="font-medium text-sm truncate">{session.title}</h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{session.votes} votes</span>
                    <span>•</span>
                    <span>{session.credits} credits</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-success">
                    ${session.estimatedBudget.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {session.percentage}% of pool
                  </div>
                </div>
              </div>

              {/* Progress bar showing percentage of total budget */}
              <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-success/60 to-success rounded-full transition-all"
                  style={{ width: `${session.percentage * 3}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="text-sm space-y-2">
            <div className="font-medium mb-2">How Quadratic Funding Works:</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Unlike simple majority voting, quadratic funding rewards sessions with broad support.
              Each session receives funding proportional to the square of the sum of square roots
              of individual contributions. This means a session with 100 voters contributing 10
              credits each will receive more funding than a session with 10 voters contributing
              100 credits each.
            </p>
            <div className="flex items-start gap-2 mt-3 text-xs">
              <TrendingUp className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">
                This creates a more democratic allocation where community consensus matters more
                than large individual contributions.
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Network Graph Visualization */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Voting Network</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Interactive visualization of voting patterns showing relationships between voters and sessions.
          Colored clusters represent groups of voters with similar preferences.
        </p>
        <NetworkGraph width={800} height={600} />
      </Card>
    </div>
  )
}
