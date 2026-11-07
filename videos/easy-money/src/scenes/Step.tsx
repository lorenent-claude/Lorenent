import {AbsoluteFill, Interactive} from 'remotion';
import {useEnter, useExit} from '../anim';
import {C, FONT} from '../theme';

const StepInner = ({
  step,
  title,
  text,
  tip,
}: {
  readonly step: number;
  readonly title: string;
  readonly text: string;
  readonly tip: string;
}) => {
  const n = useEnter(0, 0);
  const t = useEnter(6);
  const d = useEnter(14);
  const k = useEnter(26);
  const out = useExit();
  return (
    <AbsoluteFill style={{padding: '0 90px', justifyContent: 'center', opacity: out, fontFamily: FONT}}>
      <div
        style={{
          opacity: n.opacity,
          transform: `scale(${0.6 + 0.4 * n.opacity})`,
          transformOrigin: 'left center',
          width: 170,
          height: 170,
          borderRadius: 85,
          background: C.green,
          color: C.bg,
          fontSize: 96,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 56,
        }}
      >
        {step}
      </div>
      <h2 style={{...t, margin: 0, color: C.text, fontSize: 96, lineHeight: 1.08, fontWeight: 800}}>{title}</h2>
      <p style={{...d, color: C.muted, fontSize: 52, lineHeight: 1.35, marginTop: 36}}>{text}</p>
      <div
        style={{
          ...k,
          marginTop: 40,
          padding: '28px 36px',
          borderRadius: 28,
          background: C.card,
          borderLeft: `10px solid ${C.yellow}`,
          color: C.text,
          fontSize: 44,
          lineHeight: 1.3,
          fontWeight: 600,
        }}
      >
        {tip}
      </div>
    </AbsoluteFill>
  );
};

export const Step = Interactive.create({
  Component: StepInner,
  layout: 'absolute-fill',
  schema: {
    ...Interactive.backgroundSchema,
    step: {type: 'number', default: 1, description: 'Step number', step: 1, hiddenFromList: false},
    title: {type: 'string', default: '', description: 'Title'},
    text: {type: 'string', default: '', description: 'Text'},
    tip: {type: 'string', default: '', description: 'Tip'},
  },
});
