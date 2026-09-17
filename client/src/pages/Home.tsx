import { useEffect, useRef, useState } from "react";

/**
 * EDIT HERE FIRST
 * ----------------
 * Keep all event-specific copy in this single block so the invitation can be
 * personalized without touching the layout or interaction code.
 */
const INVITATION = {
  bride: "Reshma Bano",
  groom: "Sujat Khan",
  brideParents: "Mr. Bundu Ali Khan",
  brideRelation: "(Daughter of Mr. Bundu Ali Khan)",
  groomParents: "(Son of Mr. Aktar Ali Khan)",
  bridePlace: "",
  groomPlace: "",
  venueName: "Tyagi Vatika",
  venueMapUrl: "https://maps.app.goo.gl/o9nWzix2SCkdp37aA",
  eventDate: "October 02, 2026 22:00:00",
  eventDay: "2nd",
  eventMonth: "OCT",
  eventYear: "2026",
  eventTime: "Friday, 2 October 2026, 10:00 PM",
} as const;


const MEDIA = {
  poster: "/assets/images/first.png",
  openingVideo: "/assets/videos/nadavd.mp4",
  topFloral: "/assets/images/topf.png",
  hangingLight: "/assets/images/light.png",
  ring: "/assets/images/fl.png",
  saveTheDate: "/assets/images/SAVE.png",
  venue: "/assets/images/venue.png",
  inshaAllah: "/assets/images/insha.png",
  bottomFloral: "/assets/images/bl-fl.png",
  music: "/assets/audio/music1.mp3",
} as const;

function pad(value: number) {
  return value < 10 ? `0${value}` : String(value);
}

function fireConfetti(originX = 0.5, originY = 0.7) {
  const colors = ["#610B14", "#f7f0e3", "#a68b5b", "#b49a72"];
  const burst = document.createElement("div");
  burst.className = "confetti-burst";
  burst.style.left = `${originX * 100}%`;
  burst.style.top = `${originY * 100}%`;

  for (let i = 0; i < 44; i += 1) {
    const particle = document.createElement("i");
    particle.className = "confetti-piece";
    particle.style.setProperty("--angle", `${(360 / 44) * i + Math.random() * 12}deg`);
    particle.style.setProperty("--distance", `${100 + Math.random() * 130}px`);
    particle.style.setProperty("--delay", `${Math.random() * 90}ms`);
    particle.style.setProperty("--color", colors[i % colors.length]);
    particle.style.setProperty("--rotation", `${Math.random() * 520 - 260}deg`);
    burst.appendChild(particle);
  }

  document.body.appendChild(burst);
  window.setTimeout(() => burst.remove(), 1700);
}

function useCountdown(targetDate: string) {
  const [time, setTime] = useState({ days: "00", hours: "00", minutes: "00", seconds: "00" });

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const update = () => {
      const distance = target - Date.now();
      if (distance <= 0) {
        setTime({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }
      setTime({
        days: pad(Math.floor(distance / 86_400_000)),
        hours: pad(Math.floor((distance % 86_400_000) / 3_600_000)),
        minutes: pad(Math.floor((distance % 3_600_000) / 60_000)),
        seconds: pad(Math.floor((distance % 60_000) / 1_000)),
      });
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [targetDate]);

  return time;
}

function HandIcon() {
  return (
    <svg className="hand-icon" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M18.5 22.5V10.8a2.7 2.7 0 0 1 5.4 0v9.1-13a2.7 2.7 0 0 1 5.4 0v13.1-11a2.7 2.7 0 0 1 5.4 0v12.8-6.6a2.7 2.7 0 0 1 5.4 0v12.2c0 9-5.8 14.2-14.2 14.2-5.1 0-8.7-2.2-11.2-6.3l-5.1-8.3a2.7 2.7 0 0 1 4.6-2.8l4.3 5.4V22.5Z" />
      <path d="M5.5 15.5c1.8-2.8 4.8-4.8 8.3-5.3M6.2 24.3a11.8 11.8 0 0 0 4 4.1" />
    </svg>
  );
}

function VolumeIcon({ playing }: { playing: boolean }) {
  return playing ? (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Zm5.5 3.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Zm5 5 5 5m0-5-5 5" /></svg>
  );
}

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const musicRef = useRef<HTMLAudioElement>(null);
  const scratchRefs = useRef<Array<HTMLCanvasElement | null>>([]);
  const scratchFinished = useRef<boolean[]>([false, false, false]);
  const [heroVisible, setHeroVisible] = useState(true);
  const [opened, setOpened] = useState(false);
  const [videoTextVisible, setVideoTextVisible] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [scratchComplete, setScratchComplete] = useState(false);
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [rsvpTone, setRsvpTone] = useState<"happy" | "sad" | "">("");
  const countdown = useCountdown(INVITATION.eventDate);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle("visible", entry.isIntersecting));
    }, { threshold: 0.15 });
    document.querySelectorAll(".scroll-animate, .stagger-anim").forEach((element) => observer.observe(element));

    const createHeart = (event: MouseEvent | TouchEvent) => {
      const touch = "touches" in event ? event.touches[0] : undefined;
      const x = touch?.clientX ?? (event as MouseEvent).clientX;
      const y = touch?.clientY ?? (event as MouseEvent).clientY;
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;
      const heart = document.createElement("div");
      heart.className = "heart";
      heart.style.left = `${x}px`;
      heart.style.top = `${y}px`;
      document.body.appendChild(heart);
      window.setTimeout(() => heart.remove(), 1000);
    };
    document.addEventListener("mousemove", createHeart as EventListener);
    document.addEventListener("touchstart", createHeart as EventListener, { passive: true });

    return () => {
      observer.disconnect();
      document.body.style.overflow = "auto";
      document.removeEventListener("mousemove", createHeart as EventListener);
      document.removeEventListener("touchstart", createHeart as EventListener);
    };
  }, []);

  useEffect(() => {
    const canvases = scratchRefs.current;
    const cleanups: Array<() => void> = [];
    canvases.forEach((canvas, index) => {
      if (!canvas) return;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return;
      const center = canvas.width / 2;
      const gradient = context.createConicGradient
        ? context.createConicGradient(0, center, center)
        : context.createRadialGradient(center, center, 10, center, center, center);
      gradient.addColorStop(0, "#610B14");
      gradient.addColorStop(0.16, "#efe3cf");
      gradient.addColorStop(0.34, "#b49a72");
      gradient.addColorStop(0.52, "#610B14");
      gradient.addColorStop(0.68, "#fff5df");
      gradient.addColorStop(0.84, "#d2c1a5");
      gradient.addColorStop(1, "#610B14");
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "rgba(255,255,255,.05)";
      for (let i = 0; i < 160; i += 1) context.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
      context.globalCompositeOperation = "destination-out";
      context.lineWidth = 18;
      context.lineCap = "round";
      context.lineJoin = "round";

      let drawing = false;
      let last = { x: 0, y: 0 };
      const position = (event: PointerEvent) => {
        const bounds = canvas.getBoundingClientRect();
        return { x: (event.clientX - bounds.left) * (canvas.width / bounds.width), y: (event.clientY - bounds.top) * (canvas.height / bounds.height) };
      };
      const check = () => {
        const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
        let transparent = 0;
        for (let i = 3; i < data.length; i += 16) if (data[i] < 50) transparent += 1;
        if (transparent / (data.length / 16) > 0.05 && !scratchFinished.current[index]) {
          scratchFinished.current[index] = true;
          canvas.style.opacity = "0";
          canvas.parentElement?.querySelector(".scratch-base")?.classList.add("scratched-pop");
          if (scratchFinished.current.every(Boolean)) {
            setScratchComplete(true);
            fireConfetti(0.5, 0.48);
          }
        }
      };
      const down = (event: PointerEvent) => {
        drawing = true;
        canvas.setPointerCapture(event.pointerId);
        last = position(event);
      };
      const move = (event: PointerEvent) => {
        if (!drawing || scratchFinished.current[index]) return;
        event.preventDefault();
        const next = position(event);
        context.beginPath();
        context.moveTo(last.x, last.y);
        context.lineTo(next.x, next.y);
        context.stroke();
        last = next;
        check();
      };
      const up = () => { drawing = false; };
      canvas.addEventListener("pointerdown", down);
      canvas.addEventListener("pointermove", move, { passive: false });
      canvas.addEventListener("pointerup", up);
      canvas.addEventListener("pointercancel", up);
      cleanups.push(() => {
        canvas.removeEventListener("pointerdown", down);
        canvas.removeEventListener("pointermove", move);
        canvas.removeEventListener("pointerup", up);
        canvas.removeEventListener("pointercancel", up);
      });
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  const startMusic = async () => {
    if (!musicRef.current) return;
    try {
      await musicRef.current.play();
      setMusicPlaying(true);
    } catch {
      setMusicPlaying(false);
    }
  };

  const openInvitation = async () => {
    setOpened(true);
    if (videoRef.current) {
      try { await videoRef.current.play(); } catch { /* the poster remains a graceful fallback */ }
    }
    await startMusic();
  };

  const finishVideo = () => {
    setHeroVisible(false);
    document.body.style.overflow = "auto";
    window.setTimeout(() => window.scrollTo(0, 0), 50);
  };

  const handleRsvp = (tone: "happy" | "sad") => {
    setRsvpTone(tone);
    setRsvpMessage(tone === "happy" ? "Yay! Can't wait to celebrate with you" : "We’ll miss you... but you’ll be in our hearts");
    if (tone === "happy") fireConfetti(0.5, 0.82);
    window.setTimeout(() => setRsvpTone(""), tone === "happy" ? 650 : 550);
  };

  return (
    <div className="wedding-page">
      <audio ref={musicRef} loop preload="none"><source src={MEDIA.music} type="audio/mpeg" /></audio>
      <button className="music-toggle" aria-label="Toggle music" onClick={() => {
        if (musicPlaying) {
          musicRef.current?.pause();
          setMusicPlaying(false);
        } else startMusic();
      }}><VolumeIcon playing={musicPlaying} /></button>

      {heroVisible && (
        <section className="hero-section">
          <div className="video-container">
            <img className={`video-placeholder ${opened ? "poster-hidden" : ""}`} src={MEDIA.poster} alt="Floral wedding envelope" />
            <video ref={videoRef} className="opening-video" playsInline preload="auto" onTimeUpdate={(event) => {
              if (event.currentTarget.currentTime > 0.5) setVideoTextVisible(true);
            }} onEnded={finishVideo}><source src={MEDIA.openingVideo} type="video/mp4" /></video>
            <div className={`overlay ${opened ? "overlay-hidden" : ""}`} onClick={openInvitation} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") openInvitation(); }}>
              <div className="play-button"><HandIcon /></div>
              <p className="tap-text">Open Invitation</p>
            </div>
            <div className={`opening-copy ${videoTextVisible ? "reveal" : ""}`} aria-hidden="true">
              <p>Together with their families</p>
              <strong>{INVITATION.groom}<span>-♡-</span>{INVITATION.bride}</strong>
              <p>We would like to invite you to celebrate with us the most special day of our lives.</p>
            </div>
          </div>
        </section>
      )}

      <main>
        <section className="details-section" id="detailsSection">
          <img src={MEDIA.topFloral} className="topf-image" alt="Floral corner decoration" />
          <img src={MEDIA.hangingLight} className="light-image" alt="Hanging light decoration" />
          <div className="content-wrapper scroll-animate">
            <div className="details-cover-copy">
              <div>
                <p className="small-text">TOGETHER WITH<br />THEIR FAMILIES</p>
                <h1 className="names">{INVITATION.groom}<br /><span className="ampersand">-♡-</span><br />{INVITATION.bride}</h1>
                <p className="small-text invitation-line">WE WOULD LIKE TO INVITE YOU TO<br />CELEBRATE WITH US THE MOST<br />SPECIAL DAY OF OUR LIVES.</p>
              </div>
              <div className="scroll-indicator-container"><div className="scroll-indicator-bar" /><span className="scroll-indicator-text">scroll</span></div>
            </div>
            <div className="bismillah-frame-wrapper">
              <div className="bismillah-text-container">
                <h2>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</h2>
                <p className="details-text">In the name of Allah<br />the most Gracious and the most Merciful</p>
              </div>
            </div>
            <p className="details-text family-copy">
              {INVITATION.brideParents} cordially invites your gracious presence with family on the auspicious occasion of the marriage of our daughter<br /><br />
              <b>{INVITATION.bride}</b><br />
              <span>{INVITATION.brideRelation || INVITATION.brideParents}{INVITATION.bridePlace ? <><br />{INVITATION.bridePlace}</> : null}</span><br />
              with<br /><b>{INVITATION.groom}</b><br />
              <span>{INVITATION.groomParents}{INVITATION.groomPlace ? <><br />{INVITATION.groomPlace}</> : null}</span>
            </p>
            <img src={MEDIA.ring} alt="Wedding rings" className="ringg-image" />
          </div>
        </section>

        <section className="scratch-section">
          <div className="content-wrapper scroll-animate">
            <p className="reveal-text">Reveal</p>
            <p className="discover-text">SCRATCH TO<br />DISCOVER THE DATE</p>
            <div className="scratch-container">
              {[INVITATION.eventDay, INVITATION.eventMonth, INVITATION.eventYear].map((datePart, index) => (
                <div className="scratch-card" key={datePart}>
                  <div className="scratch-base"><span className="scratch-date">{datePart}</span></div>
                  <canvas className="scratch-canvas" width="90" height="90" ref={(element) => { scratchRefs.current[index] = element; }} aria-label={`Scratch to reveal ${datePart}`} />
                </div>
              ))}
            </div>
            <p className={`scratch-hint ${scratchComplete ? "is-hidden" : ""}`}>Scratch each circle to reveal the date</p>
          </div>
        </section>

        <section className="venue-section save-section">
          <div className="venue-container scroll-animate">
            <img src={MEDIA.saveTheDate} className="save-image" alt="Save the date" />
            <div className={`minimal-countdown ${scratchComplete ? "show" : ""}`}>
              <p>Days to Go...</p>
              <div className="timer">
                <div className="time-block-minimal"><span>{countdown.days}</span><p>Days</p></div>
                <div className="time-block-minimal"><span>{countdown.hours}</span><p>Hours</p></div>
                <div className="time-block-minimal"><span>{countdown.minutes}</span><p>Minutes</p></div>
                <div className="time-block-minimal"><span>{countdown.seconds}</span><p>Secs</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="itinerary-section">
          <div className="content-wrapper scroll-animate">
            <h2 className="venue-title">Nikah</h2>
            <p className="timeline-time">{INVITATION.eventTime}</p>
          </div>
        </section>

        <section className="venue-section">
          <div className="venue-container scroll-animate">
            <h2 className="venue-title">Venue</h2>
            <div className="venue-image-box">
              <a href={INVITATION.venueMapUrl} target="_blank" rel="noopener noreferrer"><img src={MEDIA.venue} alt="Venue" /></a>
              <p className="venue-text venue-hint">▲ Click on the venue to see the location in Google Map</p>
            </div>
            <p className="venue-text venue-name">{INVITATION.venueName}</p>
          </div>
        </section>

        <section className="rsvp-section" id="rsvpSection">
          <div className="scroll-animate">
            <h2 className="rsvp-title">RSVP</h2>
            <p className="rsvp-sub">Will you be attending?</p>
            <div className="rsvp-buttons">
              <button className={`rsvp-btn yes ${rsvpTone === "happy" ? "happy" : ""}`} onClick={() => handleRsvp("happy")}>Yes, I'll be there!</button>
              <button className={`rsvp-btn no ${rsvpTone === "sad" ? "sad" : ""}`} onClick={() => handleRsvp("sad")}>Sorry, I can't make it</button>
            </div>
            <p className={`rsvp-message ${rsvpMessage ? "visible" : ""}`}>{rsvpMessage}</p>
          </div>
        </section>

        <section className="thankyou-section">
          <div className="thankyou-container scroll-animate">
            <img src={MEDIA.inshaAllah} className="insha-image" alt="Insha Allah" />
            <img src={MEDIA.bottomFloral} className="bottom-floral" alt="Floral ring decoration" />
          </div>
        </section>
        <div className="branding-bar"><a href="tel:8955131060">created by armaan kachhawa no. 8955131026</a></div>
      </main>
    </div>
  );
}
