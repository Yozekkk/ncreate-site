import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownRight,
  Download,
  MessageCircle,
  Play,
  Send,
  Youtube,
} from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { COMING_SOON, getHomeContent, getSettings } from "../lib";
import { launcherDownloads, launcherReleaseUrl } from "../launcher-release";
import { PlayDialog, Reveal, SiteShell } from "../ui";

export const Route = createFileRoute("/")({ component: Home });

type FeatureCard = {
  name: string;
  alt: string;
  src: string;
  width: number;
  height: number;
};

const cards: FeatureCard[] = [
  {
    name: "adventure", alt: "Осеннее приключение в мире Minecraft", src: "/images/seasonal/october-adventure.webp", width: 736, height: 370,
  },
  {
    name: "pumpkins", alt: "Светящиеся кубические тыквы", src: "/images/seasonal/october-pumpkins.webp", width: 1200, height: 600,
  },
  {
    name: "lantern", alt: "Осенний персонаж с фонарём", src: "/images/seasonal/october-lantern.webp", width: 1381, height: 1139,
  },
  {
    name: "creature", alt: "Мистическое лесное существо", src: "/images/seasonal/october-creature.webp", width: 1536, height: 1024,
  },
];

function Home() {
  const { data: s } = useQuery({ queryKey: ["settings"], queryFn: getSettings });
  const { data: homeContent } = useQuery({ queryKey: ["home-content"], queryFn: getHomeContent });
  const dialog = useRef<HTMLDialogElement>(null);
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const play = () => dialog.current?.showModal();
  const title = s?.hero_title ?? "Создавай. Развивай. Играй в NCreate.";
  const cardSection = homeContent?.sections.find(section => section.section_key === "server") ?? homeContent?.sections[0];
  const publicCards = homeContent?.cards.filter(card => card.section_id === cardSection?.id) ?? [];
  const otherSections = homeContent?.sections.filter(section => section.id !== cardSection?.id) ?? [];
  const visibleCards = publicCards.length
    ? publicCards.map((card, index) => ({
        name: String(card.id),
        alt: card.title,
        src: card.image_url || cards[index % cards.length].src,
        width: 736,
        height: 414,
        title: card.title,
        description: card.description ?? "Информация появится позже",
      }))
    : cards.map(card => ({
        ...card,
        title: COMING_SOON,
        description: "Информация появится позже",
      }));

  return (
    <SiteShell>
      <section className="hero" ref={hero}>
        <div className="hero-copy">
          <motion.p className="eyebrow october-kicker" initial={{ y: 12 }} animate={{ y: 0 }}>
            ОКТЯБРЬ В NCREATE · СЕЗОН ТАЙН
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
        <motion.div className="hero-art october-hero-art" style={{ y }}>
          <div className="hero-panel panel-one" />
          <div className="hero-panel panel-two" />
          <div className="hero-panel panel-three" />
          <div className="pixel-spark spark-one" />
          <div className="pixel-spark spark-two" />
          <div className="pixel-spark spark-three" />
          <motion.img
            className="hero-mascot"
            src="/images/seasonal/october-campfire.webp"
            width="1312"
            height="1199"
            alt="Персонажи Minecraft у осеннего костра"
            fetchPriority="high"
            initial={{ opacity: 0, scale: 0.94, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
          />
        </motion.div>
      </section>

      <section className="stats-section" aria-label="Статистика сервера">
        {[
          ["Средний онлайн", s?.average_online == null ? "—" : s.average_online.toLocaleString("ru-RU")],
          ["Аптайм сервера", s?.uptime_percent == null ? "—" : `${s.uptime_percent.toLocaleString("ru-RU", { maximumFractionDigits: 2 })}%`],
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
          {cardSection?.title && <h3 className="stage-dynamic-title">{cardSection.title}</h3>}
          <p>{cardSection?.subtitle ?? "Октябрь приносит новые истории, тайны и приключения"}</p>
        </Reveal>
        <div className="feature-cards">
          {visibleCards.map((card, index) => (
            <Reveal className={`feature-card card-${index + 1}`} key={card.name}>
              <motion.img
                className="feature-card-art"
                src={card.src}
                sizes="(max-width: 820px) calc(100vw - 68px), 310px"
                width={card.width}
                height={card.height}
                alt={card.alt}
                loading="lazy"
                whileHover={{ y: -8, rotate: index % 2 ? 1.5 : -1.5 }}
              />
              <div className="feature-card-copy">
                <span>0{index + 1}</span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
        {otherSections.map(section => (
          <div className="published-section" key={section.id}>
            <h2>{section.title ?? section.section_key}</h2>
            {section.subtitle && <p>{section.subtitle}</p>}
            <div className="published-cards">
              {homeContent?.cards.filter(card => card.section_id === section.id).map(card => (
                <article className="published-card" key={card.id}>
                  {card.image_url && <img src={card.image_url} alt="" loading="lazy" />}
                  <h3>{card.title}</h3>
                  {card.description && <p>{card.description}</p>}
                </article>
              ))}
            </div>
          </div>
        ))}
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
            <img
              className="workshop-art"
              src="/images/seasonal/october-adventure.webp"
              sizes="(max-width: 820px) calc(100vw - 52px), 760px"
              width="736"
              height="370"
              loading="lazy"
              alt="Осеннее приключение в мире Minecraft"
            />
          </Reveal>
        </div>
      </section>

      <section className="launcher-section" id="launcher" aria-labelledby="launcher-title">
        <div className="launcher-panel">
          <img
            className="launcher-art"
            src="/images/seasonal/october-world.webp"
            width="1393"
            height="880"
            loading="lazy"
            alt="Осенний мир NCreate с персонажами Minecraft среди красных деревьев"
          />
          <div className="launcher-shade" aria-hidden="true" />
          <div className="launcher-copy">
            <p className="eyebrow">ОКТЯБРЬ · ПЕРВЫЙ СТАБИЛЬНЫЙ ВЫПУСК</p>
            <h2 id="launcher-title">NCreate Launcher <span>1.0.0</span></h2>
            <p className="launcher-lead">Твой Minecraft, твои сборки. Официальная NCreate Server, каталог Modrinth и аккаунты в новом осеннем интерфейсе.</p>
            <p className="launcher-java">Подходящая Java определяется по версии Minecraft и при необходимости подготавливается автоматически.</p>
            <div className="launcher-downloads" aria-label="Скачать NCreate Launcher">
              {launcherDownloads.map((download) => (
                <a className="launcher-download" href={download.url} key={download.label}>
                  <Download aria-hidden="true" />
                  <span><strong>{download.label}</strong><small>{download.detail}</small></span>
                </a>
              ))}
            </div>
            <a className="launcher-notes" href={launcherReleaseUrl}>Заметки о выпуске и контрольные суммы <ArrowDownRight aria-hidden="true" /></a>
          </div>
          <img className="launcher-pumpkin" src="/images/seasonal/october-pumpkins.webp" width="1200" height="600" loading="lazy" alt="" aria-hidden="true" />
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
          src="/images/seasonal/october-knight.webp"
          width="1024"
          height="1536"
          loading="lazy"
          alt="Персонаж NCreate в красно-золотой одежде"
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
        <div className="social-layout">
          <img
            className="social-character"
          src="/images/seasonal/october-lantern.webp"
            sizes="(max-width: 820px) 76vw, 420px"
            width="898"
            height="1076"
            loading="lazy"
            alt="Персонаж NCreate в образе волшебника"
          />
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
        </div>
      </section>
      <PlayDialog ref={dialog} />
    </SiteShell>
  );
}
