import { useEffect, useState } from 'react'
import {
  FiBell,
  FiBookOpen,
  FiCheck,
  FiChevronDown,
  FiClock,
  FiEye,
  FiGlobe,
  FiLock,
  FiMail,
  FiMoon,
  FiRefreshCw,
  FiShield,
  FiTrash2,
  FiUser,
  FiUsers,
  FiZap
} from 'react-icons/fi'

import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'

/* Toggle */

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full border transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-cyan/20 ${
        checked ? 'border-cyan bg-cyan' : 'border-line bg-[#1a222d]'
      }`}
    >
      <span
        className={`absolute left-0.5 top-1 h-5 w-5 rounded-full shadow-md transition-transform duration-200 ease-out ${
          checked ? 'translate-x-5 bg-white' : 'translate-x-0 bg-slate-300'
        }`}
      />
    </button>
  )
}

/* Settings Section */

function SettingsSection({ icon: Icon, title, description, children }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="border-b border-line px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
              <Icon size={17} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-fog">{title}</h2>

              <p className="mt-1 text-xs leading-relaxed text-mist">
                {description}
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-line px-5 sm:px-6">{children}</div>
      </CardContent>
    </Card>
  )
}

/* Toggle Row */

function ToggleRow({ icon: Icon, label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-5 py-4">
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/3 text-mist">
            <Icon size={15} />
          </div>
        )}

        <div className="min-w-0">
          <p className="text-sm font-medium text-fog">{label}</p>

          <p className="mt-0.5 text-xs leading-relaxed text-mist">
            {description}
          </p>
        </div>
      </div>

      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}

/* Select Row */

function SelectRow({
  icon: Icon,
  label,
  description,
  value,
  onChange,
  options
}) {
  return (
    <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/3 text-mist">
            <Icon size={15} />
          </div>
        )}

        <div>
          <p className="text-sm font-medium text-fog">{label}</p>

          <p className="mt-0.5 text-xs leading-relaxed text-mist">
            {description}
          </p>
        </div>
      </div>

      <div className="relative shrink-0">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-line bg-[#111821] py-2 pl-3 pr-9 text-xs font-medium text-fog outline-none transition-colors hover:border-mist/40 focus:border-cyan/50 sm:w-40"
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <FiChevronDown
          size={14}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-mist"
        />
      </div>
    </div>
  )
}

/* Settings */

const DEFAULT_SETTINGS = {
  /* Notifications */
  courseReminders: true,
  weeklyDigest: true,
  productAnnouncements: false,
  emailNotifications: true,

  /* Learning */
  autoPlayNextLesson: true,
  showCompletedLessons: true,
  dailyGoal: '30',

  /* Appearance */
  theme: 'dark',
  compactMode: false,

  /* Privacy */
  profileVisibility: true,
  showLearningProgress: false,
  showCompletedCourses: true,

  /* Security */
  loginAlerts: true
}

function getInitialSettings() {
  try {
    const saved = localStorage.getItem('codeforge_settings')

    if (!saved) {
      return DEFAULT_SETTINGS
    }

    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(saved)
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export default function Settings() {
  const [settings, setSettings] = useState(getInitialSettings)

  const [saved, setSaved] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  /* Save settings automatically */

  useEffect(() => {
    try {
      localStorage.setItem('codeforge_settings', JSON.stringify(settings))

      setSaved(true)

      const timer = setTimeout(() => {
        setSaved(false)
      }, 1500)

      return () => clearTimeout(timer)
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }, [settings])

  /* Update one setting */

  const updateSetting = (key, value) => {
    setSettings(previous => ({
      ...previous,
      [key]: value
    }))
  }

  /* Reset settings */

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
  }

  /* Delete account */

  const handleDeleteAccount = () => {
    /*
      Real-world project:

      Here you would call your backend API:

      await deleteAccount();

      Then:
      - logout user
      - clear auth state
      - clear user data
      - redirect to login page

      For now, we only clear local CodeForge data.
    */

    localStorage.removeItem('codeforge_settings')
    localStorage.removeItem('codeforge_enrolled')

    setSettings(DEFAULT_SETTINGS)
    setShowDeleteModal(false)

    alert('Your local CodeForge data has been removed.')
  }

  return (
    <>
      <div className="mx-auto w-full max-w-3xl space-y-7 pb-10">
        {/* Header */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-semibold text-fog">
                Settings
              </h1>

              {saved && (
                <span className="inline-flex items-center gap-1 rounded-full bg-cyan/10 px-2 py-1 text-[10px] font-medium text-cyan">
                  <FiCheck size={11} />
                  Saved
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-mist">
              Customize your learning experience, notifications, privacy, and
              account preferences.
            </p>
          </div>

          <button
            type="button"
            onClick={resetSettings}
            className="inline-flex w-fit items-center gap-2 text-xs font-medium text-mist transition-colors hover:text-fog"
          >
            <FiRefreshCw size={13} />
            Reset settings
          </button>
        </div>

        {/* Notifications */}

        <SettingsSection
          icon={FiBell}
          title="Notifications"
          description="Choose which updates and learning reminders you want to receive."
        >
          <ToggleRow
            icon={FiBookOpen}
            label="Course reminders"
            description="Get notified when a new lesson unlocks."
            checked={settings.courseReminders}
            onChange={value => updateSetting('courseReminders', value)}
          />

          <ToggleRow
            icon={FiClock}
            label="Weekly digest"
            description="Receive a short recap of your learning progress every Monday."
            checked={settings.weeklyDigest}
            onChange={value => updateSetting('weeklyDigest', value)}
          />

          <ToggleRow
            icon={FiZap}
            label="Product announcements"
            description="Stay informed about new tracks, features, and platform events."
            checked={settings.productAnnouncements}
            onChange={value => updateSetting('productAnnouncements', value)}
          />

          <ToggleRow
            icon={FiMail}
            label="Email notifications"
            description="Allow CodeForge to send important account and learning emails."
            checked={settings.emailNotifications}
            onChange={value => updateSetting('emailNotifications', value)}
          />
        </SettingsSection>

        {/* Learning */}

        <SettingsSection
          icon={FiBookOpen}
          title="Learning preferences"
          description="Personalize how lessons and your learning progress are displayed."
        >
          <ToggleRow
            icon={FiZap}
            label="Auto-play next lesson"
            description="Automatically start the next lesson when the current lesson finishes."
            checked={settings.autoPlayNextLesson}
            onChange={value => updateSetting('autoPlayNextLesson', value)}
          />

          <ToggleRow
            icon={FiCheck}
            label="Show completed lessons"
            description="Keep completed lessons visible in your course curriculum."
            checked={settings.showCompletedLessons}
            onChange={value => updateSetting('showCompletedLessons', value)}
          />

          <SelectRow
            icon={FiClock}
            label="Daily learning goal"
            description="Set the amount of time you want to study each day."
            value={settings.dailyGoal}
            onChange={value => updateSetting('dailyGoal', value)}
            options={[
              { value: '15', label: '15 minutes' },
              { value: '30', label: '30 minutes' },
              { value: '45', label: '45 minutes' },
              { value: '60', label: '1 hour' },
              { value: '90', label: '1.5 hours' },
              { value: '120', label: '2 hours' }
            ]}
          />
        </SettingsSection>

        {/* Appearance */}

        <SettingsSection
          icon={FiMoon}
          title="Appearance"
          description="Control the visual experience of your CodeForge dashboard."
        >
          <SelectRow
            icon={FiMoon}
            label="Theme"
            description="Choose the appearance you prefer."
            value={settings.theme}
            onChange={value => updateSetting('theme', value)}
            options={[
              { value: 'dark', label: 'Dark' },
              { value: 'light', label: 'Light' },
              { value: 'system', label: 'System' }
            ]}
          />

          <ToggleRow
            icon={FiGlobe}
            label="Compact mode"
            description="Use a denser layout to display more content on screen."
            checked={settings.compactMode}
            onChange={value => updateSetting('compactMode', value)}
          />
        </SettingsSection>

        {/* Privacy */}

        <SettingsSection
          icon={FiShield}
          title="Privacy"
          description="Control what other learners can see about your profile and progress."
        >
          <ToggleRow
            icon={FiUser}
            label="Profile visibility"
            description="Allow other learners to view your public profile."
            checked={settings.profileVisibility}
            onChange={value => updateSetting('profileVisibility', value)}
          />

          <ToggleRow
            icon={FiEye}
            label="Show learning progress"
            description="Allow others to see your course progress and achievements."
            checked={settings.showLearningProgress}
            onChange={value => updateSetting('showLearningProgress', value)}
          />

          <ToggleRow
            icon={FiBookOpen}
            label="Show completed courses"
            description="Display your completed courses on your public profile."
            checked={settings.showCompletedCourses}
            onChange={value => updateSetting('showCompletedCourses', value)}
          />
        </SettingsSection>

        {/* Security */}

        <SettingsSection
          icon={FiLock}
          title="Security"
          description="Manage account security and login activity."
        >
          <ToggleRow
            icon={FiShield}
            label="Login alerts"
            description="Receive an alert when your account is accessed from a new device."
            checked={settings.loginAlerts}
            onChange={value => updateSetting('loginAlerts', value)}
          />

          <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/3 text-mist">
                <FiLock size={15} />
              </div>

              <div>
                <p className="text-sm font-medium text-fog">Password</p>

                <p className="mt-0.5 text-xs text-mist">
                  Update your account password regularly.
                </p>
              </div>
            </div>

            <Button variant="outline" size="sm" type="button">
              Change password
            </Button>
          </div>

          <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/3 text-mist">
                <FiUsers size={15} />
              </div>

              <div>
                <p className="text-sm font-medium text-fog">Active sessions</p>

                <p className="mt-0.5 text-xs text-mist">
                  Review devices currently signed into your account.
                </p>
              </div>
            </div>

            <Button variant="outline" size="sm" type="button">
              Manage sessions
            </Button>
          </div>
        </SettingsSection>

        {/* Danger Zone */}

        <Card className="border-coral/40 bg-coral/2">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-coral/10 text-coral">
                <FiTrash2 size={17} />
              </div>

              <div>
                <p className="text-sm font-semibold text-fog">Danger zone</p>

                <p className="mt-1 text-xs leading-relaxed text-mist">
                  Deleting your account permanently removes your profile,
                  enrollments, learning progress, and account data. This action
                  cannot be undone.
                </p>
              </div>
            </div>

            <Button
              variant="danger"
              size="sm"
              type="button"
              className="mt-5"
              onClick={() => setShowDeleteModal(true)}
            >
              <FiTrash2 size={14} />
              Delete account
            </Button>
          </CardContent>
        </Card>

        {/* Footer information */}

        <div className="flex items-center justify-between border-t border-line pt-5 text-[11px] text-mist">
          <span>CodeForge Settings</span>

          <span>Preferences are saved automatically</span>
        </div>
      </div>

      {/*  Delete Confirmation Modal */}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-line bg-[#10161e] shadow-2xl">
            <div className="p-5 sm:p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-coral/10 text-coral">
                <FiTrash2 size={20} />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-fog">
                Delete your account?
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-mist">
                This action will permanently remove your local CodeForge
                settings, enrollments, and learning progress. You won't be able
                to undo this action.
              </p>

              <div className="mt-5 rounded-lg border border-coral/20 bg-coral/4 p-3">
                <p className="text-xs leading-relaxed text-coral">
                  Please make sure you really want to delete your account before
                  continuing.
                </p>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  type="button"
                  onClick={handleDeleteAccount}
                >
                  <FiTrash2 size={14} />
                  Delete account
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
