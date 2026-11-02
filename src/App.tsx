import { useEffect, useRef, useState } from 'react';
import { event, type Technology } from './config';
import Countdown from './components/Countdown';
import InvitationEnvelope from './components/InvitationEnvelope';
import TerminalGreeting from './components/TerminalGreeting';

function Ornament({ className = '' }: { className?: string }) {
  return <svg className={`ornament ${className}`} viewBox="0 0 120 32" fill="none" aria-hidden="true"><path d="M0 16h23l9-9 10 9-10 9-9-9m97 0H97l-9-9-10 9 10 9 9-9M47 16c0-9 13-14 13-14s13 5 13 14-13 14-13 14-13-5-13-14Z" stroke="currentColor" strokeWidth="1.4"/><path d="m60 8 7 8-7 8-7-8 7-8Z" stroke="currentColor" strokeWidth="1.2"/></svg>;
}

function OrnamentDivider() {
  return <div className="ornament-divider" aria-hidden="true"><span/><Ornament/><span/></div>;
}

function BrandLogo({ className = '' }: { className?: string }) {
  return <img className={`brand-logo ${className}`} src={event.officialGeeksLogo} alt="Официальный логотип IT-академии Geeks" />;
}

function TechnologyBadge({ technology, animationIndex }: { technology: Technology; animationIndex?: number }) {
  return <span className="technology-badge technology-with-logo" title={technology.name} style={animationIndex === undefined ? undefined : { animationDelay: `${animationIndex * 42}ms` }}>
    <img src={`/assets/tech/${technology.icon}.svg`} alt="" loading="lazy"/>
    <span>{technology.name}</span>
  </span>;
}

function PhoneIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.2 3.5h2.4l1.2 4.1-1.7 1.7a15.4 15.4 0 0 0 5.6 5.6l1.7-1.7 4.1 1.2v2.4c0 1.3-1.1 2.4-2.4 2.4C10.4 19.2 4.8 13.6 4.8 6c0-1.4 1-2.5 2.4-2.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedTrack, setExpandedTrack] = useState<string | null>(null);
  const [closingStack, setClosingStack] = useState(false);
  const stackCloseTimer = useRef<number | null>(null);
  const [envelopeVisible, setEnvelopeVisible] = useState(true);
  const [envelopeKey, setEnvelopeKey] = useState(0);
  const [siteVisible, setSiteVisible] = useState(false);
  const [terminalReplayKey, setTerminalReplayKey] = useState(0);
  const activeTrack = event.tracks.find(track => track.id === expandedTrack) ?? null;

  useEffect(() => () => { if (stackCloseTimer.current !== null) window.clearTimeout(stackCloseTimer.current); }, []);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealNodes = document.querySelectorAll('.reveal');
    if (reduce || !('IntersectionObserver' in window)) {
      revealNodes.forEach(node => node.classList.add('visible'));
    } else {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      }), { threshold: .12 });
      revealNodes.forEach(node => observer.observe(node));
      return () => observer.disconnect();
    }
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const hero = document.querySelector<HTMLElement>('.hero');
    if (!hero) return;
    let frame = 0;
    const onPointer = (e: PointerEvent) => {
      if (window.innerWidth < 760) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        hero.style.setProperty('--pointer-x', `${(e.clientX - rect.left - rect.width / 2) * .018}px`);
        hero.style.setProperty('--pointer-y', `${(e.clientY - rect.top - rect.height / 2) * .018}px`);
      });
    };
    const onScroll = () => hero.style.setProperty('--scroll-shift', `${Math.min(window.scrollY * .12, 80)}px`);
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener('pointermove', onPointer); window.removeEventListener('scroll', onScroll); };
  }, []);

  const jump = (id: string) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };
  const handleEnvelopeComplete = () => {
    setSiteVisible(true);
    setTerminalReplayKey(value => value + 1);
  };
  const reopenEnvelope = () => {
    setEnvelopeKey(value => value + 1);
    setEnvelopeVisible(true);
  };
  const closeStack = () => {
    if (stackCloseTimer.current !== null) window.clearTimeout(stackCloseTimer.current);
    setClosingStack(true);
    stackCloseTimer.current = window.setTimeout(() => {
      setExpandedTrack(null);
      setClosingStack(false);
      stackCloseTimer.current = null;
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 460);
  };
  const toggleStack = (trackId: string) => {
    if (stackCloseTimer.current !== null) window.clearTimeout(stackCloseTimer.current);
    stackCloseTimer.current = null;
    if (expandedTrack === trackId && !closingStack) { closeStack(); return; }
    const mobile = window.matchMedia('(max-width: 680px)').matches;
    if (mobile && expandedTrack !== null && expandedTrack !== trackId) {
      setClosingStack(true);
      stackCloseTimer.current = window.setTimeout(() => {
        setExpandedTrack(trackId);
        setClosingStack(false);
        stackCloseTimer.current = null;
      }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 460);
      return;
    }
    setClosingStack(false);
    setExpandedTrack(trackId);
  };

  return <>
    <div className={`site-shell ${siteVisible ? 'site-is-visible' : ''}`} inert={envelopeVisible} aria-hidden={envelopeVisible}>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="IT Той — наверх"><BrandLogo/><span className="wordmark-text">IT ТОЙ</span><small>OSH / KG</small></a>
        <button className="menu-button" aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><i/><i/></button>
        <nav className={menuOpen ? 'main-nav nav-open' : 'main-nav'} aria-label="Основная навигация">
          <a href="#about" onClick={() => setMenuOpen(false)}>О событии</a><a href="#countdown" onClick={() => setMenuOpen(false)}>Таймер</a><a href="#tracks" onClick={() => setMenuOpen(false)}>Направления</a><a href="#venue" onClick={() => setMenuOpen(false)}>Локация</a><button className="reopen-button" onClick={reopenEnvelope}>ПРИГЛАШЕНИЕ ↗</button>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="grid-wash"/><div className="hero-scanline"/><div className="hero-parallax-glow"/>
          <div className="hero-topline"><span><b className="live-dot"/> IT ТОЙ <i>//</i> GEEKS</span><span>{event.city.toUpperCase()} / {event.country.toUpperCase()}</span></div>
          <div className="hero-layout">
            <div className="hero-main"><div className="micro-label"><span>КЫРГЫЗ КОДУ</span><Ornament/><span>НОВОЕ МЫШЛЕНИЕ</span></div>
              <h1><span>IT</span><strong>ТОЙ<span className="hero-star">✳</span></strong></h1>
              <div className="hero-subline"><span className="cursor-block"/> <span>{event.organizer.toUpperCase()} · {event.city.toUpperCase()}</span></div>
              <p className="hero-slogan">IT — БУЛ КЕЛЕЧЕК.</p>
              <p className="hero-kyrgyz">Келечекке бирге кадам таштайлы.</p>
              <p className="hero-copy">Открой для себя мир информационных технологий вместе с Geeks.</p>
              <button className="primary-button" onClick={() => jump('about')}>ОТКРЫТЬ ПРИГЛАШЕНИЕ <span>↘</span></button>
              <div className="hero-facts"><span>{event.dateLabel}</span><i/><span>{event.startTime}</span><i/><span>{event.city}, {event.country}</span></div>
            </div>
            <div className="hero-side"><TerminalGreeting replayKey={terminalReplayKey} start={siteVisible}/><div className="hero-side-brand"><span>ОРГАНИЗОВАНО<br/>IT-АКАДЕМИЕЙ GEEKS</span><Ornament/></div></div>
          </div>
          <div className="hero-bottom"><span>SCROLL TO EXPLORE <b>↓</b></span><span>KYRGYZSTAN <i>—</i> DIGITAL GENERATION</span><span>{event.dateShort}</span></div>
        </section>

        <div className="ticker" aria-label="IT Той Ош"><div className="ticker-track">{Array.from({ length: 4 }).map((_, i) => <span key={i}>IT — БУЛ КЕЛЕЧЕК <b>✳</b> КЕЛЕЧЕККЕ БИРГЕ КАДАМ ТАШТАЙЛЫ <b>✳</b> IT ТОЙ / ОШ <b>✳</b></span>)}</div></div>
        <OrnamentDivider/>

        <section className="about section-pad" id="about"><div className="section-top reveal"><span className="section-id">01 / IT ТОЙ</span><span className="section-code">IT ТОЙ ОТ GEEKS <i>↘</i></span></div><div className="about-grid"><div className="about-title reveal"><p className="overline">ТЕХНОЛОГИИ — ЭТО ЛЮДИ</p><h2>Будущее<br/>ближе,<br/><em>чем кажется.</em></h2></div><div className="about-text reveal"><div className="side-accent"/><p className="about-intro">IT Той — возможность познакомиться с миром информационных технологий в Оше.</p><p>Узнай о современных профессиях, попробуй себя в разных направлениях и увидь возможности развития в IT. Технологии — это не только программирование, но и дизайн, мобильные продукты и многое другое.</p><p>Организовано IT-академией Geeks. Открой для себя мир технологий вместе с Geeks.</p><div className="learn-list"><span><b>01</b> Знакомство с IT-профессиями</span><span><b>02</b> Первые шаги в направлениях</span><span><b>03</b> Идеи и люди из индустрии</span></div></div></div><div className="about-foot"><Ornament/><span>БИРГЕ ҮЙРӨНӨБҮЗ / УЧИМСЯ ВМЕСТЕ</span><span>∞</span></div></section>

        <section className="from-geeks section-pad" id="from-geeks"><div className="section-top reveal"><span className="section-id">02 / ОТ КОМАНДЫ</span><span className="section-code">СЛОВО GEEKS <i>✳</i></span></div><div className="geeks-letter reveal"><div className="geeks-letter-mark"><BrandLogo/><span>IT-АКАДЕМИЯ<br/>GEEKS · ОШ</span><Ornament/></div><div className="geeks-letter-copy"><h2>От команды<br/><em>Geeks</em></h2><div className="geeks-letter-body"><p>Мы в Geeks верим, что технологии открывают новые возможности и меняют будущее.</p><p>Мы создали IT Той, чтобы познакомить больше людей с миром информационных технологий, показать разные направления IT и помочь каждому увидеть свой путь в этой сфере.</p><p>Неважно, есть ли у тебя опыт программирования или ты только начинаешь знакомство с технологиями. Нам хочется, чтобы ты увидел, насколько интересным и разнообразным может быть мир IT.</p><p>Будем рады видеть тебя на нашем мероприятии!</p><p className="geeks-letter-signoff">Команда Geeks</p></div></div></div></section>

        <section className="countdown-section section-pad" id="countdown"><div className="section-top reveal"><span className="section-id">03 / ТАЙМЕР</span><span className="section-code">ДО ВСТРЕЧИ В ОШЕ <i>◷</i></span></div><div className="countdown-heading reveal"><div><p className="overline">{event.dateShort} · {event.startTime} · {event.timeZone.toUpperCase()}</p><h2>Скоро<br/><em>увидимся.</em></h2></div><p>Обратный отсчёт до начала IT Тоя.</p></div><Countdown/><div className="countdown-foot"><span>{event.dateLabel}</span><span>{event.startTime} · {event.city}, {event.country}</span></div></section>

        <section className="tracks section-pad" id="tracks"><div className="section-top reveal"><span className="section-id">04 / НАПРАВЛЕНИЯ</span><span className="section-code">ВЫБЕРИ СВОЙ ВЕКТОР <i>⌘</i></span></div><div className="tracks-heading reveal"><h2>Одна индустрия.<br/><em>Четыре маршрута.</em></h2><p>Открой направления IT и найди то, которое тебе интересно.</p></div><div className="track-grid">{event.tracks.map(track => {
          const selected = expandedTrack === track.id && !closingStack;
          return <article className={`track-card ${track.color} ${selected ? 'track-selected' : ''}`} key={track.id}>
            <button className="track-toggle" type="button" aria-expanded={selected && !closingStack} onClick={() => toggleStack(track.id)}>
              <span className="track-card-top"><small>FIELD_{track.id}</small><span className="track-arrow">{selected ? '−' : '↗'}</span></span>
              <strong>{track.name}</strong><p>{track.description}</p>
              <span className="track-preview-label">ОСНОВНЫЕ ТЕХНОЛОГИИ</span>
              <span className="track-preview">{track.featured.map(technology => <TechnologyBadge technology={technology} key={technology.name}/>)}</span>
              <span className="track-expand-hint">{selected ? 'Стек открыт ниже' : 'Открыть полный стек'} <i>↘</i></span>
            </button>
          </article>;
        })}<div className={`stack-panel-region ${expandedTrack ? `stack-after-${expandedTrack}` : ''} ${activeTrack ? closingStack ? 'is-closing' : 'is-open' : ''}`} aria-hidden={!activeTrack || closingStack} inert={!activeTrack || closingStack}>{activeTrack && <section className={`stack-panel ${activeTrack.color}`} key={activeTrack.id} aria-live="polite" aria-labelledby="stack-panel-title"><div className="stack-panel-content"><div className="stack-panel-heading"><div><span className="track-preview-label">НАПРАВЛЕНИЕ / {activeTrack.code}</span><h3 id="stack-panel-title">{activeTrack.name}</h3><p>{activeTrack.description}</p></div><button type="button" onClick={closeStack} aria-label="Закрыть подробности стека">ЗАКРЫТЬ <span>×</span></button></div><div className="stack-panel-groups">{activeTrack.stacks.map(group => <div className="stack-group" key={group.label}><h4>{group.label}</h4><div className="stack-tools">{group.items.map((technology, index) => <TechnologyBadge technology={technology} animationIndex={index} key={technology.name}/>)}</div></div>)}</div></div></section>}</div></div><div className="track-footer reveal"><span><b className="live-dot"/> {activeTrack?.code ?? '04 НАПРАВЛЕНИЯ'} SELECTED</span><span>НАЖМИ НА КАРТОЧКУ, ЧТОБЫ ОТКРЫТЬ СТЕК <i>↗</i></span></div></section>

        <section className="discounts section-pad" id="discounts"><div className="section-top reveal"><span className="section-id">05 / РОЗЫГРЫШ</span><span className="section-code">БЕЛЕКТЕР / GEEKS <i>✳</i></span></div><div className="discounts-heading reveal"><div><p className="overline">GEEKS / БОНУСЫ ДЛЯ ГОСТЕЙ</p><h2>Розыгрыш<br/><em>скидок.</em></h2></div><p>На IT Тое — скидки и специальные предложения от Geeks.</p></div><div className="discount-grid">{event.discounts.map((discount, index) => <article className={`discount-card discount-card-${index + 1} reveal`} key={discount.value}><div className="discount-card-top"><span>ПОДАРОК_0{index + 1}</span><span className="discount-spark"><Ornament/></span></div><strong className="discount-value">{discount.value}</strong><h3>{discount.title}</h3><p>{discount.note}</p><div className="discount-card-bottom"><span>IT ТОЙ / ОШ</span><span>↗</span></div></article>)}</div><p className="discount-note reveal">Подробности и условия предложений будут объявлены организаторами.</p></section>

        <section className="ticket-section section-pad" id="ticket"><div className="section-top reveal"><span className="section-id">06 / ЦИФРОВАЯ КАРТОЧКА</span><span className="section-code">ПАМЯТЬ О СОБЫТИИ <i>▤</i></span></div><div className="ticket-layout"><div className="ticket-copy reveal"><p className="overline">ПАМЯТНАЯ КАРТОЧКА</p><h2>Сохрани<br/><em>этот день.</em></h2><p>Коллекционная цифровая карточка IT Тоя — памятный сувенир о встрече в Оше.</p></div><article className="digital-ticket reveal" aria-label="Памятная карточка IT Той"><div className="ticket-pattern"><Ornament/><Ornament/><Ornament/></div><div className="ticket-main"><div className="ticket-header"><BrandLogo/><span>ЦИФРОВОЙ<br/>СУВЕНИР</span></div><p className="ticket-label">IT ТОЙ / КЫРГЫЗСТАН</p><h3>IT ТОЙ</h3><p className="ticket-motto">IT — БУЛ КЕЛЕЧЕК.</p><div className="ticket-data"><div><small>ДАТА</small><strong>{event.dateShort}</strong></div><div><small>НАЧАЛО</small><strong>{event.startTime}</strong></div><div><small>ГОРОД</small><strong>{event.city.toUpperCase()}</strong></div></div><p className="ticket-disclaimer">ПАМЯТНАЯ КАРТОЧКА · НЕ ЯВЛЯЕТСЯ БИЛЕТОМ ДЛЯ ПРОХОДА</p></div><div className="ticket-stub"><Ornament/><span>GEEKS<br/>IT ТОЙ</span><b>001</b></div></article></div></section>

        <section className="venue section-pad" id="venue"><div className="section-top reveal"><span className="section-id">07 / ЛОКАЦИЯ</span><span className="section-code">ТҮШТҮКТӨ ЖОЛУГАБЫЗ <i>⌖</i></span></div><div className="venue-grid"><div className="venue-info reveal"><p className="overline">{event.city.toUpperCase()}, {event.country.toUpperCase()}</p><h2>Кездешкенче.<br/><em>До встречи.</em></h2><OrnamentDivider/><p className="venue-intro">IT Той от Geeks состоится в академии Geeks в Оше.</p><div className="venue-data"><span className="data-icon">⌖</span><div><small>ОРГАНИЗАТОР / ПЛОЩАДКА</small><b>{event.organizer} · {event.venue}, {event.city}</b><p>{event.address}</p></div></div><div className="venue-buttons"><a className="primary-button" href={event.mapUrl} target="_blank" rel="noopener noreferrer">ОТКРЫТЬ В 2ГИС <span>↗</span></a><a className="route-button" href={event.routeUrl} target="_blank" rel="noopener noreferrer">ПОСТРОИТЬ МАРШРУТ <span>↗</span></a></div></div><div className="map-panel reveal"><div className="map-panel-head"><span>ПРЕДПРОСМОТР КАРТЫ / {event.mapProvider.toUpperCase()}</span><a href={event.mapUrl} target="_blank" rel="noopener noreferrer" aria-label="Открыть Geeks в 2ГИС">2ГИС ↗</a></div><iframe className="map-iframe" title="Интерактивная карта 2ГИС для Geeks в Оше" src={event.mapPreviewUrl} loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin"/><div className="map-panel-foot"><span><b className="live-dot"/> ТОЧКА ИЗ КАРТОЧКИ GEEKS В 2ГИС</span><span>{event.city.toUpperCase()}</span></div><p className="map-provider-note">Официальный виджет 2ГИС, связанный с карточкой Geeks. Откройте карточку или постройте маршрут в 2ГИС.</p></div></div></section>

        <section className="contacts section-pad" id="contacts"><div className="section-top reveal"><span className="section-id">08 / КОНТАКТЫ</span><span className="section-code">БАЙЛАНЫШ / CONTACT <i>↗</i></span></div><div className="contacts-layout"><div className="contacts-copy reveal"><p className="overline">ВОПРОСЫ? МЫ НА СВЯЗИ</p><h2>До встречи<br/><em>в Оше.</em></h2><p>Свяжитесь с командой Geeks или следите за новостями академии.</p></div><div className="contact-links reveal"><a href={event.contacts.whatsapp} target="_blank" rel="noopener noreferrer"><span className="contact-icon brand-contact"><img src="https://cdn.simpleicons.org/whatsapp/25D366" alt=""/></span><span><small>WHATSAPP</small><strong>{event.contacts.whatsappPhone}</strong></span><b>↗</b></a>{event.contacts.calls.map((contact, index) => <a href={contact.link} key={contact.link}><span className="contact-icon"><PhoneIcon/></span><span><small>{index === 0 ? 'ПОЗВОНИТЬ' : `ЗВОНОК · 0${index + 1}`}</small><strong>{contact.phone}</strong></span><b>↗</b></a>)}<a href={event.contacts.instagram} target="_blank" rel="noopener noreferrer"><span className="contact-icon brand-contact"><img src="https://cdn.simpleicons.org/instagram/E1306C" alt=""/></span><span><small>INSTAGRAM</small><strong>{event.contacts.instagramHandle}</strong></span><b>↗</b></a></div></div></section>

        <section className="farewell-section" aria-labelledby="farewell-title"><div className="farewell-card reveal"><OrnamentDivider/><p className="overline">IT ТОЙ · ОШ · {event.dateShort}</p><h2 id="farewell-title">Көрүшкөнчө!</h2><div className="farewell-date"><span/><strong>{event.dateLabel}</strong><span/></div><a className="farewell-route" href={event.routeUrl} target="_blank" rel="noopener noreferrer">Открыть маршрут в 2ГИС <b>↗</b></a><OrnamentDivider/></div></section>
        <footer className="footer"><div className="footer-main"><a className="wordmark" href="#top"><BrandLogo/><span className="wordmark-text">IT ТОЙ</span><small>OSH / KG</small></a><div className="footer-signoff">IT — БУЛ КЕЛЕЧЕК.<br/><em>Келечекке бирге кадам таштайлы.</em><small>{event.dateLabel} · {event.startTime} · {event.city}</small></div><div className="footer-nav"><span>НАВИГАЦИЯ</span><a href="#about">Об IT Тое ↗</a><a href="#tracks">Направления ↗</a><button onClick={reopenEnvelope}>Открыть конверт ↗</button></div></div><div className="footer-bottom"><span>IT ТОЙ / {event.city.toUpperCase()} / KYRGYZSTAN</span><span>КЕЛЕЧЕК БҮГҮН БАШТАЛАТ <Ornament/></span><a href="#top">НАВЕРХ ↑</a></div></footer>
      </main>
    </div>
    {envelopeVisible && <InvitationEnvelope key={envelopeKey} onComplete={handleEnvelopeComplete} onDismiss={() => setEnvelopeVisible(false)}/>}
  </>;
}

export default App;
