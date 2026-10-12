import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowLeft, ArrowRight, Download, Github, Info, Play, X } from "lucide-react";
import { useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { getHomeContent, getSettings } from "../lib";
import { launcherDownloads, launcherReleaseUrl } from "../launcher-release";
import { PlayDialog, Reveal, SiteShell } from "../ui";

export const Route = createFileRoute("/")({ component: Home });
const windows = launcherDownloads[0];
const slides = [
  { kicker: "01 / МИР NCREATE", title: "УДИВИТЕЛЬНЫЙ МИР NCREATE", copy: "Исследуй мир NCreate, играй на официальном сервере и выбирай свой путь в Minecraft.", image: "/images/seasonal/autumn-world.webp", alt: "Игровой мир NCreate", kind: "world", width: 1393, height: 880 },
  { kicker: "02 / ОФИЦИАЛЬНАЯ СБОРКА", title: "СБОРКА NCREATE SERVER", copy: "Официальная сборка для Minecraft 1.21.1 на NeoForge. Лаунчер помогает установить игру и показывает обновления.", image: "/images/launcher/official-home.png", alt: "Интерфейс NCreate Launcher", kind: "launcher", width: 1236, height: 632 },
  { kicker: "03 / СООБЩЕСТВО", title: "СОЗДАВАЙ СВОЮ ИСТОРИЮ", copy: "Узнавай новости проекта и общайся с игроками на форуме NCreate.", image: "/images/ncreate/ncreate-image-04.webp", alt: "Авторская иллюстрация NCreate", kind: "art", width: 1659, height: 919 },
] as const;
const gallery = [
  ["/images/ncreate/ncreate-image-02.webp", "Кубический компьютер NCreate", "Технологии"],
  ["/images/ncreate/ncreate-image-03.webp", "Кубический мешок NCreate", "Находки"],
  ["/images/ncreate/ncreate-image-05.webp", "Существо с фонарём NCreate", "Приключения"],
  ["/images/ncreate/ncreate-image-08.webp", "Волшебник NCreate", "Персонажи"],
  ["/images/ncreate/server-card-engineer.webp", "Инженер NCreate", "Мир NCreate"],
  ["/images/ncreate/server-card-soldier.webp", "Воин NCreate", "Герои"],
];
function gallerySrcSet(src: string) {
  const base = src.slice(0, -5);
  if (src.includes("server-card-soldier")) return base + "-560.webp 560w, " + src + " 1102w";
  if (src.includes("server-card-engineer")) return base + "-840.webp 840w, " + src + " 1672w";
  const originalWidth = src.includes("image-02") ? 1228 : src.includes("image-03") ? 1155 : src.includes("image-05") ? 1373 : 898;
  return base + "-480.webp 480w, " + base + "-640.webp 640w, " + base + "-840.webp 840w, " + src + " " + originalWidth + "w";
}

function Features() {
  const [active, setActive] = useState(0);
  const slide = slides[active];
  const change = (delta: number) => setActive(value => (value + delta + slides.length) % slides.length);
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      change(event.key === "ArrowLeft" ? -1 : 1);
    }
  };
  return <section className="features-section" id="features" aria-labelledby="features-title" aria-roledescription="слайдер" tabIndex={0} onKeyDown={onKeyDown}>
    <div className="features-inner">
      <div className="features-copy" key={slide.kicker}>
        <span className="feature-symbol" aria-hidden="true">✦</span>
        <h2 id="features-title">{slide.title}</h2><p>{slide.copy}</p>
        <div className="slider-controls"><button type="button" aria-label="Предыдущий слайд" onClick={() => change(-1)}><ArrowLeft aria-hidden /></button><span aria-live="polite">{String(active + 1).padStart(2, "0")} <small>/ {String(slides.length).padStart(2, "0")}</small></span><button type="button" aria-label="Следующий слайд" onClick={() => change(1)}><ArrowRight aria-hidden /></button></div>
        <a className="cta cta-orange" href="#start"><Play aria-hidden /> НАЧАТЬ ИГРАТЬ</a>
      </div>
      <div className={"feature-visual feature-" + slide.kind} key={slide.image}><img src={slide.image} srcSet={slide.kind === "art" ? "/images/ncreate/ncreate-image-04-640.webp 640w, /images/ncreate/ncreate-image-04-840.webp 840w, /images/ncreate/ncreate-image-04.webp 1659w" : undefined} sizes="(max-width: 700px) 100vw, 900px" width={slide.width} height={slide.height} alt={slide.alt} loading="lazy" />{slide.kind === "art" && <img className="feature-visual-character" src="/images/ncreate/ncreate-image-07.webp" width="666" height="1395" alt="" loading="lazy" />}</div>
    </div>
  </section>;
}

function RequirementsDialog({ dialogRef }: { dialogRef: RefObject<HTMLDialogElement | null> }) {
  const rows = [
    ["Операционная система", "Windows 10/11 x64 или Linux x64", "Windows 10/11 x64 или Linux x64", "Не опубликовано"],
    ["Процессор", "Уточняется", "Уточняется", "Уточняется"],
    ["Оперативная память*", "1 ГБ для игры", "5 ГБ для игры", "Не опубликовано"],
    ["Видеокарта", "Уточняется", "Уточняется", "Уточняется"],
    ["Разрешение экрана", "Уточняется", "Уточняется", "Уточняется"],
    ["Свободное место", "Зависит от версии и содержимого", "Зависит от версии и содержимого", "Не опубликовано"],
    ["Дополнительно", "Java 21, интернет для первой загрузки", "Java 21, интернет для первой загрузки", "Не опубликовано"],
  ];
  return <dialog ref={dialogRef} className="requirements-dialog" aria-labelledby="requirements-title">
    <div className="requirements-head"><form method="dialog"><button aria-label="Закрыть системные требования"><X aria-hidden /></button></form><div><span className="section-kicker">NCREATE / СПРАВКА</span><h2 id="requirements-title">Системные требования</h2></div></div>
    <p className="requirements-lead">Подтверждённые параметры официальной сборки NCreate Server. Неопубликованные характеристики требуют уточнения у команды проекта.</p>
    <p className="requirements-swipe">Прокрутите таблицу вправо, чтобы увидеть все колонки →</p>
    <div className="requirements-scroll" role="region" aria-label="Таблица системных требований" tabIndex={0}><table><thead><tr><th scope="col">Параметр</th><th scope="col">Минимальные</th><th scope="col">Рекомендуемые</th><th scope="col">Идеальные</th></tr></thead><tbody>{rows.map(row => <tr key={row[0]}><th scope="row">{row[0]}</th>{row.slice(1).map((value, index) => <td key={index}>{value}</td>)}</tr>)}</tbody></table></div>
    <p className="requirements-note">* 1 ГБ и 5 ГБ — значения выделяемой памяти из manifest сборки 1.0.2; это не оценка общей памяти компьютера. Поддержка Windows в интерфейсе лаунчера требует дополнительной проверки.</p>
    <a className="requirements-source" href="https://github.com/Yozekkk/ncreate-pack/blob/main/packs/ncreate-server/1.0.2/edition.json" target="_blank" rel="noopener noreferrer">Manifest сборки <ArrowRight aria-hidden /></a>
  </dialog>;
}

function Home() {
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: getSettings });
  const { data: homeContent } = useQuery({ queryKey: ["home-content"], queryFn: getHomeContent });
  const playDialog = useRef<HTMLDialogElement>(null);
  const requirementsDialog = useRef<HTMLDialogElement>(null);
  return <SiteShell><div className="home-page">
    <section className="redesign-hero" aria-labelledby="hero-title">
      <div className="hero-field" aria-hidden="true" />
      <div className="hero-content">
        <div className="hero-copy-new">
          <div className="hero-identity"><img src="/images/brand/ncreate-logo.webp" alt="Логотип NCreate" width="512" height="512" fetchPriority="high" /><span>NCREATE</span></div>
          <span className="hero-overline">ОФИЦИАЛЬНЫЙ MINECRAFT-ПРОЕКТ</span>
          <h1 id="hero-title">Создавай. <span>Развивай.</span> <em>Играй.</em></h1>
          <p>{settings?.hero_subtitle || "Твой мир, твои правила."}<br />Открой мир NCreate Server и начни своё приключение в Minecraft.</p>
          <div className="hero-buttons"><a className="cta cta-green" href={windows.url}><Download aria-hidden /> СКАЧАТЬ ЛАУНЧЕР</a><a className="hero-text-link" href="#features"><span><Play aria-hidden /></span><strong>Что такое NCreate?<small>Узнать о проекте</small></strong></a></div>
          <div className="hero-assurance"><span aria-hidden="true">✦</span> Официальный лаунчер · Windows и Linux</div>
          {(settings?.average_online != null || settings?.uptime_percent != null) && <div className="hero-live" aria-label="Статистика проекта">{settings.average_online != null && <div><strong>{settings.average_online.toLocaleString("ru-RU")}</strong><span>средний онлайн</span></div>}{settings.uptime_percent != null && <div><strong>{settings.uptime_percent.toLocaleString("ru-RU", { maximumFractionDigits: 2 })}%</strong><span>аптайм сервера</span></div>}</div>}
        </div>
        <div className="hero-characters" aria-label="Персонажи NCreate"><img className="hero-character-back" src="/images/ncreate/ncreate-image-06.webp" srcSet="/images/ncreate/ncreate-image-06-640.webp 640w, /images/ncreate/ncreate-image-06.webp 865w" sizes="(max-width: 700px) 50vw, 34vw" width="865" height="1465" alt="Персонаж NCreate в красно-золотой мантии" fetchPriority="high" /><img className="hero-character-front" src="/images/ncreate/ncreate-image-01.webp" srcSet="/images/ncreate/ncreate-image-01-640.webp 640w, /images/ncreate/ncreate-image-01-840.webp 840w, /images/ncreate/ncreate-image-01.webp 1150w" sizes="(max-width: 700px) 70vw, 46vw" width="1150" height="1353" alt="Главный персонаж NCreate" fetchPriority="high" /><img className="hero-pumpkins" src="/images/seasonal/pumpkins.webp" width="941" height="482" alt="" aria-hidden="true" /></div>
        <a className="hero-side-link" href="#features">УЗНАТЬ ЧТО ЗА ПРОЕКТ <ArrowRight aria-hidden /></a><a className="hero-scroll" href="#features" aria-label="Прокрутить к особенностям"><ArrowDown aria-hidden /></a>
      </div>
    </section>
    <Features />
    <section className="start-section" id="start" aria-labelledby="start-title"><div className="start-heading"><span className="section-kicker">ПЕРВЫЕ ШАГИ</span><h2 id="start-title">КАК НАЧАТЬ ИГРАТЬ</h2><p>Два простых шага — и твой мир NCreate откроется.</p></div><div className="start-grid">
      <div className="start-step start-step-one"><span className="step-chip">Шаг 1</span><h3>Загрузите лаунчер</h3><p>Скачайте NCreate Launcher, установите официальную сборку и подготовьте игру к запуску.</p><a className="cta cta-green" href={windows.url}><Download aria-hidden /> СКАЧАТЬ ЛАУНЧЕР</a><span className="start-os">Windows 10/11 x64 · Linux x64</span><button className="start-inline" type="button" onClick={() => playDialog.current?.showModal()}>Другие версии для Linux <ArrowRight aria-hidden /></button><button className="start-inline" type="button" onClick={() => requirementsDialog.current?.showModal()}>Системные требования <Info aria-hidden /></button></div>
      <div className="launcher-composition"><div className="launcher-window"><img src="/images/launcher/official-home.png" width="1236" height="632" loading="lazy" alt="Интерфейс NCreate Launcher с официальной сборкой" /></div><img className="launcher-character" src="/images/ncreate/ncreate-image-07.webp" srcSet="/images/ncreate/ncreate-image-07-480.webp 480w, /images/ncreate/ncreate-image-07.webp 666w" sizes="(max-width: 700px) 42vw, 250px" width="666" height="1395" loading="lazy" alt="Персонаж NCreate" /></div>
      <div className="start-step start-step-two"><span className="step-chip">Шаг 2</span><h3>Вход в игру</h3><p>Откройте лаунчер, установите сборку NCreate Server и запустите Minecraft. Выберите доступный в лаунчере способ входа.</p><p>Новости проекта и обсуждения доступны на форуме.</p><Link className="outline-button" to="/forum">ПЕРЕЙТИ НА ФОРУМ <ArrowRight aria-hidden /></Link></div>
    </div></section>
    <section className="showcase-section" id="server" aria-labelledby="showcase-title"><div className="showcase-head"><div><span className="section-kicker">МИР NCREATE</span><h2 id="showcase-title">ЗНАКОМЬСЯ С МИРОМ</h2><p>Оригинальные персонажи и иллюстрации проекта.</p></div><img src="/images/voxel/ncreate-title-new.webp" srcSet="/images/voxel/ncreate-title-new-640.webp 640w, /images/voxel/ncreate-title-new.webp 1594w" sizes="(max-width: 700px) 300px, 430px" width="1594" height="398" alt="NCREATE СЕРВЕР" loading="lazy" /></div><div className="art-grid">{gallery.map(item => <Reveal className="art-card" key={item[0]}><img src={item[0]} srcSet={gallerySrcSet(item[0])} sizes="(max-width: 700px) 45vw, 450px" alt={item[1]} loading="lazy" /><span>{item[2]}</span></Reveal>)}</div><div className="showcase-extra"><img src="/images/ncreate/mascot-front.webp" srcSet="/images/ncreate/mascot-front-640.webp 640w, /images/ncreate/mascot-front.webp 760w" sizes="300px" width="760" height="1199" loading="lazy" alt="Маскот NCreate, вид спереди" /><div><h3>ИСТОРИИ СОЗДАЮТ ИГРОКИ</h3><p>Следи за обновлениями проекта и общайся с сообществом NCreate.</p><Link className="cta cta-orange" to="/forum">ОТКРЫТЬ ФОРУМ <ArrowRight aria-hidden /></Link></div><img src="/images/ncreate/mascot-back.webp" srcSet="/images/ncreate/mascot-back-480.webp 480w, /images/ncreate/mascot-back.webp 552w" sizes="300px" width="552" height="1199" loading="lazy" alt="Маскот NCreate, вид сзади" /></div>
      {homeContent?.sections.map(section => <div className="published-section" key={section.id}><h2>{section.title ?? section.section_key}</h2>{section.subtitle && <p>{section.subtitle}</p>}<div className="published-cards">{homeContent.cards.filter(card => card.section_id === section.id).map(card => <article className="published-card" key={card.id}>{card.image_url && <img src={card.image_url} alt="" loading="lazy" />}<h3>{card.title}</h3>{card.description && <p>{card.description}</p>}</article>)}</div></div>)}
    </section>
    <section className="download-section" id="launcher" aria-labelledby="download-title"><div className="download-art"><img src="/images/ncreate/server-card-engineer.webp" srcSet="/images/ncreate/server-card-engineer-840.webp 840w, /images/ncreate/server-card-engineer.webp 1672w" sizes="(max-width: 700px) 100vw, 720px" width="1672" height="941" loading="lazy" alt="Инженер NCreate" /></div><div className="download-copy"><span className="section-kicker">NCREATE LAUNCHER</span><h2 id="download-title">ВСЁ ДЛЯ ТВОЕЙ ИГРЫ</h2><p>Лаунчер помогает установить официальную сборку NCreate Server. Подходящая Java проверяется и при необходимости подготавливается автоматически.</p><div className="download-options">{launcherDownloads.map(item => <a href={item.url} key={item.label}><Download aria-hidden /><span><strong>{item.label}</strong><small>{item.detail}</small></span><ArrowRight aria-hidden /></a>)}</div><div className="download-extras"><a href="https://github.com/Yozekkk/ncreate-launcher" target="_blank" rel="noopener noreferrer"><Github aria-hidden /> GitHub лаунчера</a><a href={launcherReleaseUrl} target="_blank" rel="noopener noreferrer">Релиз и SHA-256 <ArrowRight aria-hidden /></a></div></div></section>
    <section className="community-section" aria-labelledby="community-title"><div><span className="section-kicker">СООБЩЕСТВО</span><h2 id="community-title">БУДЬ ЧАСТЬЮ NCREATE</h2><p>Обсуждай проект и следи за новостями на форуме.</p><Link className="cta cta-orange" to="/forum">ПЕРЕЙТИ НА ФОРУМ <ArrowRight aria-hidden /></Link></div><img src="/images/ncreate/ncreate-image-09.webp" width="1448" height="526" loading="lazy" alt="Панорама мира NCreate" /></section>
    <PlayDialog ref={playDialog} /><RequirementsDialog dialogRef={requirementsDialog} />
  </div></SiteShell>;
}
