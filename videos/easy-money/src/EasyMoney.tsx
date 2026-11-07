import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile, Track, useVideoConfig} from 'remotion';
import {Hook} from './scenes/Hook';
import {Listing} from './scenes/Listing';
import {MoneyMath} from './scenes/MoneyMath';
import {Outro} from './scenes/Outro';
import {Step} from './scenes/Step';
import {Warning} from './scenes/Warning';
import {C} from './theme';
import './theme';

export const EasyMoney = () => {
  const {fps} = useVideoConfig();
  return (
    <>
      <AbsoluteFill style={{background: `radial-gradient(circle at 30% 20%, #1d3a32 0%, ${C.bg} 60%)`}} />
      <Track name="Scenes">
        <Hook
          name="Hook"
          durationInFrames={3.5 * fps}
          title="Простой способ заработать уже на этой неделе"
          subtitle="Продай вещи, которыми давно не пользуешься"
        />
        <Step
          name="Step 1 — find"
          from={3.5 * fps}
          durationInFrames={3.5 * fps}
          step={1}
          title="Найди 10 ненужных вещей"
          text="Одежда, техника, книги, детские вещи — всё, чем не пользовался больше года."
          tip="Лучше всего продаются электроника, бренды и детское"
        />
        <Step
          name="Step 2 — photo"
          from={7 * fps}
          durationInFrames={3.5 * fps}
          step={2}
          title="Сфотографируй при дневном свете"
          text="Однотонный фон, 4–6 фото с разных сторон и крупно — бирки и дефекты."
          tip="Хорошие фото — главное, на что смотрит покупатель"
        />
        <Step
          name="Step 3 — price"
          from={10.5 * fps}
          durationInFrames={3.5 * fps}
          step={3}
          title="Поставь честную цену"
          text="Найди такие же вещи на сайтах объявлений и поставь цену на 20–30% ниже."
          tip="Низкая цена = продажа за дни, а не за месяцы"
        />
        <Step
          name="Step 4 — describe"
          from={14 * fps}
          durationInFrames={3.5 * fps}
          step={4}
          title="Опиши как есть"
          text="Размер, состояние, сколько пользовался, все дефекты. Честность экономит время."
          tip="Отвечай на сообщения быстро — первые часы решают"
        />
        <Listing
          name="Listing mockup"
          from={17.5 * fps}
          durationInFrames={5 * fps}
          item="Рубашка мужская, размер 48"
          price="900 ₽"
          message="Здравствуйте! Ещё актуально?"
        />
        <MoneyMath
          name="Money math"
          from={22.5 * fps}
          durationInFrames={4 * fps}
          items={10}
          pricePerItem={1500}
          note="Сумма зависит от вещей. Это разовый доход, а не «пассивный миллион»."
        />
        <Warning
          name="Scam warning"
          from={26.5 * fps}
          durationInFrames={4.5 * fps}
          title="Не попадись мошенникам"
          text="Не переходи по ссылкам «для получения оплаты» и никому не называй код из СМС."
        />
        <Outro
          name="Outro"
          from={31 * fps}
          durationInFrames={3 * fps}
          title="Начни сегодня"
          text="Найди 3 вещи и выложи первое объявление"
        />
      </Track>
      <Track name="Music">
        <Audio name="Background music" src={staticFile('music.mp3')} durationInFrames={34 * fps} volume={0.5} />
      </Track>
    </>
  );
};
