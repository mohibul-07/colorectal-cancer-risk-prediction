import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import useCountUp from "../hooks/useCountUp";

/**
 * A hero stat card. If `value` is a number it counts up (from `from` to `value`)
 * once scrolled into view. If `display` is provided, that static string is shown
 * instead (used for non-numeric stats like a range).
 */
export default function AnimatedStat({
  value,
  from = 0,
  duration = 2,
  decimals = 0,
  prefix = "",
  suffix = "",
  display,
  label,
  sub,
  delay = 0,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const counted = useCountUp(value ?? 0, { from, duration, decimals, start: inView && display === undefined });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-5 text-center border border-white/20"
      style={{ willChange: "transform, opacity" }}
    >
      <div className="text-5xl font-bold text-white tabular-nums">
        {display !== undefined ? display : `${prefix}${counted}${suffix}`}
      </div>
      <div className="text-sm font-semibold text-indigo-200 mt-1 uppercase tracking-wider">{label}</div>
      {sub && <div className="text-xs text-indigo-300 mt-0.5">{sub}</div>}
    </motion.div>
  );
}
