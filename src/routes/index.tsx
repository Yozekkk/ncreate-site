import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownRight,
  Blocks,
  Compass,
  MessageCircle,
  Play,
  Send,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { COMING_SOON, getSettings } from "../lib";
import { PlayDialog, Reveal, SiteShell } from "../ui";

export const Route = createFileRoute("/")({ component: Home });

type FeatureCard =
  | {
      kind: "image";
      name: string;
      alt: string;
      src: string;
      srcSet: string;
      width: number;
      height: number;
    }
  | { kind: "icon"; name: string; icon: LucideIcon };

const cards: FeatureCard[] = [
  {
    kind: "image",
    name: "soldier",
    alt: "Синий Minecraft-персонаж в броне с оружием",
    src: "/images/ncreate/server-card-soldier.webp",
    srcSet:
      "/images/ncreate/server-card-soldier-560.webp 560w, /images/ncreate/server-card-soldier.webp 1102w",
    width: 1102,
    height: 1368,
  },
  {
    kind: "image",
    name: "engineer",
    alt: "Оранжевый Minecraft-инженер с оборудованием",
    src: "/images/ncreate/server-card-engineer.webp",
    srcSet:
      "/images/ncreate/server-card-engineer-840.webp 840w, /images/ncreate/server-card-engineer.webp 1672w",
    width: 1672,
    height: 941,
  },
  { kind: "icon", name: "blocks", icon: Blocks },
  { kind: "icon", name: "compass", icon: Compass },
];

function Home() {
  const { data: s } = useQuery({ queryKey: ["settings"], queryFn: getSettings });
  const dialog = useRef<HTMLDialogElement>(null);
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const play = () => dialog.current?.showModal();
  const title = s?.hero_title ?? "Создавай. Развивай. Играй в NCreate.";

  return (
    <SiteShell>
      <section className="hero" ref={hero}>
        <div className="hero-copy">
          <motion.p className="eyebrow" initial={{ y: 12 }} animate={{ y: 0 }}>
            НОВАЯ МАСТЕРСКАЯ
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72 }}
          >
            {title.split(" ").map((word, index) => (
              <span key={`${word}-${index}`}>{word} </span>
            ))}
          </motion.h1>
          <p className="hero-subtitle">{s?.hero_subtitle ?? COMING_SOON}</p>
          <div className="hero-actions">
            <button className="primary-button large" onClick={play}>
              <Play aria-hidden />
              Начать играть
            </button>
            <a className="round-arrow" href="#server" aria-label="Перейти к информации о сервере">
              <ArrowDownRight aria-hidden />
            </a>
          </div>
        </div>
        <motion.div className="hero-art" style={{ y }}>
          <div className="hero-panel panel-one" />
          <div className="hero-panel panel-two" />
          <div className="hero-panel panel-three" />
          <div className="pixel-spark spark-one" />
          <div className="pixel-spark spark-two" />
          <div className="pixel-spark spark-three" />
          <motion.img
            className="hero-mascot"
            src="/images/ncreate/mascot-front.webp"
            srcSet="/images/ncreate/mascot-front-640.webp 640w, /images/ncreate/mascot-front.webp 760w"
            sizes="(max-width: 820px) 90vw, 560px"
            width="760"
            height="1199"
            alt="Официальный маскот NCreate"
            fetchPriority="high"
            initial={{ opacity: 0, scale: 0.94, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
          />
        </motion.div>
      </section>

      <section className="stats-section" aria-label="Статистика сервера">
        {[
          ["Игроков в сети", s?.online_players ?? 0],
          ["Рекорд дня", s?.record_players ?? 0],
          ["Всего с нами", s?.total_players ?? 0],
        ].map(([label, value]) => (
          <div className="stat" key={String(label)}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="dark-stage" id="server">
        <Reveal className="stage-heading">
          <h2 className="sr-only">NCreate</h2>
          <img
            src="/images/voxel/ncreate-title-new.webp"
            srcSet="/images/voxel/ncreate-title-new-640.webp 640w, /images/voxel/ncreate-title-new.webp 1594w"
            sizes="(max-width: 820px) calc(100vw - 28px), 1100px"
            width="1594"
            height="398"
            alt="Объёмный заголовок NCREATE СЕРВЕР"
            loading="lazy"
          />
          <p>На сервере {s?.online_players ?? 0} игроков</p>
        </Reveal>
        <div className="feature-cards">
          {cards.map((card, index) => (
            <Reveal className={`feature-card card-${index + 1}`} key={card.name}>
              {card.kind === "image" ? (
                <motion.img
                  className="feature-card-art"
                  src={card.src}
                  srcSet={card.srcSet}
                  sizes="(max-width: 820px) calc(100vw - 68px), 310px"
                  width={card.width}
                  height={card.height}
                  alt={card.alt}
                  loading="lazy"
                  whileHover={{ y: -8, rotate: index % 2 ? 1.5 : -1.5 }}
                />
              ) : (
                <motion.div
                  className="feature-icon-art"
                  aria-hidden="true"
                  whileHover={{ y: -8, rotate: index % 2 ? 1.5 : -1.5 }}
                >
                  <card.icon />
                </motion.div>
              )}
              <div className="feature-card-copy">
                <span>0{index + 1}</span>
                <h3>{COMING_SOON}</h3>
                <p>Информация появится позже</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="workshop-section">
        <Reveal className="section-intro">
          <p className="eyebrow">NCREATE / 02</p>
          <h2>
            Всё начинается
            <br />с идеи
          </h2>
          <p>{COMING_SOON}</p>
        </Reveal>
        <div className="workshop-grid">
          <Reveal className="workshop-copy">
            <span className="number-chip">00</span>
            <h3>{COMING_SOON}</h3>
            <p>Информация появится позже</p>
            <div className="fake-meter">
              <i />
            </div>
          </Reveal>
          <Reveal className="workshop-visual">
            <div className="orange-orbit" />
            <div className="workshop-brand-art" aria-hidden="true">
              <Blocks />
              <img
                src="/images/brand/ncreate-logo.webp"
                width="500"
                height="500"
                loading="lazy"
                alt=""
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="play-section">
        <Reveal className="play-content">
          <p className="eyebrow">ТВОЯ СЛЕДУЮЩАЯ ИГРА</p>
          <h2>
            Начать
            <br />играть
          </h2>
          <p>{COMING_SOON}</p>
          <button className="light-button" onClick={play}>
            <Play aria-hidden />
            Начать играть
          </button>
        </Reveal>
        <img
          className="play-mascot"
          src="/images/ncreate/mascot-back.webp"
          srcSet="/images/ncreate/mascot-back-480.webp 480w, /images/ncreate/mascot-back.webp 552w"
          sizes="(max-width: 820px) 78vw, 520px"
          width="552"
          height="1199"
          loading="lazy"
          alt="Официальный маскот NCreate, вид сзади"
        />
      </section>

      <section className="social-section">
        <Reveal className="section-intro light">
          <p className="eyebrow">СООБЩЕСТВО</p>
          <h2>
            Подключайся
            <br />к нам
          </h2>
        </Reveal>
        <div className="social-grid">
          {[
            { name: "Telegram", icon: Send },
            { name: "Discord", icon: MessageCircle },
            { name: "YouTube", icon: Youtube },
          ].map(({ name, icon: Icon }, index) => (
            <article className={`social-card social-${index + 1}`} aria-disabled="true" key={name}>
              <Icon aria-hidden />
              <span>{name}</span>
              <strong>{COMING_SOON}</strong>
            </article>
          ))}
        </div>
      </section>
      <PlayDialog ref={dialog} />
    </SiteShell>
  );
}
