import {AbsoluteFill, Interactive} from 'remotion';
import {useEnter, useExit} from '../anim';
import {C, FONT} from '../theme';

const HookInner = ({title, subtitle}: {readonly title: string; readonly subtitle: string}) => {
  const a = useEnter(0);
  const b = useEnter(12);
  const out = useExit();
  return (
    <AbsoluteFill style={{padding: '0 90px', justifyContent: 'center', opacity: out, fontFamily: FONT}}>
      <div style={{...a, color: C.green, fontSize: 44, fontWeight: 700, letterSpacing: 2, marginBottom: 32}}>
        БЕЗ ВЛОЖЕНИЙ
      </div>
      <h1 style={{...a, margin: 0, color: C.text, fontSize: 112, lineHeight: 1.05, fontWeight: 800}}>{title}</h1>
      <p style={{...b, color: C.muted, fontSize: 52, lineHeight: 1.3, marginTop: 40}}>{subtitle}</p>
    </AbsoluteFill>
  );
};

export const Hook = Interactive.create({
  Component: HookInner,
  layout: 'absolute-fill',
  schema: {
    ...Interactive.backgroundSchema,
    title: {type: 'string', default: '', description: 'Title'},
    subtitle: {type: 'string', default: '', description: 'Subtitle'},
  },
});
