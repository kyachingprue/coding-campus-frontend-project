import { useState } from "react";
import { FiCheck, FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import { Input, Label } from "../ui/input";

const requirements = [
  { label: "8 characters", test: (value: string) => value.length >= 8 },
  { label: "Uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { label: "Lowercase letter", test: (value: string) => /[a-z]/.test(value) },
  { label: "Number", test: (value: string) => /\d/.test(value) },
];

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  showRequirements?: boolean;
  showLabel?: boolean;
  autoComplete?: "current-password" | "new-password";
}

export function isStrongPassword(value: string) {
  return requirements.every(({ test }) => test(value)) && value.length <= 128;
}

export function PasswordField({
  value,
  onChange,
  showRequirements = true,
  showLabel = true,
  autoComplete = "current-password",
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      {showLabel && <Label htmlFor="password">Password</Label>}
      <div className="relative">
        <FiLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mist" size={16} />
        <Input
          id="password"
          type={visible ? "text" : "password"}
          required
          minLength={8}
          maxLength={128}
          autoComplete={autoComplete}
          className="pl-10 pr-11"
          placeholder="Enter your password"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-describedby={showRequirements ? "password-requirements" : undefined}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-mist transition-colors hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? <FiEyeOff size={17} /> : <FiEye size={17} />}
        </button>
      </div>
      {showRequirements && (
        <div id="password-requirements" className="mt-3 rounded-lg border border-line bg-surface-2/70 p-3">
          <p className="mb-2 text-xs font-medium text-mist">Password should include</p>
          <ul className="grid grid-cols-2 gap-x-2 gap-y-1.5">
            {requirements.map(({ label, test }) => {
              const met = test(value);
              return (
                <li key={label} className={`flex items-center gap-1.5 text-xs ${met ? "text-cyan" : "text-mist"}`}>
                  <FiCheck size={13} className={met ? "opacity-100" : "opacity-40"} aria-hidden="true" />
                  {label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
