'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  Thermometer, Zap, Wrench, Shield, Clock, Users, Award, Phone, Mail, MapPin,
  CheckCircle2, Star, ArrowRight, Menu, X, Wind, Droplets, Settings, ChevronRight
} from 'lucide-react'

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

const SERVICES = [
  {
    icon: Thermometer,
    title: 'HVAC Installation',
    description: 'Full design, supply and installation of air conditioning systems for residential and commercial properties.',
    tags: ['Split AC', 'Chillers', 'VRF Systems'],
  },
  {
    icon: Wind,
    title: 'Preventive Maintenance',
    description: 'Scheduled AMC contracts to keep your systems running at peak efficiency year-round.',
    tags: ['AMC Contracts', 'Filter Cleaning', 'Performance Checks'],
  },
  {
    icon: Zap,
    title: 'Electrical Works',
    description: 'Comprehensive electrical installations, wiring, distribution boards, and power systems.',
    tags: ['Wiring', 'Distribution', 'Power Systems'],
  },
  {
    icon: Droplets,
    title: 'Plumbing Services',
    description: 'Expert plumbing for new installations, repairs, drainage, and water supply systems.',
    tags: ['Installation', 'Repairs', 'Drainage'],
  },
  {
    icon: Wrench,
    title: 'Emergency Repairs',
    description: '24/7 rapid-response repair service for HVAC breakdowns and mechanical failures.',
    tags: ['24/7 Response', 'Diagnostics', 'All Brands'],
  },
  {
    icon: Settings,
    title: 'MEP Contracting',
    description: 'Full Mechanical, Electrical and Plumbing contracting for new construction and fit-out projects.',
    tags: ['Mechanical', 'Electrical', 'Plumbing'],
  },
]

const STATS = [
  { value: '15+', label: 'Years Experience' },
  { value: '2,000+', label: 'Projects Completed' },
  { value: '500+', label: 'Happy Clients' },
  { value: '24/7', label: 'Support Available' },
]

const WHY_US = [
  {
    icon: Shield,
    title: 'Licensed & Certified',
    description: 'Fully licensed by UAE authorities with certified engineers and technicians on every job.',
  },
  {
    icon: Clock,
    title: 'Fast Response Time',
    description: 'We guarantee a response within 4 hours for emergency calls anywhere in the UAE.',
  },
  {
    icon: Users,
    title: 'Experienced Team',
    description: 'Our team of 50+ engineers and technicians brings decades of combined expertise.',
  },
  {
    icon: Award,
    title: 'Quality Guaranteed',
    description: 'All work is backed by our quality guarantee and warranty on parts and labour.',
  },
  {
    icon: CheckCircle2,
    title: 'Transparent Pricing',
    description: 'No hidden charges. We provide detailed quotations before any work begins.',
  },
  {
    icon: Star,
    title: 'Free Inspection',
    description: 'We offer a complimentary site inspection before committing to any project.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Mohammed Al Rashid',
    role: 'Facilities Manager, Dubai Marina Mall',
    quote: 'AJEM has been our trusted partner for over 5 years. Their response time and professionalism are unmatched.',
    rating: 5,
  },
  {
    name: 'Sarah Johnson',
    role: 'Property Manager, JLT Towers',
    quote: 'Excellent service from start to finish. The AMC contract has saved us significant costs on emergency repairs.',
    rating: 5,
  },
  {
    name: 'Ahmed Al Mansoori',
    role: 'Owner, Al Mansoori Villa',
    quote: 'Very professional team. They completed our full villa HVAC installation ahead of schedule and within budget.',
    rating: 5,
  },
]

const PROJECTS = [
  { title: 'Dubai Marina Tower', category: 'Commercial HVAC', description: '48-floor tower VRF system installation' },
  { title: 'Jumeirah Villa Complex', category: 'Residential', description: '24-unit split AC installation and AMC' },
  { title: 'Abu Dhabi Hospital Wing', category: 'Healthcare', description: 'Critical environment HVAC & MEP works' },
  { title: 'Sharjah Industrial Park', category: 'Industrial', description: 'Chiller plant and ductwork installation' },
  { title: 'JLT Office Fitout', category: 'Commercial', description: 'Full MEP contracting for office complex' },
  { title: 'Palm Jumeirah Mansions', category: 'Luxury Residential', description: 'Smart HVAC & home automation integration' },
]

export function PublicHomepage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        toast.success('Message sent! We will get back to you within 24 hours.')
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        toast.error('Failed to send message. Please try again.')
      }
    } catch {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Navbar ── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-background/90 backdrop-blur border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link href="/" className="shrink-0">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-8GUzX7yUBYDmcov60x1qAFtnqEoKIV.png"
              alt="AJEM Logo"
              width={140}
              height={56}
              className="object-contain h-10 w-auto"
              priority
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/sign-up">Client Portal</Link>
            </Button>
          </div>
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden bg-background border-t border-border px-4 pb-4 flex flex-col gap-3">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium py-2 text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>
                {l.label}
              </a>
            ))}
            <Separator />
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" asChild><Link href="/sign-in">Sign In</Link></Button>
              <Button size="sm" asChild><Link href="/sign-up">Client Portal</Link></Button>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      <section className="relative pt-16 min-h-screen flex items-center overflow-hidden bg-secondary">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-primary blur-2xl" />
        </div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
              #1 Electro-Mechanical Company in UAE
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-foreground leading-tight text-balance mb-6">
              Expert HVAC &amp; Electro-Mechanical Services
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl text-pretty leading-relaxed">
              Abu Jasem Electro Mechanical delivers world-class HVAC, electrical, and plumbing solutions for residential and commercial clients across the UAE since 2009.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <Button size="lg" asChild className="text-base">
                <a href="#contact">
                  Get Free Inspection
                  <ArrowRight data-icon="inline-end" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/10">
                <a href="#services">Our Services</a>
              </Button>
            </div>
            <div className="flex flex-wrap gap-8">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span className="text-3xl font-bold text-primary">{s.value}</span>
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">Our Services</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-balance">Complete Electro-Mechanical Solutions</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-pretty">
              From routine maintenance to full MEP contracting — we handle every aspect of your building&apos;s mechanical and electrical systems.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <Card key={s.title} className="group hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <s.icon className="size-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{s.title}</CardTitle>
                  <CardDescription className="text-pretty">{s.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="py-24 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">About AJEM</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-balance mb-6">
                Trusted Partners in Building Excellence
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4 text-pretty">
                Abu Jasem Electro Mechanical (AJEM) was founded in 2009 with a single mission: to provide reliable, high-quality electro-mechanical services across the UAE. Over 15 years, we have grown into one of the region&apos;s most trusted contractors.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6 text-pretty">
                Our team of over 50 certified engineers and technicians operate across Dubai, Abu Dhabi, Sharjah, and the Northern Emirates, serving residential complexes, commercial towers, hospitals, industrial facilities, and government projects.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  'ISO 9001:2015 Certified',
                  'Approved Contractor — Dubai Municipality',
                  'DEWA Approved Contractor',
                  'All major brands authorized service partner',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-primary shrink-0" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((s) => (
                <Card key={s.label} className="text-center p-6">
                  <CardContent className="p-0">
                    <div className="text-4xl font-bold text-primary mb-1">{s.value}</div>
                    <div className="text-sm text-muted-foreground">{s.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section id="why-us" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">Why Choose AJEM</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-balance">The AJEM Difference</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-pretty">
              We don&apos;t just fix problems — we build long-term partnerships based on trust, quality, and transparency.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_US.map((w) => (
              <div key={w.title} className="flex gap-4 p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <w.icon className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{w.title}</h3>
                  <p className="text-sm text-muted-foreground text-pretty">{w.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section id="projects" className="py-24 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">Our Work</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-balance">Featured Projects</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-pretty">
              Delivering excellence across residential, commercial, and industrial sectors.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((p) => (
              <Card key={p.title} className="overflow-hidden group hover:shadow-md transition-shadow">
                <div className="h-40 bg-secondary flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors" />
                  <Settings className="size-12 text-primary/40" />
                </div>
                <CardContent className="p-5">
                  <Badge variant="secondary" className="mb-2 text-xs">{p.category}</Badge>
                  <h3 className="font-semibold text-foreground mb-1">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-balance">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="p-6">
                <CardContent className="p-0">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="size-4 text-primary fill-primary" />
                    ))}
                  </div>
                  <blockquote className="text-sm text-muted-foreground text-pretty leading-relaxed mb-4">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div>
                    <div className="font-semibold text-sm text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="py-24 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">Contact Us</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-balance">Get In Touch</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-pretty">
              Request a free inspection, get a quotation, or simply ask us anything. We respond within 24 hours.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <div className="flex flex-col gap-6">
              <Card className="p-6">
                <CardContent className="p-0 flex flex-col gap-5">
                  {[
                    { icon: Phone, label: 'Phone', value: '+971 4 000 0000' },
                    { icon: Mail, label: 'Email', value: 'info@ajem-uae.com' },
                    { icon: MapPin, label: 'Address', value: 'Dubai Industrial Area, Dubai, UAE' },
                    { icon: Clock, label: 'Working Hours', value: 'Sun–Thu 8:00 AM – 6:00 PM' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="size-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</div>
                        <div className="text-sm font-medium text-foreground mt-0.5">{value}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="p-6 bg-secondary text-secondary-foreground">
                <CardContent className="p-0">
                  <h3 className="font-bold text-lg mb-2">Free Site Inspection</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We offer a complimentary no-obligation site inspection for all new clients. Our engineer will assess your requirements and provide a detailed quotation.
                  </p>
                  <Button asChild className="w-full">
                    <a href="#contact-form">Book Free Inspection</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
            <Card id="contact-form" className="p-6">
              <CardContent className="p-0">
                <h3 className="font-bold text-lg mb-5">Send Us a Message</h3>
                <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="c-name">Full Name</Label>
                      <Input id="c-name" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} required placeholder="Your name" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="c-phone">Phone</Label>
                      <Input id="c-phone" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} placeholder="+971 ..." />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="c-email">Email</Label>
                    <Input id="c-email" type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} required placeholder="you@example.com" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="c-subject">Subject</Label>
                    <Input id="c-subject" value={formData.subject} onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))} placeholder="How can we help?" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="c-message">Message</Label>
                    <Textarea id="c-message" value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} required placeholder="Describe your requirement..." className="min-h-28 resize-none" />
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-secondary text-secondary-foreground py-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-1 md:col-span-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-8GUzX7yUBYDmcov60x1qAFtnqEoKIV.png"
                alt="AJEM"
                width={140}
                height={56}
                className="object-contain h-10 w-auto brightness-200 mb-4"
              />
              <p className="text-sm text-muted-foreground max-w-xs text-pretty leading-relaxed">
                Abu Jasem Electro Mechanical — trusted HVAC, electrical and plumbing services across the UAE since 2009.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Services</h4>
              <ul className="flex flex-col gap-2">
                {['HVAC Installation', 'Preventive Maintenance', 'Electrical Works', 'Plumbing Services', 'MEP Contracting'].map((s) => (
                  <li key={s}><a href="#services" className="text-sm text-muted-foreground hover:text-secondary-foreground transition-colors">{s}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Contact</h4>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                <li>+971 4 000 0000</li>
                <li>info@ajem-uae.com</li>
                <li>Dubai Industrial Area</li>
                <li>Dubai, UAE</li>
              </ul>
            </div>
          </div>
          <Separator className="bg-secondary-foreground/10 mb-6" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <span>&copy; {new Date().getFullYear()} Abu Jasem Electro Mechanical. All rights reserved.</span>
            <div className="flex gap-6">
              <Link href="/sign-in" className="hover:text-secondary-foreground transition-colors">Staff Login</Link>
              <Link href="/sign-up" className="hover:text-secondary-foreground transition-colors">Client Portal</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
