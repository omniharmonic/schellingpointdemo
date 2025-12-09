'use client'

import * as React from 'react'
import { Plus, X, Upload, User, Twitter, Linkedin, Github, Globe, MapPin, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal'
import { BurnerSetup } from './burner-setup'

interface ProfileSetupProps {
  open: boolean
  onComplete: (profile: ProfileData) => void
  eventName?: string
}

interface ProfileData {
  displayName: string
  bio: string
  interests: string[]
  avatar?: string
  location?: string
  email?: string
  socials: {
    twitter?: string
    linkedin?: string
    github?: string
    website?: string
  }
  burnerCardId?: string
}

const suggestedInterests = [
  'Governance',
  'DeFi',
  'DAOs',
  'NFTs',
  'Layer 2',
  'Privacy',
  'Security',
  'UX/UI',
  'Public Goods',
  'ReFi',
]

export function ProfileSetup({ open, onComplete, eventName = 'the event' }: ProfileSetupProps) {
  const [step, setStep] = React.useState(1)
  const [displayName, setDisplayName] = React.useState('')
  const [bio, setBio] = React.useState('')
  const [interests, setInterests] = React.useState<string[]>([])
  const [customInterest, setCustomInterest] = React.useState('')
  const [avatar, setAvatar] = React.useState<string>('')
  const [location, setLocation] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [twitter, setTwitter] = React.useState('')
  const [linkedin, setLinkedin] = React.useState('')
  const [github, setGithub] = React.useState('')
  const [website, setWebsite] = React.useState('')
  const [burnerCardId, setBurnerCardId] = React.useState<string>('')

  const addInterest = (interest: string) => {
    if (!interests.includes(interest) && interests.length < 5) {
      setInterests([...interests, interest])
    }
  }

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest))
  }

  const handleAddCustom = () => {
    if (customInterest.trim() && !interests.includes(customInterest.trim())) {
      addInterest(customInterest.trim())
      setCustomInterest('')
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In real app, this would upload to a server
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    }
  }

  const handleBurnerSetupComplete = (cardId: string) => {
    setBurnerCardId(cardId)
    onComplete({
      displayName,
      bio,
      interests,
      avatar,
      location,
      email,
      socials: {
        twitter: twitter || undefined,
        linkedin: linkedin || undefined,
        github: github || undefined,
        website: website || undefined,
      },
      burnerCardId: cardId,
    })
  }

  const handleBurnerSkip = () => {
    onComplete({
      displayName,
      bio,
      interests,
      avatar,
      location,
      email,
      socials: {
        twitter: twitter || undefined,
        linkedin: linkedin || undefined,
        github: github || undefined,
        website: website || undefined,
      },
    })
  }

  const isStep1Valid = displayName.trim().length >= 2
  const isStep2Valid = true // All fields on step 2 are optional

  return (
    <Modal open={open} onOpenChange={() => {}}>
      <ModalContent className="sm:max-w-md" showClose={false} data-testid="profile-setup-modal">
        {step < 3 && (
          <ModalHeader className="text-center sm:text-center">
            <ModalTitle>
              {step === 1 ? `Welcome to ${eventName}!` : 'Help others find you'}
            </ModalTitle>
          </ModalHeader>
        )}

        {step === 3 ? (
          <BurnerSetup onComplete={handleBurnerSetupComplete} onSkip={handleBurnerSkip} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 ? (
            <>
              {/* Step 1: Basic Info */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Profile Photo{' '}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <label htmlFor="photo-upload">
                      <Button type="button" variant="outline" size="sm" asChild>
                        <span className="cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Photo
                        </span>
                      </Button>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG or GIF. Max 2MB.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="displayName" className="text-sm font-medium">
                  Display name <span className="text-destructive">*</span>
                </label>
                <Input
                  id="displayName"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  autoFocus
                  data-testid="display-name-input"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium">
                  Short bio{' '}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <Textarea
                  id="bio"
                  placeholder="Product designer passionate about decentralized governance..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="h-20"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Topics you're interested in
                </label>

                {interests.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <Badge
                        key={interest}
                        variant="secondary"
                        className="gap-1 pr-1"
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => removeInterest(interest)}
                          className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {suggestedInterests
                    .filter((i) => !interests.includes(i))
                    .slice(0, 6)
                    .map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => addInterest(interest)}
                        className="inline-flex items-center rounded-full border px-3 py-1 text-xs hover:bg-accent transition-colors"
                        disabled={interests.length >= 5}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {interest}
                      </button>
                    ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom topic"
                    value={customInterest}
                    onChange={(e) => setCustomInterest(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddCustom()
                      }
                    }}
                    className="flex-1"
                    disabled={interests.length >= 5}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleAddCustom}
                    disabled={!customInterest.trim() || interests.length >= 5}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {interests.length >= 5 && (
                  <p className="text-xs text-muted-foreground">
                    Maximum 5 topics reached
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Step 2: Contact & Socials */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email{' '}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location{' '}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <Input
                    id="location"
                    placeholder="San Francisco, CA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="pt-2 border-t">
                  <p className="text-sm font-medium mb-3">Social Links (optional)</p>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label htmlFor="twitter" className="text-sm flex items-center gap-2 text-muted-foreground">
                        <Twitter className="h-4 w-4" />
                        Twitter
                      </label>
                      <Input
                        id="twitter"
                        placeholder="@username"
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="linkedin" className="text-sm flex items-center gap-2 text-muted-foreground">
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </label>
                      <Input
                        id="linkedin"
                        placeholder="linkedin.com/in/username"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="github" className="text-sm flex items-center gap-2 text-muted-foreground">
                        <Github className="h-4 w-4" />
                        GitHub
                      </label>
                      <Input
                        id="github"
                        placeholder="github.com/username"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="website" className="text-sm flex items-center gap-2 text-muted-foreground">
                        <Globe className="h-4 w-4" />
                        Website
                      </label>
                      <Input
                        id="website"
                        placeholder="yourwebsite.com"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-2">
            {step === 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button
              type="submit"
              className="flex-1"
              disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
              data-testid="profile-submit-btn"
            >
              {step === 1 ? 'Next' : 'Next'}
            </Button>
          </div>
        </form>
        )}
      </ModalContent>
    </Modal>
  )
}
