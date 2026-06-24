'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'
import { AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface AuthFormProps {
  mode: 'sign-in' | 'sign-up'
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'sign-up') {
        const { error: err } = await authClient.signUp.email({ email, password, name })
        if (err) { setError(err.message ?? 'Sign up failed'); setLoading(false); return }
      } else {
        const { error: err } = await authClient.signIn.email({ email, password })
        if (err) { setError(err.message ?? 'Invalid credentials'); setLoading(false); return }
      }
      router.push('/')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-8GUzX7yUBYDmcov60x1qAFtnqEoKIV.png"
            alt="Abu Jasem Electro Mechanical"
            width={200}
            height={80}
            className="object-contain"
          />
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {mode === 'sign-in' ? 'Welcome back' : 'Create an account'}
            </CardTitle>
            <CardDescription>
              {mode === 'sign-in'
                ? 'Sign in to your AJEM portal'
                : 'Register to access the client portal'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {mode === 'sign-up' && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={loading}
                />
              </div>
              {error && (
                <Alert variant="destructive" className="flex items-center gap-2 py-2">
                  <AlertCircle className="size-4 shrink-0" />
                  <span className="text-sm">{error}</span>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 data-icon="inline-start" className="animate-spin" />}
                {mode === 'sign-in' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              {mode === 'sign-in' ? (
                <>
                  {"Don't have an account? "}
                  <Link href="/sign-up" className="text-primary font-medium hover:underline">
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <Link href="/sign-in" className="text-primary font-medium hover:underline">
                    Sign in
                  </Link>
                </>
              )}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
