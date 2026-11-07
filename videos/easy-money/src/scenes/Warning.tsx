import {AbsoluteFill, Interactive} from 'remotion';
import {useEnter, useExit} from '../anim';
import {C, FONT} from '../theme';

const WarningInner = ({title, text}: {readonly title: string; readonly text: string}) => {
  const a = useEnter(0, 0);
  const b = useEnter(8);
  const c = useEnter(18);
  const out = useExit();
  return (
    <AbsoluteFill style={{padding: '0 90px', justifyContent: 'center', opacity: out, fontFamily: FONT}}>
      <div
        style={{
          opacity: a.opacity,
          transform: `scale(${0.5 + 0.5 * a.opacity})`,
          transformOrigin: 'left center',
          width: 170,
          height: 170,
          borderRadius: 40,
          background: C.red,
          color: 'white',
          fontSize: 120,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 56,
        }}
      >
        !
      </div>
      <h2 style={{...b, margin: 0, color: C.text, fontSize: 96, lineHeight: 1.08, fontWeight: 800}}>{title}</h2>
      <p style={{...c, color: C.muted, fontSize: 52, lineHeight: 1.35, marginTop: 36}}>{text}</p>
    </AbsoluteFill>
  );
};

export const Warning = Interactive.create({
  Component: WarningInner,
  layout: 'absolute-fill',
  schema: {
    ...Interactive.backgroundSchema,
    title: {type: 'string', default: '', description: 'Title'},
    text: {type: 'string', default: '', description: 'Text'},
  },
});
