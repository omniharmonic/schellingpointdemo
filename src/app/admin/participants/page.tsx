'use client'

import * as React from 'react'
import {
  User,
  MapPin,
  Mail,
  Search,
  Filter,
  Download,
  UserPlus,
  MoreVertical,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Participant {
  id: number
  name: string
  email: string
  avatar?: string
  location?: string
  role?: string
  joinedDate: string
  status: 'active' | 'inactive' | 'banned'
  stats: {
    sessionsProposed: number
    votesCast: number
    creditsSpent: number
    sessionsAttending: number
    lastActive: string
  }
}

export default function AdminParticipantsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')

  // Mock data - in real app, this would come from API
  const participants: Participant[] = [
    {
      id: 1,
      name: 'Alice Chen',
      email: 'alice.chen@example.com',
      avatar: '',
      location: 'San Francisco, CA',
      role: 'Product Designer @ Consensus Labs',
      joinedDate: '2024-01-15',
      status: 'active',
      stats: {
        sessionsProposed: 2,
        votesCast: 24,
        creditsSpent: 67,
        sessionsAttending: 8,
        lastActive: '2 hours ago',
      },
    },
    {
      id: 2,
      name: 'Bob Martinez',
      email: 'bob.martinez@example.com',
      avatar: '',
      location: 'Austin, TX',
      role: 'Blockchain Engineer @ Ethereum Foundation',
      joinedDate: '2024-01-20',
      status: 'active',
      stats: {
        sessionsProposed: 3,
        votesCast: 18,
        creditsSpent: 45,
        sessionsAttending: 12,
        lastActive: '1 day ago',
      },
    },
    {
      id: 3,
      name: 'Carol Zhang',
      email: 'carol.zhang@example.com',
      avatar: '',
      location: 'New York, NY',
      role: 'Community Lead @ MetaGov',
      joinedDate: '2024-01-10',
      status: 'active',
      stats: {
        sessionsProposed: 1,
        votesCast: 32,
        creditsSpent: 89,
        sessionsAttending: 15,
        lastActive: '30 mins ago',
      },
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david.kim@example.com',
      avatar: '',
      location: 'London, UK',
      role: 'Researcher @ BlockScience',
      joinedDate: '2024-02-01',
      status: 'inactive',
      stats: {
        sessionsProposed: 0,
        votesCast: 5,
        creditsSpent: 12,
        sessionsAttending: 2,
        lastActive: '2 weeks ago',
      },
    },
  ]

  const filteredParticipants = participants.filter((participant) => {
    const matchesSearch =
      searchQuery === '' ||
      participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || participant.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: participants.length,
    active: participants.filter((p) => p.status === 'active').length,
    inactive: participants.filter((p) => p.status === 'inactive').length,
    banned: participants.filter((p) => p.status === 'banned').length,
  }

  const statusConfig = {
    active: {
      label: 'Active',
      variant: 'default' as const,
      icon: <CheckCircle className="h-3 w-3" />,
    },
    inactive: {
      label: 'Inactive',
      variant: 'secondary' as const,
      icon: null,
    },
    banned: {
      label: 'Banned',
      variant: 'destructive' as const,
      icon: <Ban className="h-3 w-3" />,
    },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Participants</h1>
          <p className="text-muted-foreground mt-1">
            Manage event participants and their permissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Participant
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Total Participants</div>
          <div className="text-2xl font-bold mt-1">{stats.total}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Active</div>
          <div className="text-2xl font-bold mt-1 text-success">{stats.active}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Inactive</div>
          <div className="text-2xl font-bold mt-1 text-muted-foreground">{stats.inactive}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Banned</div>
          <div className="text-2xl font-bold mt-1 text-destructive">{stats.banned}</div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('active')}
          >
            Active
          </Button>
          <Button
            variant={statusFilter === 'inactive' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('inactive')}
          >
            Inactive
          </Button>
        </div>
      </div>

      {/* Participants Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Participant
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Contact
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Joined
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Activity
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipants.map((participant) => {
                const statusInfo = statusConfig[participant.status]
                return (
                  <tr key={participant.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          {participant.avatar ? (
                            <img
                              src={participant.avatar}
                              alt={participant.name}
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{participant.name}</div>
                          {participant.role && (
                            <div className="text-xs text-muted-foreground truncate max-w-xs">
                              {participant.role}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="truncate max-w-xs">{participant.email}</span>
                        </div>
                        {participant.location && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{participant.location}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm">{participant.joinedDate}</td>
                    <td className="p-4">
                      <div className="space-y-1 text-xs">
                        <div>
                          <span className="font-medium">{participant.stats.sessionsProposed}</span>{' '}
                          sessions
                        </div>
                        <div>
                          <span className="font-medium">{participant.stats.votesCast}</span> votes
                        </div>
                        <div className="text-muted-foreground">
                          Last: {participant.stats.lastActive}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={statusInfo.variant} className="flex items-center gap-1 w-fit">
                        {statusInfo.icon}
                        {statusInfo.label}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <User className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Ban className="h-4 w-4 mr-2" />
                            Ban User
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Empty State */}
      {filteredParticipants.length === 0 && (
        <div className="text-center py-12">
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
      )}
    </div>
  )
}
