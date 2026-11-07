import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

/** Spring-based entrance: returns {opacity, transform} for an element appearing at `delay` frames. */
export const useEnter = (delay = 0, distance = 60) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: {damping: 200}, durationInFrames: 18});
  return {
    opacity: p,
    transform: `translateY(${interpolate(p, [0, 1], [distance, 0])}px)`,
  };
};

/** Fade the whole scene out during its last `frames` frames. */
export const useExit = (frames = 8) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return interpolate(frame, [durationInFrames - frames, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};
