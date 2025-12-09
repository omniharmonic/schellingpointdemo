'use client'

import * as React from 'react'
import {
  Radio,
  Check,
  AlertCircle,
  Users,
  MapPin,
  Clock,
  UserCheck,
  Smartphone,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type ScanState = 'ready' | 'scanning' | 'success' | 'error' | 'already_checked_in'

interface CheckInRecord {
  id: string
  userName: string
  cardId: string
  timestamp: string
}

export default function TabletCheckInPage() {
  const [scanState, setScanState] = React.useState<ScanState>('ready')
  const [currentUser, setCurrentUser] = React.useState<string>('')
  const [checkIns, setCheckIns] = React.useState<CheckInRecord[]>([])
  const [errorMessage, setErrorMessage] = React.useState<string>('')

  // Mock session data - in real app, would come from API based on venue
  const session = {
    title: 'Decentralized Identity Solutions',
    venue: 'Main Hall',
    time: '10:00 AM - 11:30 AM',
    capacity: 100,
    host: 'Alice Chen',
  }

  const handleScan = async () => {
    setScanState('scanning')
    setErrorMessage('')

    // Simulate NFC scan - in real app, would use Web NFC API
    setTimeout(() => {
      const mockNames = ['Alice Chen', 'Bob Martinez', 'Carol Zhang', 'David Kim', 'Emma Wilson']
      const randomName = mockNames[Math.floor(Math.random() * mockNames.length)]
      const mockCardId = `BURNER-${Math.random().toString(36).substring(2, 10).toUpperCase()}`

      // Check if already checked in
      const alreadyCheckedIn = checkIns.some((record) => record.userName === randomName)

      if (alreadyCheckedIn) {
        setCurrentUser(randomName)
        setScanState('already_checked_in')
        setErrorMessage('This attendee has already checked in to this session.')
        setTimeout(() => setScanState('ready'), 3000)
      } else {
        setCurrentUser(randomName)
        setScanState('success')

        // Add to check-in records
        const newRecord: CheckInRecord = {
          id: Math.random().toString(),
          userName: randomName,
          cardId: mockCardId,
          timestamp: new Date().toLocaleTimeString(),
        }
        setCheckIns((prev) => [newRecord, ...prev])

        // Reset after 2 seconds
        setTimeout(() => {
          setScanState('ready')
          setCurrentUser('')
        }, 2000)
      }
    }, 1500)
  }

  const attendancePercentage = Math.round((checkIns.length / session.capacity) * 100)

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="default">Session Check-In</Badge>
                <Badge variant="secondary">
                  <Clock className="h-3 w-3 mr-1" />
                  {session.time}
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
            <div className="text-right">
              <div className="text-4xl font-bold">{checkIns.length}</div>
              <div className="text-sm text-muted-foreground">checked in</div>
              <div className="text-xs text-muted-foreground mt-1">
                {attendancePercentage}% capacity
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Scan Area */}
          <Card className="p-8">
            <div className="text-center space-y-6">
              {/* Ready State */}
              {scanState === 'ready' && (
                <>
                  <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-muted relative">
                    <Smartphone className="h-20 w-20 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Ready to Scan</h2>
                    <p className="text-muted-foreground">
                      Tap your burner card to check in
                    </p>
                  </div>
                  <Button onClick={handleScan} size="lg" className="w-full">
                    <Radio className="h-5 w-5 mr-2" />
                    Scan Card
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

              {/* Success State */}
              {scanState === 'success' && (
                <>
                  <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-success/10">
                    <Check className="h-20 w-20 text-success" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Welcome, {currentUser}!</h2>
                    <p className="text-success">Successfully checked in</p>
                  </div>
                </>
              )}

              {/* Already Checked In State */}
              {scanState === 'already_checked_in' && (
                <>
                  <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-amber-500/10">
                    <AlertCircle className="h-20 w-20 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Already Checked In</h2>
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
                    <h2 className="text-2xl font-bold mb-2">Scan Failed</h2>
                    <p className="text-destructive">{errorMessage}</p>
                  </div>
                  <Button onClick={() => setScanState('ready')} variant="outline" className="w-full">
                    Try Again
                  </Button>
                </>
              )}
            </div>
          </Card>

          {/* Recent Check-Ins */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Check-Ins</h3>
              <Badge variant="secondary">
                <UserCheck className="h-3 w-3 mr-1" />
                {checkIns.length} total
              </Badge>
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {checkIns.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No check-ins yet</p>
                  <p className="text-sm">Attendees will appear here as they check in</p>
                </div>
              ) : (
                checkIns.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{record.userName}</div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {record.cardId}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{record.timestamp}</div>
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
              <p className="font-medium mb-1">Tablet Instructions</p>
              <p className="text-muted-foreground">
                This tablet is set up for attendees to check in as they enter the session. Each tap
                records attendance and prevents duplicate check-ins. Make sure the tablet is
                positioned near the entrance for easy access.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
