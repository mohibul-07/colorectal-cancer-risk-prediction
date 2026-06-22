import { useEffect, useRef, useState } from "react";

// easeOutCubic — fast start, gentle settle
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

/**
 * Counts a number up from `from` to `target` over `duration` seconds once `start`
 * becomes true. Uses requestAnimationFrame for smooth 60fps interpolation.
 *
 * @param {number} target   final value
 * @param {object} opts
 * @param {number} opts.from      starting value (default 0)
 * @param {number} opts.duration  seconds (default 2)
 * @param {number} opts.decimals  decimal places to render (default 0)
 * @param {boolean} opts.start    begin counting when true (e.g. scrolled into view)
 * @returns {string} formatted current value
 */
export default function useCountUp(target, { from = 0, duration = 2, decimals = 0, start = true } = {}) {
  const [value, setValue] = useState(from);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!start) return;

    const step = (now) => {
      if (startTimeRef.current === null) startTimeRef.current = now;
      const elapsed = (now - startTimeRef.current) / 1000;
      const t = Math.min(elapsed / duration, 1);
      const current = from + (target - from) * easeOut(t);
      setValue(current);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setValue(target);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafRef.current);
      startTimeRef.current = null;
    };
  }, [target, from, duration, start]);

  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
