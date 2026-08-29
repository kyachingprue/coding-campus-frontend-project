import { useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiCamera,
  FiCheck,
  FiCode,
  FiGithub,
  FiGlobe,
  FiLink,
  FiLinkedin,
  FiMapPin,
  FiPlus,
  FiSave,
  FiTarget,
  FiUser,
  FiX,
  FiZap
} from 'react-icons/fi'
import { FcGraduationCap } from 'react-icons/fc'
import { updateProfile } from '../../features/auth/authSlice'
import { Input, Label } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'

/* Small reusable components */

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
        <Icon size={17} />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-fog">{title}</h2>

        {description && (
          <p className="mt-1 text-xs leading-relaxed text-mist">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

function SocialInput({ icon: Icon, label, id, value, placeholder, onChange }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>

      <div className="relative mt-1.5">
        <Icon
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist"
        />

        <Input
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="pl-9"
        />
      </div>
    </div>
  )
}

function Stat({ value, label }) {
  return (
    <div className="rounded-xl border border-line bg-surface-2/60 px-4 py-3">
      <p className="font-display text-lg font-semibold text-fog">{value}</p>

      <p className="mt-0.5 text-[11px] text-mist">{label}</p>
    </div>
  )
}

/* Default profile */

const DEFAULT_PROFILE = {
  name: '',
  bio: '',

  headline: 'Programming Student',
  location: '',
  education: '',

  profileImage: '',
  bannerImage: '',

  currentFocus: '',
  learningGoal: '',

  skills: ['JavaScript', 'React', 'Node.js'],

  github: '',
  linkedin: '',
  website: '',

  projectName: '',
  projectDescription: '',

  availability: 'Learning & building'
}

/* Image helper */

function readImage(file, callback) {
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('Please select an image file.')
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    alert('Please choose an image smaller than 2MB.')
    return
  }

  const reader = new FileReader()

  reader.onload = () => {
    callback(reader.result)
  }

  reader.readAsDataURL(file)
}

/* Profile */

export default function Profile() {
  const user = useSelector(state => state.auth.user)
  const enrolledIds = useSelector(state => state.courses?.enrolledIds ?? [])

  const dispatch = useDispatch()

  const avatarInputRef = useRef(null)
  const bannerInputRef = useRef(null)

  const [form, setForm] = useState({
    ...DEFAULT_PROFILE,
    ...user,
    name: user?.name || '',
    bio: user?.bio || '',
    profileImage: user?.profileImage || '',
    bannerImage: user?.bannerImage || '',
    skills:
      Array.isArray(user?.skills) && user.skills.length
        ? user.skills
        : DEFAULT_PROFILE.skills
  })

  const [skillInput, setSkillInput] = useState('')
  const [saved, setSaved] = useState(false)

  /* Profile completion */

  const completion = useMemo(() => {
    const fields = [
      form.name,
      form.bio,
      form.headline,
      form.location,
      form.education,
      form.profileImage,
      form.bannerImage,
      form.currentFocus,
      form.github,
      form.linkedin,
      form.website,
      form.projectName,
      form.projectDescription,
      form.skills?.length
    ]

    const completed = fields.filter(Boolean).length

    return Math.round((completed / fields.length) * 100)
  }, [form])

  /* Update form */

  function updateField(key, value) {
    setForm(previous => ({
      ...previous,
      [key]: value
    }))
  }

  /* Add skill */

  function addSkill(e) {
    e?.preventDefault()

    const skill = skillInput.trim()

    if (!skill) return

    const exists = form.skills.some(
      item => item.toLowerCase() === skill.toLowerCase()
    )

    if (exists) {
      setSkillInput('')
      return
    }

    setForm(previous => ({
      ...previous,
      skills: [...previous.skills, skill]
    }))

    setSkillInput('')
  }

  /* Remove skill */

  function removeSkill(skillToRemove) {
    setForm(previous => ({
      ...previous,
      skills: previous.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  /* Avatar upload */

  function handleAvatarUpload(e) {
    const file = e.target.files?.[0]

    readImage(file, image => {
      updateField('profileImage', image)
    })

    e.target.value = ''
  }

  /* Banner upload */

  function handleBannerUpload(e) {
    const file = e.target.files?.[0]

    readImage(file, image => {
      updateField('bannerImage', image)
    })

    e.target.value = ''
  }

  /* Save profile */

  function handleSubmit(e) {
    e.preventDefault()

    dispatch(
      updateProfile({
        name: form.name,
        bio: form.bio,
        headline: form.headline,
        location: form.location,
        education: form.education,

        profileImage: form.profileImage,
        bannerImage: form.bannerImage,

        currentFocus: form.currentFocus,
        learningGoal: form.learningGoal,

        skills: form.skills,

        github: form.github,
        linkedin: form.linkedin,
        website: form.website,

        projectName: form.projectName,
        projectDescription: form.projectDescription,

        availability: form.availability
      })
    )

    setSaved(true)

    setTimeout(() => {
      setSaved(false)
    }, 2000)
  }

  const initials = form.name?.trim()?.[0]?.toUpperCase() || 'U'

  return (
    <div className="mx-auto w-full max-w-5xl space-y-7 pb-12">
      {/* Header */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-fog">
            Profile
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-mist">
            Build your developer profile and show other learners what you're
            learning, building, and working toward.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-mist">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-cyan transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>

          <span>{completion}% complete</span>
        </div>
      </div>

      {/* Developer Profile Preview */}

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Banner */}

          <div className="relative h-44 overflow-hidden sm:h-72">
            {form.bannerImage ? (
              <img
                src={form.bannerImage}
                alt="Profile banner"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-linear-to-br from-cyan/30 via-surface-2 to-cyan/5">
                <div className="h-full w-full opacity-30 bg-[linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] bg-size-[32px_32px]" />
              </div>
            )}

            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />

            <button
              type="button"
              onClick={() => bannerInputRef.current?.click()}
              className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-white backdrop-blur-md transition hover:bg-black/60"
            >
              <FiCamera size={14} />
              Change banner
            </button>

            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBannerUpload}
            />
          </div>

          {/* Profile identity */}

          <div className="relative px-5 pb-5 sm:px-7">
            <div className="-mt-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="relative">
                  {form.profileImage ? (
                    <img
                      src={form.profileImage}
                      alt={form.name || 'Profile'}
                      className="h-28 w-28 rounded-2xl border-4 border-surface object-cover shadow-xl"
                    />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-surface bg-cyan/15 font-display text-4xl font-semibold text-cyan shadow-xl">
                      {initials}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-surface bg-cyan text-ink shadow-lg transition hover:scale-105"
                    aria-label="Change profile picture"
                  >
                    <FiCamera size={15} />
                  </button>

                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </div>

                <div className="pb-1">
                  <h2 className="font-display text-xl font-semibold text-fog">
                    {form.name || 'Your name'}
                  </h2>

                  <p className="mt-0.5 text-sm text-cyan">
                    {form.headline || 'Programming Student'}
                  </p>

                  {form.location && (
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-mist">
                      <FiMapPin size={12} />
                      {form.location}
                    </div>
                  )}
                </div>
              </div>

              {saved && (
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-cyan/10 px-3 py-1.5 text-xs font-medium text-cyan">
                  <FiCheck size={13} />
                  Profile saved
                </span>
              )}
            </div>

            {/* Stats */}

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat value={enrolledIds.length} label="Courses enrolled" />

              <Stat value={form.skills?.length || 0} label="Skills" />

              <Stat
                value={form.projectName ? '1' : '0'}
                label="Featured project"
              />

              <Stat value={`${completion}%`} label="Profile complete" />
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Basic Information */}

        <Card>
          <CardContent>
            <SectionHeader
              icon={FiUser}
              title="Basic information"
              description="Tell other learners who you are and what you do."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Display name</Label>

                <Input
                  id="name"
                  value={form.name}
                  onChange={e => updateField('name', e.target.value)}
                  placeholder="Your name"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="headline">Developer headline</Label>

                <Input
                  id="headline"
                  value={form.headline}
                  onChange={e => updateField('headline', e.target.value)}
                  placeholder="Frontend Developer • Programming Student"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>

                <div className="relative mt-1.5">
                  <FiMapPin
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-mist"
                  />

                  <Input
                    id="location"
                    value={form.location}
                    onChange={e => updateField('location', e.target.value)}
                    placeholder="Chattogram, Bangladesh"
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="education">Education</Label>

                <div className="relative mt-1.5">
                  <FcGraduationCap
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-mist"
                  />

                  <Input
                    id="education"
                    value={form.education}
                    onChange={e => updateField('education', e.target.value)}
                    placeholder="B.B.S • National University"
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="mt-1.5 opacity-50"
              />

              <p className="mt-1.5 text-[11px] text-mist">
                Email is managed by your account authentication.
              </p>
            </div>

            <div className="mt-5">
              <Label htmlFor="bio">About me</Label>

              <textarea
                id="bio"
                rows={4}
                maxLength={300}
                value={form.bio}
                onChange={e => updateField('bio', e.target.value)}
                placeholder="I'm a programming student focused on building modern web applications..."
                className="mt-1.5 flex w-full resize-none rounded-lg border border-line bg-surface-2 px-4 py-3 text-sm text-fog placeholder:text-mist/60 outline-none transition-colors focus:border-cyan/60 focus:ring-2 focus:ring-cyan/20"
              />

              <p className="mt-1 text-right text-[10px] text-mist">
                {form.bio.length}/300
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Learning Profile */}

        <Card>
          <CardContent>
            <SectionHeader
              icon={FiTarget}
              title="Learning profile"
              description="Show what you're currently learning and where you want to go next."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="currentFocus">Currently learning</Label>

                <Input
                  id="currentFocus"
                  value={form.currentFocus}
                  onChange={e => updateField('currentFocus', e.target.value)}
                  placeholder="Next.js, TypeScript, PostgreSQL..."
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="learningGoal">Learning goal</Label>

                <Input
                  id="learningGoal"
                  value={form.learningGoal}
                  onChange={e => updateField('learningGoal', e.target.value)}
                  placeholder="Become a Full-Stack Developer"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="mt-5">
              <Label htmlFor="availability">Current status</Label>

              <select
                id="availability"
                value={form.availability}
                onChange={e => updateField('availability', e.target.value)}
                className="mt-1.5 flex h-10 w-full rounded-lg border border-line bg-surface-2 px-3 text-sm text-fog outline-none focus:border-cyan/60 sm:w-80"
              >
                <option value="Learning & building">Learning & building</option>

                <option value="Open to internships">Open to internships</option>

                <option value="Open to freelance">Open to freelance</option>

                <option value="Open to opportunities">
                  Open to opportunities
                </option>

                <option value="Not currently available">
                  Not currently available
                </option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}

        <Card>
          <CardContent>
            <SectionHeader
              icon={FiCode}
              title="Skills & technologies"
              description="Add the technologies you're learning or comfortable working with."
            />

            <div className="flex flex-wrap gap-2">
              {form.skills.map(skill => (
                <span
                  key={skill}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-cyan/20 bg-cyan/5 px-3 py-1.5 text-xs font-medium text-cyan"
                >
                  {skill}

                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="rounded-full p-0.5 text-cyan/60 transition hover:bg-cyan/10 hover:text-cyan"
                    aria-label={`Remove ${skill}`}
                  >
                    <FiX size={12} />
                  </button>
                </span>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <Input
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    addSkill(e)
                  }
                }}
                placeholder="Add skill e.g. React"
              />

              <Button type="button" variant="outline" onClick={addSkill}>
                <FiPlus size={14} />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/*  Developer Links */}

        <Card>
          <CardContent>
            <SectionHeader
              icon={FiLink}
              title="Developer links"
              description="Connect your coding profiles and portfolio."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <SocialInput
                icon={FiGithub}
                label="GitHub"
                id="github"
                value={form.github}
                onChange={e => updateField('github', e.target.value)}
                placeholder="https://github.com/username"
              />

              <SocialInput
                icon={FiLinkedin}
                label="LinkedIn"
                id="linkedin"
                value={form.linkedin}
                onChange={e => updateField('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />

              <SocialInput
                icon={FiGlobe}
                label="Portfolio"
                id="website"
                value={form.website}
                onChange={e => updateField('website', e.target.value)}
                placeholder="https://yourportfolio.com"
              />
            </div>
          </CardContent>
        </Card>

        {/*  Featured Project */}

        <Card>
          <CardContent>
            <SectionHeader
              icon={FiBriefcase}
              title="Featured project"
              description="Showcase something you've built while learning."
            />

            <div className="space-y-5">
              <div>
                <Label htmlFor="projectName">Project name</Label>

                <Input
                  id="projectName"
                  value={form.projectName}
                  onChange={e => updateField('projectName', e.target.value)}
                  placeholder="CodeForge Learning Platform"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="projectDescription">Project description</Label>

                <textarea
                  id="projectDescription"
                  rows={4}
                  value={form.projectDescription}
                  onChange={e =>
                    updateField('projectDescription', e.target.value)
                  }
                  placeholder="A full-stack learning platform built with React, Redux, Node.js..."
                  className="mt-1.5 flex w-full resize-none rounded-lg border border-line bg-surface-2 px-4 py-3 text-sm text-fog placeholder:text-mist/60 outline-none transition-colors focus:border-cyan/60 focus:ring-2 focus:ring-cyan/20"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}

        <Card>
          <CardContent>
            <SectionHeader
              icon={FiAward}
              title="Developer milestones"
              description="Your learning profile can grow as you complete more courses and projects."
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-line bg-surface-2/50 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
                  <FiBookOpen size={17} />
                </div>

                <p className="mt-4 text-sm font-semibold text-fog">
                  Learning streak
                </p>

                <p className="mt-1 text-xs text-mist">
                  Keep learning every day to build your streak.
                </p>
              </div>

              <div className="rounded-xl border border-line bg-surface-2/50 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
                  <FiCode size={17} />
                </div>

                <p className="mt-4 text-sm font-semibold text-fog">Builder</p>

                <p className="mt-1 text-xs text-mist">
                  Add projects to showcase your development journey.
                </p>
              </div>

              <div className="rounded-xl border border-line bg-surface-2/50 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
                  <FiZap size={17} />
                </div>

                <p className="mt-4 text-sm font-semibold text-fog">
                  Consistent learner
                </p>

                <p className="mt-1 text-xs text-mist">
                  Complete courses and lessons to unlock milestones.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save */}

        <div className="sticky bottom-4 z-20 flex items-center justify-between gap-4 rounded-xl border border-line bg-[#0d131b]/95 p-3 shadow-2xl backdrop-blur-xl">
          <div className="hidden items-center gap-2 text-xs text-mist sm:flex">
            <FiCheck size={14} className="text-cyan" />
            Your profile changes are saved to your account.
          </div>

          <Button type="submit" className="ml-auto">
            {saved ? (
              <>
                <FiCheck size={15} />
                Saved
              </>
            ) : (
              <>
                <FiSave size={15} />
                Save profile
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
