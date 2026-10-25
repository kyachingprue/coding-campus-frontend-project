import { useState } from 'react'
import { motion } from 'motion/react'
import {
  FiCode,
  FiPlay,
  FiRotateCcw,
  FiZap,
  FiBookOpen,
  FiTerminal,
  FiArrowRight
} from 'react-icons/fi'

const starterCode = `function greetDeveloper(name) {
  const message = \`Hello, \${name}! 🚀\`;

  return message;
}

console.log(greetDeveloper("Coder"));`

const features = [
  {
    icon: FiCode,
    title: 'Write Real Code',
    description:
      'Practice programming directly inside your browser with a distraction-free coding environment.'
  },
  {
    icon: FiTerminal,
    title: 'Instant Output',
    description:
      'Run your code and instantly see the result without leaving your learning environment.'
  },
  {
    icon: FiBookOpen,
    title: 'Learn by Practice',
    description:
      'Turn programming lessons into practical skills by writing code as you learn.'
  }
]

export default function CodeLabFeature() {
  const [code, setCode] = useState(starterCode)
  const [output, setOutput] = useState(
    'Click "Run Code" to see your output here.'
  )
  const [isRunning, setIsRunning] = useState(false)

  const runCode = () => {
    setIsRunning(true)

    setTimeout(() => {
      setOutput('Hello, Coder! 🚀')
      setIsRunning(false)
    }, 700)
  }

  const resetCode = () => {
    setCode(starterCode)
    setOutput('Click "Run Code" to see your output here.')
  }

  const lines = code.split('\n')

  return (
    <section className="relative overflow-hidden bg-black px-4 py-20 sm:px-6 lg:px-8">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
            <FiZap className="text-cyan-400" />
            Interactive Coding Lab
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Learn Programming by{' '}
            <span className="bg-linear-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              Writing Code
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
            Stop watching tutorials and start building. Practice what you learn
            with our interactive coding environment designed for modern
            developers.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          {/* CODE EDITOR */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="min-w-0"
          >
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl shadow-cyan-500/5">
              {/* Editor Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-zinc-900/80 px-4 py-3">
                <div className="flex items-center gap-3">
                  {/* Window Buttons */}
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                  </div>

                  <div className="hidden items-center gap-2 text-xs text-zinc-400 sm:flex">
                    <FiCode className="text-cyan-400" />
                    practice.js
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={resetCode}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
                  >
                    <FiRotateCcw size={13} />
                    Reset
                  </button>

                  <button
                    onClick={runCode}
                    disabled={isRunning}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FiPlay size={13} />
                    {isRunning ? 'Running...' : 'Run Code'}
                  </button>
                </div>
              </div>

              {/* Editor */}
              <div className="overflow-x-auto bg-[#0b0b0d]">
                <div className="flex min-w-full font-mono text-[13px] leading-6 sm:text-sm">
                  {/* Line Numbers */}
                  <div className="select-none border-r border-white/5 bg-zinc-950 px-4 py-5 text-right text-zinc-600">
                    {lines.map((_, index) => (
                      <div key={index}>{index + 1}</div>
                    ))}
                  </div>

                  {/* Code Area */}
                  <textarea
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    spellCheck={false}
                    className="min-h-132 w-full resize-none border-0 bg-transparent px-5 py-5 text-cyan-100 outline-none placeholder:text-zinc-700"
                    aria-label="Code editor"
                  />
                </div>
              </div>

              {/* Terminal */}
              <div className="border-t border-white/10 bg-[#080809]">
                <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2.5 text-xs text-zinc-500">
                  <FiTerminal className="text-cyan-400" />
                  Output
                </div>

                <div className="min-h-18.75 px-4 py-4 font-mono text-xs sm:text-sm">
                  <div className="mb-1 text-zinc-600">$ node practice.js</div>

                  <motion.div
                    key={output}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-400"
                  >
                    {output}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* INFORMATION */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="min-w-0"
          >
            {/* Small Label */}
            <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-cyan-400">
              <span className="h-px w-8 bg-cyan-400" />
              CODE. BUILD. LEARN.
            </div>

            <h3 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
              Your browser is now your{' '}
              <span className="text-zinc-500">coding playground.</span>
            </h3>

            <p className="mt-5 text-sm leading-7 text-zinc-400 sm:text-base">
              Practice JavaScript, React, Python and other programming concepts
              while following your courses. Write code, experiment with ideas
              and build confidence through hands-on learning.
            </p>

            {/* Features */}
            <div className="mt-8 space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon

                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: 0.25 + index * 0.1
                    }}
                    className="group flex gap-4 rounded-xl border border-white/5 bg-white/3 p-4 transition duration-300 hover:border-cyan-400/20 hover:bg-cyan-400/4"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/10 text-cyan-400 transition duration-300 group-hover:scale-110">
                      <Icon size={20} />
                    </div>

                    <div>
                      <h4 className="font-semibold text-white">
                        {feature.title}
                      </h4>

                      <p className="mt-1 text-sm leading-6 text-zinc-500">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <button className="group inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-cyan-400">
                Explore coding courses
                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 grid grid-cols-2 overflow-hidden rounded-2xl border border-white/10 bg-white/2 sm:grid-cols-4"
        >
          {[
            ['50+', 'Programming Lessons'],
            ['20+', 'Coding Challenges'],
            ['10+', 'Tech Skills'],
            ['100%', 'Hands-on Learning']
          ].map(([number, label], index) => (
            <div
              key={label}
              className={`px-4 py-6 text-center ${
                index !== 3
                  ? 'border-b border-white/10 sm:border-b-0 sm:border-r'
                  : ''
              }`}
            >
              <div className="text-2xl font-bold text-white sm:text-3xl">
                {number}
              </div>
              <div className="mt-1 text-xs text-zinc-500 sm:text-sm">
                {label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
