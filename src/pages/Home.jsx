import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useJobs } from '../context/JobContext.jsx'
import FeaturedJobCard from '../components/FeaturedJobCard.jsx'
import {
  Search,
  MapPin,
  Sparkles,
  Code2,
  Palette,
  Megaphone,
  Landmark,
  Hammer,
  Coins,
  Building2,
  Quote,
} from 'lucide-react'

const CATEGORIES = [
  { name: 'IT', icon: Code2, count: '180+ Jobs', color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/35' },
  { name: 'Design', icon: Palette, count: '90+ Jobs', color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/35' },
  { name: 'Marketing', icon: Megaphone, count: '75+ Jobs', color: 'text-pink-500 bg-pink-50 dark:bg-pink-950/20 border-pink-100 dark:border-pink-900/35' },
  { name: 'Finance', icon: Landmark, count: '60+ Jobs', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/35' },
  { name: 'Engineering', icon: Hammer, count: '120+ Jobs', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/35' },
  { name: 'Sales', icon: Coins, count: '85+ Jobs', color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/35' },
]

const COMPANIES = [
  { name: 'Vortex Technologies', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100' },
  { name: 'CreativeStudio', logo: 'https://images.unsplash.com/photo-1561070791-26c113006238?w=100' },
  { name: 'CloudScale Systems', logo: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=100' },
  { name: 'Apex Capital', logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100' },
  { name: 'LaunchPad Media', logo: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=100' },
  { name: 'DataSystems Ltd.', logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100' },
]

const TESTIMONIALS = [
  {
    quote: 'The AI Match Score is a game changer! It allowed me to filter out jobs where my skills did not align, leading to interviews within days.',
    author: 'Jane D.',
    role: 'Senior React Developer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
  {
    quote: "As an employer, finding quality talent has never been easier. CareerWave's applicant dashboard and job posting flow are intuitive and professional.",
    author: 'Marcus K.',
    role: 'CTO at Vortex Technologies',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
  },
]

const Home = () => {
  const { jobs, loading } = useJobs()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')

  const featuredJobs = useMemo(() => jobs.filter((job) => job.featured).slice(0, 4), [jobs])
  const stats = useMemo(
    () => [
      { label: 'Jobs Live', value: `${jobs.length}+` },
      { label: 'Hiring Companies', value: `${new Set(jobs.map((job) => job.company)).size}+` },
      { label: 'Applications', value: `${jobs.reduce((sum, job) => sum + (job.applicantsCount || 0), 0)}+` },
    ],
    [jobs]
  )

  const handleSearch = (event) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.append('search', query)
    if (location.trim()) params.append('location', location)
    navigate(`/jobs?${params.toString()}`)
  }

  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_25%),#f8fafc] dark:bg-slate-950/50 dark:bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.14),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.10),_transparent_20%),#020617] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 dark:bg-slate-900/70 px-4 py-2 text-sm text-blue-700 dark:text-blue-300 shadow-sm shadow-blue-500/10">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                Premium roles across the fastest-growing teams
              </div>
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight text-slate-900 dark:text-slate-50">
                  Discover your next career move with confidence.
                </h1>
                <p className="max-w-2xl text-slate-600 dark:text-slate-300 text-lg sm:text-xl leading-8">
                  Search high-quality remote and hybrid roles, compare AI Match Scores, and connect with premium hiring teams in minutes.
                </p>
              </div>
              <form onSubmit={handleSearch} className="grid gap-4 sm:grid-cols-[1.9fr_1fr_0.9fr] items-end">
                <label className="block">
                  <span className="sr-only">Search jobs</span>
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search jobs, companies or skills"
                    className="w-full rounded-3xl border border-slate-200 bg-white/90 px-5 py-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                  />
                </label>
                <label className="block">
                  <span className="sr-only">Location</span>
                  <input
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="City, state or remote"
                    className="w-full rounded-3xl border border-slate-200 bg-white/90 px-5 py-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                  />
                </label>
                <button type="submit" className="inline-flex items-center justify-center rounded-3xl bg-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200">
                  Search roles
                </button>
              </form>
              <div className="grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-xl shadow-slate-200/10 dark:border-slate-800/70 dark:bg-slate-900/75">
                    <p className="text-4xl font-black text-slate-900 dark:text-slate-50">{stat.value}</p>
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.1 }} className="rounded-[32px] border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-300/10 dark:border-slate-800 dark:bg-slate-900/80">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 font-semibold mb-4">Featured hiring trends</p>
              <div className="space-y-4">
                {CATEGORIES.slice(0, 4).map((item) => (
                  <div key={item.name} className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/70">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.count}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-blue-600 font-semibold">Featured categories</p>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-100">Jobs handpicked for your next move</h2>
          </div>
          <button onClick={() => navigate('/jobs')} className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800">Browse all jobs</button>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => {
            const Icon = category.icon
            return (
              <Link key={category.name} to={`/jobs?category=${category.name}`} className="group p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm flex flex-col items-center justify-center text-center gap-3 transition-shadow hover:shadow-md">
                <div className={`p-3 rounded-xl border transition-all group-hover:scale-105 ${category.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">{category.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">{category.count}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="bg-slate-50 dark:bg-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {stats.map((item) => (
              <div key={item.label} className="rounded-[28px] border border-slate-200/70 bg-white/80 p-8 shadow-xl shadow-slate-200/10 dark:border-slate-800/75 dark:bg-slate-900/80">
                <p className="text-4xl font-black text-slate-900 dark:text-slate-50">{item.value}</p>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-blue-700 font-semibold">Featured jobs</p>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-100">Top roles from leading teams</h2>
          </div>
          <Link to="/jobs" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline hidden sm:inline-flex">Explore all listings →</Link>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-72 rounded-[32px] bg-slate-200 dark:bg-slate-800 shimmer" />
            ))
          ) : featuredJobs.length > 0 ? (
            featuredJobs.map((job) => <FeaturedJobCard key={job.id} job={job} />)
          ) : (
            <div className="text-center text-slate-400 py-12 font-semibold">No featured vacancies available right now.</div>
          )}
        </div>
      </section>

      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-20">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.35),_transparent_25%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr] items-center">
            <div className="space-y-6">
              <p className="uppercase tracking-[0.35em] text-sm text-slate-200 font-semibold">Trusted by growth teams</p>
              <h2 className="text-4xl font-black leading-tight">Premium companies are hiring with confidence.</h2>
              <p className="max-w-xl text-slate-100/90">Connect to companies investing in design, engineering, marketing, and product talent across remote and hybrid roles.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {COMPANIES.map((company) => (
                  <div key={company.name} className="rounded-3xl bg-white/10 p-5 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center gap-4">
                      <img src={company.logo} alt={company.name} className="h-12 w-12 rounded-2xl object-cover" />
                      <div>
                        <p className="font-semibold text-white">{company.name}</p>
                        <p className="text-sm text-slate-200/80">Hiring now</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[32px] border border-white/15 bg-white/10 p-8 backdrop-blur-xl shadow-2xl shadow-slate-950/10">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-200">What professionals say</p>
              <div className="mt-8 space-y-6">
                {TESTIMONIALS.map((testimonial) => (
                  <div key={testimonial.author} className="rounded-3xl border border-white/10 bg-slate-900/10 p-6">
                    <p className="text-lg font-semibold">“{testimonial.quote}”</p>
                    <div className="mt-5 flex items-center gap-3">
                      <img src={testimonial.avatar} alt={testimonial.author} className="h-12 w-12 rounded-full object-cover ring-1 ring-white/20" />
                      <div>
                        <p className="font-bold">{testimonial.author}</p>
                        <p className="text-sm text-slate-200/80">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-[36px] border border-slate-200/70 bg-white p-10 shadow-2xl shadow-slate-200/10 dark:border-slate-800/75 dark:bg-slate-900/80">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-blue-600 font-semibold">Stay notified</p>
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-100">Join our newsletter for smarter job alerts.</h2>
              <p className="mt-4 text-slate-600 dark:text-slate-300">Weekly market reports, hiring tips, and the freshest roles delivered directly to your inbox.</p>
            </div>
            <form className="flex flex-col gap-4 sm:flex-row">
              <input type="email" placeholder="Enter your email" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              <button className="rounded-3xl bg-blue-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-blue-700">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
