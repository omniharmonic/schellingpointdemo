'use client'

import * as React from 'react'
import { Smartphone, Wallet, Check, AlertCircle, Loader2, Radio } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface BurnerSetupProps {
  onComplete: (cardId: string) => void
  onSkip?: () => void
}

type SetupState = 'ready' | 'scanning' | 'success' | 'error'

export function BurnerSetup({ onComplete, onSkip }: BurnerSetupProps) {
  const [state, setState] = React.useState<SetupState>('ready')
  const [cardId, setCardId] = React.useState<string>('')
  const [errorMessage, setErrorMessage] = React.useState<string>('')

  const handleStartScan = async () => {
    setState('scanning')
    setErrorMessage('')

    // Simulate NFC scan - in real app, this would use Web NFC API
    try {
      // Check if Web NFC is available
      if ('NDEFReader' in window) {
        // Real implementation would go here
        // const ndef = new NDEFReader()
        // await ndef.scan()
        // ndef.onreading = event => { ... }

        // For now, simulate a successful scan after 2 seconds
        setTimeout(() => {
          const mockCardId = `BURNER-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
          setCardId(mockCardId)
          setState('success')
        }, 2000)
      } else {
        // Fallback for browsers without NFC support
        setTimeout(() => {
          const mockCardId = `BURNER-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
          setCardId(mockCardId)
          setState('success')
        }, 2000)
      }
    } catch (error) {
      setState('error')
      setErrorMessage('Failed to read NFC card. Please try again.')
    }
  }

  const handleRetry = () => {
    setState('ready')
    setCardId('')
    setErrorMessage('')
  }

  const handleConfirm = () => {
    if (cardId) {
      onComplete(cardId)
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Wallet className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Link Your Burner Card</h2>
        <p className="text-muted-foreground">
          Tap your NFC burner card to link it to your account. You'll use this card to vote at venues during the event.
        </p>
      </div>

      {/* Main Card */}
      <Card className="p-6">
        {state === 'ready' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-muted mb-4">
                <Smartphone className="h-16 w-16 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Ready to Scan</h3>
              <p className="text-sm text-muted-foreground">
                Hold your burner card near your device's NFC reader
              </p>
            </div>
            <Button onClick={handleStartScan} className="w-full" size="lg">
              <Radio className="h-5 w-5 mr-2" />
              Start Scanning
            </Button>
          </div>
        )}

        {state === 'scanning' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-primary/10 mb-4 relative">
                <Smartphone className="h-16 w-16 text-primary" />
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              </div>
              <h3 className="font-semibold mb-2">Scanning...</h3>
              <p className="text-sm text-muted-foreground">
                Hold your card steady near the reader
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Waiting for card...</span>
            </div>
          </div>
        )}

        {state === 'success' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-success/10 mb-4">
                <Check className="h-16 w-16 text-success" />
              </div>
              <h3 className="font-semibold mb-2">Card Detected!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Successfully scanned your burner card
              </p>
              <Badge variant="secondary" className="text-sm font-mono">
                {cardId}
              </Badge>
            </div>
            <div className="space-y-2">
              <Button onClick={handleConfirm} className="w-full" size="lg">
                Confirm & Continue
              </Button>
              <Button onClick={handleRetry} variant="outline" className="w-full">
                Scan Different Card
              </Button>
            </div>
          </div>
        )}

        {state === 'error' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-destructive/10 mb-4">
                <AlertCircle className="h-16 w-16 text-destructive" />
              </div>
              <h3 className="font-semibold mb-2">Scan Failed</h3>
              <p className="text-sm text-muted-foreground">
                {errorMessage || 'Unable to read the card. Please try again.'}
              </p>
            </div>
            <Button onClick={handleRetry} variant="outline" className="w-full" size="lg">
              Try Again
            </Button>
          </div>
        )}
      </Card>

      {/* Info Cards */}
      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">1</span>
          </div>
          <div>
            <div className="font-medium text-sm">Tap to Check In</div>
            <div className="text-xs text-muted-foreground">
              Use your card at venue tablets to check into sessions
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">2</span>
          </div>
          <div>
            <div className="font-medium text-sm">Vote on Value</div>
            <div className="text-xs text-muted-foreground">
              After sessions, tap to allocate value votes based on your experience
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">3</span>
          </div>
          <div>
            <div className="font-medium text-sm">Anonymous & Secure</div>
            <div className="text-xs text-muted-foreground">
              Your card is linked only to you, ensuring privacy and preventing double-voting
            </div>
          </div>
        </div>
      </div>

      {/* Skip Option */}
      {onSkip && (
        <div className="text-center">
          <Button variant="ghost" onClick={onSkip} className="text-sm">
            Skip for now (you can set this up later)
          </Button>
        </div>
      )}
    </div>
  )
}
