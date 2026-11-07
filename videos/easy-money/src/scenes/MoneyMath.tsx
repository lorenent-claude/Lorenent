import {AbsoluteFill, Interactive, interpolate, useCurrentFrame} from 'remotion';
import {useEnter, useExit} from '../anim';
import {C, FONT} from '../theme';

const MoneyMathInner = ({
  items,
  pricePerItem,
  note,
}: {
  readonly items: number;
  readonly pricePerItem: number;
  readonly note: string;
}) => {
  const frame = useCurrentFrame();
  const a = useEnter(0);
  const b = useEnter(10);
  const c = useEnter(50);
  const out = useExit();
  const total = items * pricePerItem;
  const value = Math.round(
    interpolate(frame, [18, 70], [0, total], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - (1 - t) ** 3}) / 100,
  ) * 100;
  const fmt = (n: number) => n.toLocaleString('ru-RU').replace(/ /g, ' ');
  return (
    <AbsoluteFill style={{padding: '0 90px', justifyContent: 'center', opacity: out, fontFamily: FONT}}>
      <div style={{...a, color: C.muted, fontSize: 52, fontWeight: 600}}>Пример</div>
      <div style={{...a, color: C.text, fontSize: 84, fontWeight: 800, marginTop: 20}}>
        {items} вещей × {fmt(pricePerItem)} ₽
      </div>
      <div style={{...b, color: C.green, fontSize: 190, fontWeight: 800, marginTop: 30, fontVariantNumeric: 'tabular-nums'}}>
        {fmt(value)} ₽
      </div>
      <p style={{...c, color: C.muted, fontSize: 46, lineHeight: 1.35, marginTop: 30}}>{note}</p>
    </AbsoluteFill>
  );
};

export const MoneyMath = Interactive.create({
  Component: MoneyMathInner,
  layout: 'absolute-fill',
  schema: {
    ...Interactive.backgroundSchema,
    items: {type: 'number', default: 10, description: 'Items', step: 1, hiddenFromList: false},
    pricePerItem: {type: 'number', default: 1500, description: 'Price per item', step: 1, hiddenFromList: false},
    note: {type: 'string', default: '', description: 'Note'},
  },
});
