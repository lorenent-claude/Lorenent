import {AbsoluteFill, Interactive} from 'remotion';
import {useEnter} from '../anim';
import {C, FONT} from '../theme';

const OutroInner = ({title, text}: {readonly title: string; readonly text: string}) => {
  const a = useEnter(0);
  const b = useEnter(12);
  return (
    <AbsoluteFill style={{padding: '0 90px', justifyContent: 'center', fontFamily: FONT}}>
      <h2 style={{...a, margin: 0, color: C.text, fontSize: 112, lineHeight: 1.05, fontWeight: 800}}>{title}</h2>
      <p style={{...b, color: C.green, fontSize: 56, lineHeight: 1.3, marginTop: 40, fontWeight: 700}}>{text}</p>
    </AbsoluteFill>
  );
};

export const Outro = Interactive.create({
  Component: OutroInner,
  layout: 'absolute-fill',
  schema: {
    ...Interactive.backgroundSchema,
    title: {type: 'string', default: '', description: 'Title'},
    text: {type: 'string', default: '', description: 'Text'},
  },
});
