import { useState, useEffect } from 'react'
import { GLOBAL_OFFICES, type GlobalOffice } from '../../data/aboutData'
import { Building2, Mail, Phone, Clock, Users, Compass, Globe } from 'lucide-react'

export function AboutGlobalOffices() {
  const [selectedOfficeCity, setSelectedOfficeCity] = useState<string>(GLOBAL_OFFICES[0].city)
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const selectedOffice: GlobalOffice =
    GLOBAL_OFFICES.find((o) => o.city === selectedOfficeCity) || GLOBAL_OFFICES[0]

  // Timezone display helper
  const getLocalOfficeTime = (timezone: string) => {
    try {
      if (timezone.includes('CET')) {
        return currentTime.toLocaleTimeString('en-US', { timeZone: 'Europe/Zurich', hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }
      if (timezone.includes('GMT')) {
        return currentTime.toLocaleTimeString('en-US', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }
      if (timezone.includes('EST')) {
        return currentTime.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }
      if (timezone.includes('JST')) {
        return currentTime.toLocaleTimeString('en-US', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }
      if (timezone.includes('CST')) {
        return currentTime.toLocaleTimeString('en-US', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }
      return currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } catch {
      return currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
  }

  return (
    <section id="global-offices" className="border-b border-border bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Worldwide Footprint
          </span>
          <h2 className="mt-2 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Global Headquarters & Regional Hubs
          </h2>
          <p className="mt-4 text-base font-light leading-relaxed text-ink-secondary">
            Headquartered in Basel, Switzerland, Emergent Science operates across six international hubs 
            delivering 24/7 editorial support, technology operations, and academic community partnerships.
          </p>
        </div>

        {/* Office Navigation Selector */}
        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-6 lg:grid-cols-2">
            {GLOBAL_OFFICES.map((office) => {
              const isSelected = office.city === selectedOfficeCity
              return (
                <button
                  key={office.city}
                  type="button"
                  onClick={() => setSelectedOfficeCity(office.city)}
                  className={`rounded-card p-4 text-left transition-all ${
                    isSelected
                      ? 'border-2 border-primary bg-white shadow-card ring-2 ring-primary/10'
                      : 'border border-border bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-ink">{office.city}</span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      {office.country}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-primary font-medium">{office.role.split('&')[0]}</p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-ink-muted">
                    <Users className="h-3 w-3" />
                    <span>{office.staffCount} staff</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Active Office Detail Display Card */}
          <div className="lg:col-span-6">
            <div className="h-full rounded-card border border-border bg-white p-6 sm:p-8 shadow-card flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-bold text-ink">
                        {selectedOffice.city}, {selectedOffice.country}
                      </h3>
                    </div>
                    <p className="mt-0.5 text-xs font-semibold text-primary">{selectedOffice.role}</p>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>Local Time: <strong>{getLocalOfficeTime(selectedOffice.timezone)}</strong></span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3 text-xs">
                    <Globe className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <div>
                      <p className="font-bold text-ink">Registered Physical Address</p>
                      <p className="mt-0.5 text-ink-secondary leading-relaxed">{selectedOffice.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                    <div>
                      <p className="font-bold text-ink">Editorial Inquiries</p>
                      <a href={`mailto:${selectedOffice.email}`} className="text-primary hover:underline font-medium">
                        {selectedOffice.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                    <div>
                      <p className="font-bold text-ink">Direct Telephone</p>
                      <p className="text-ink-secondary">{selectedOffice.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <Compass className="h-4 w-4 shrink-0 text-slate-400" />
                    <div>
                      <p className="font-bold text-ink">Geographic Location</p>
                      <p className="text-ink-muted">{selectedOffice.coordinates} • {selectedOffice.timezone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-lg bg-slate-50 p-4 border border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-secondary">Regional Team Size:</span>
                  <span className="font-bold text-ink">{selectedOffice.staffCount} Dedicated Specialists</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(selectedOffice.staffCount / 420) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
