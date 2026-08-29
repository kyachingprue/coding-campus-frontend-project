import { useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import gsap from "gsap";
import {
  SiJavascript, SiPython, SiReact, SiTypescript, SiGo, SiRust,
} from "react-icons/si";

const orbitIcons = [
  { Icon: SiJavascript, color: "#F7DF1E", radius: 190, duration: 22, offset: 0 },
  { Icon: SiPython, color: "#3776AB", radius: 190, duration: 22, offset: 60 },
  { Icon: SiReact, color: "#61DAFB", radius: 190, duration: 22, offset: 120 },
  { Icon: SiTypescript, color: "#3178C6", radius: 190, duration: 22, offset: 180 },
  { Icon: SiGo, color: "#00ADD8", radius: 190, duration: 22, offset: 240 },
  { Icon: SiRust, color: "#DEA584", radius: 190, duration: 22, offset: 300 },
];

export default function Hero() {
  const navigate = useNavigate();
  const btnRef = useRef(null);
  const wrapRef = useRef(null);
  const orbitRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // gentle continuous 3D float for the CTA "keycap"
      gsap.to(btnRef.current, {
        y: -8,
        rotateX: 6,
        duration: 2.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // orbiting badge ring
      gsap.to(orbitRef.current, {
        rotate: 360,
        duration: 34,
        ease: "none",
        repeat: -1,
      });
      // keep each icon upright while the ring spins
      gsap.utils.toArray(".orbit-icon").forEach((el) => {
        gsap.to(el, { rotate: -360, duration: 34, ease: "none", repeat: -1 });
      });

      gsap.fromTo(
        wrapRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }
      );
    });
    return () => ctx.revert();
  }, []);


  const handleClick =()=> {
    gsap.to(btnRef.current, {
      scale: 0.92,
      rotateX: 18,
      duration: 0.12,
      yoyo: true,
      repeat: 1,
      onComplete: () => navigate("/register"),
    });
  }

  return (
    <section className="relative overflow-hidden pb-24 pt-20 sm:pt-28">
      <div className="grid-fade pointer-events-none absolute inset-0 h-150" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-125 w-225 -translate-x-1/2 rounded-full bg-cyan/10 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-4 py-1.5 font-mono text-xs text-mist"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-cyan caret-blink" />6
          languages · 6 frameworks · 6 libraries
        </motion.div>

        <div ref={wrapRef}>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-fog sm:text-6xl">
            Learn to build,
            <br />
            <span className="text-cyan text-glow">line by line.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-mist sm:text-lg">
            Project-based courses in the languages, frameworks, and libraries
            real teams ship with — taught by engineers who actually write the
            code.
          </p>
        </div>

        {/* orbit + 3D CTA */}
        <div className="perspective-1000 relative mx-auto mt-16 flex h-85 items-center justify-center sm:h-105">
          <div
            ref={orbitRef}
            className="pointer-events-none absolute h-85 w-85 sm:h-105 sm:w-105"
          >
            {orbitIcons.map(({ Icon, color, offset }, i) => (
              <div
                key={i}
                className="orbit-icon absolute left-1/2 top-1/2 flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface shadow-lg"
                style={{
                  transform: `rotate(${offset}deg) translate(150px) rotate(${-offset}deg)`
                }}
              >
                <Icon size={20} color={color} />
              </div>
            ))}
          </div>

          <div className="relative group">
            <div className="relative w-64 h-14 opacity-90 overflow-hidden rounded-xl bg-black z-10">
              <div className="absolute z-10 -translate-x-44 group-hover:translate-x-120 ease-in transistion-all duration-700 h-full w-44 bg-linear-to-r from-gray-500 to-white/10 opacity-30 -skew-x-12"></div>

              <div className="absolute flex items-center justify-center text-white z-1 opacity-90 rounded-2xl inset-0.5 bg-black">
                <button
                  name="text"
                  onClick={handleClick}
                  className="input font-semibold text-lg h-full opacity-90 w-full px-16 py-3 rounded-xl bg-black"
                >
                  Get Started
                </button>
              </div>
              <div className="absolute duration-1000 group-hover:animate-spin w-full h-25 bg-linear-to-r from-green-500 to-yellow-500 blur-[30px]"></div>
            </div>
          </div>
        </div>

        <p className="mt-6 font-mono text-xs text-mist">
          No credit card required · Free plan available
        </p>
      </div>
    </section>
  )
}
