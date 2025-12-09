'use client'

import * as React from 'react'
import {
  User,
  MapPin,
  Briefcase,
  Twitter,
  Linkedin,
  Github,
  Globe,
  Mail,
  MessageCircle,
  Search,
  Filter,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Participant {
  id: number
  name: string
  avatar?: string
  bio: string
  location?: string
  role?: string
  interests: string[]
  socials: {
    twitter?: string
    linkedin?: string
    github?: string
    website?: string
    email?: string
  }
  stats: {
    sessionsProposed: number
    votesCast: number
    sessionsAttending: number
  }
}

export default function ParticipantsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedInterest, setSelectedInterest] = React.useState<string | null>(null)

  // Mock data - in real app, this would come from API
  const participants: Participant[] = [
    {
      id: 1,
      name: 'Alice Chen',
      avatar: '',
      bio: 'Product designer passionate about decentralized governance and community-driven decision making.',
      location: 'San Francisco, CA',
      role: 'Product Designer @ Consensus Labs',
      interests: ['DAOs', 'Governance', 'UX Design', 'Web3'],
      socials: {
        twitter: '@alicechen',
        linkedin: 'alicechen',
        github: 'alicechen',
        website: 'alicechen.design',
        email: 'alice@example.com',
      },
      stats: {
        sessionsProposed: 2,
        votesCast: 24,
        sessionsAttending: 8,
      },
    },
    {
      id: 2,
      name: 'Bob Martinez',
      avatar: '',
      bio: 'Smart contract developer and blockchain educator. Building tools for the next generation of decentralized apps.',
      location: 'Austin, TX',
      role: 'Blockchain Engineer @ Ethereum Foundation',
      interests: ['Smart Contracts', 'Solidity', 'DeFi', 'Security'],
      socials: {
        twitter: '@bobmartinez',
        github: 'bobdev',
        email: 'bob@example.com',
      },
      stats: {
        sessionsProposed: 3,
        votesCast: 18,
        sessionsAttending: 12,
      },
    },
    {
      id: 3,
      name: 'Carol Zhang',
      avatar: '',
      bio: 'Community organizer and DAO strategist. Helping communities coordinate and make better collective decisions.',
      location: 'New York, NY',
      role: 'Community Lead @ MetaGov',
      interests: ['Community Building', 'DAOs', 'Quadratic Voting', 'Coordination'],
      socials: {
        twitter: '@carolzhang',
        linkedin: 'carolzhang',
        website: 'carol.xyz',
      },
      stats: {
        sessionsProposed: 1,
        votesCast: 32,
        sessionsAttending: 15,
      },
    },
    {
      id: 4,
      name: 'David Kim',
      avatar: '',
      bio: 'Cryptoeconomics researcher focused on mechanism design and incentive alignment.',
      location: 'London, UK',
      role: 'Researcher @ BlockScience',
      interests: ['Mechanism Design', 'Game Theory', 'Token Economics', 'Governance'],
      socials: {
        twitter: '@davidkim',
        github: 'dkim-research',
        email: 'david@example.com',
      },
      stats: {
        sessionsProposed: 4,
        votesCast: 28,
        sessionsAttending: 10,
      },
    },
    {
      id: 5,
      name: 'Emma Wilson',
      avatar: '',
      bio: 'Full-stack developer building the future of decentralized social networks.',
      location: 'Berlin, Germany',
      role: 'Engineer @ Lens Protocol',
      interests: ['Social Networks', 'Privacy', 'Web3', 'Open Source'],
      socials: {
        github: 'emmawilson',
        twitter: '@emmawilson',
        website: 'emma.dev',
      },
      stats: {
        sessionsProposed: 2,
        votesCast: 21,
        sessionsAttending: 9,
      },
    },
    {
      id: 6,
      name: 'Frank Rodriguez',
      avatar: '',
      bio: 'Legal expert specializing in DAO governance and decentralized organizational structures.',
      location: 'Miami, FL',
      role: 'Legal Counsel @ a16z crypto',
      interests: ['Legal', 'Compliance', 'DAOs', 'Governance'],
      socials: {
        linkedin: 'frankrodriguez',
        twitter: '@frankrodriguez',
        email: 'frank@example.com',
      },
      stats: {
        sessionsProposed: 1,
        votesCast: 15,
        sessionsAttending: 7,
      },
    },
  ]

  // Get all unique interests for filter
  const allInterests = Array.from(
    new Set(participants.flatMap((p) => p.interests))
  ).sort()

  // Filter participants
  const filteredParticipants = participants.filter((participant) => {
    const matchesSearch =
      searchQuery === '' ||
      participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant.role?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesInterest =
      !selectedInterest || participant.interests.includes(selectedInterest)

    return matchesSearch && matchesInterest
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Participants</h1>
        <p className="text-muted-foreground mt-1">
          Connect with {participants.length} attendees at the event
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, role, or bio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedInterest === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedInterest(null)}
          >
            All
          </Button>
          {allInterests.slice(0, 6).map((interest) => (
            <Button
              key={interest}
              variant={selectedInterest === interest ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedInterest(interest)}
              className="whitespace-nowrap"
            >
              {interest}
            </Button>
          ))}
        </div>
      </div>

      {/* Participants Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredParticipants.map((participant) => (
          <Card key={participant.id} className="p-6 hover:shadow-lg transition-shadow">
            {/* Avatar and Name */}
            <div className="flex items-start gap-4 mb-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                {participant.avatar ? (
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg">{participant.name}</h3>
                {participant.role && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Briefcase className="h-3 w-3" />
                    <span className="truncate">{participant.role}</span>
                  </div>
                )}
                {participant.location && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <MapPin className="h-3 w-3" />
                    <span>{participant.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {participant.bio}
            </p>

            {/* Interests */}
            <div className="flex flex-wrap gap-1 mb-4">
              {participant.interests.slice(0, 4).map((interest) => (
                <Badge key={interest} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
              {participant.interests.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{participant.interests.length - 4}
                </Badge>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-center text-xs">
              <div className="p-2 bg-muted/50 rounded">
                <div className="font-bold">{participant.stats.sessionsProposed}</div>
                <div className="text-muted-foreground">Proposed</div>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <div className="font-bold">{participant.stats.votesCast}</div>
                <div className="text-muted-foreground">Votes</div>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <div className="font-bold">{participant.stats.sessionsAttending}</div>
                <div className="text-muted-foreground">Attending</div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 mb-4">
              {participant.socials.twitter && (
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Twitter className="h-4 w-4" />
                </Button>
              )}
              {participant.socials.linkedin && (
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Linkedin className="h-4 w-4" />
                </Button>
              )}
              {participant.socials.github && (
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Github className="h-4 w-4" />
                </Button>
              )}
              {participant.socials.website && (
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Globe className="h-4 w-4" />
                </Button>
              )}
              {participant.socials.email && (
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Mail className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <MessageCircle className="h-3 w-3 mr-1" />
                Message
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                View Profile
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredParticipants.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">No participants found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
