'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import AppImage from '@/components/ui/AppImage';
import { useLanguage } from '@/context/LanguageContext';

interface Petal {
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    rotationSpeed: number;
    size: number;
    opacity: number;
    opacitySpeed: number;
    phase: number;
}

const HERO_SLIDES = [
    {
        src: "https://images.unsplash.com/photo-1696954806336-338b5f6311a8",
        alt: 'Lush pink and white floral arrangement in dim romantic studio lighting, deep shadows, rich dark background'
    },
    {
        src: "https://images.unsplash.com/photo-1633984887919-68a1a5696e13",
        alt: 'Luxury rose bouquet arrangement in moody atmospheric setting, dark tones, cinematic shadows'
    },
    {
        src: "https://images.unsplash.com/photo-1545052932-3ae6538ff290",
        alt: 'Premium floral studio with dramatic low-key lighting, dark walls, elegant flower arrangement'
    }];


export default function HeroSection() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const petalsRef = useRef<Petal[]>([]);
    const rafRef = useRef<number>(0);
    const [activeSlide, setActiveSlide] = useState(0);
    const [kenBurns, setKenBurns] = useState(true);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [titleVisible, setTitleVisible] = useState(false);
    const heroRef = useRef<HTMLDivElement>(null);
    const slideTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const { t } = useLanguage();

    // Title reveal on mount
    useEffect(() => {
        const t = setTimeout(() => setTitleVisible(true), 400);
        return () => clearTimeout(t);
    }, []);

    // Carousel
    useEffect(() => {
        slideTimerRef.current = setInterval(() => {
            setKenBurns(false);
            setTimeout(() => {
                setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
                setKenBurns(true);
            }, 100);
        }, 7000);
        return () => {
            if (slideTimerRef.current) clearInterval(slideTimerRef.current);
        };
    }, []);

    // Cursor tracking
    const onMouseMove = useCallback((e: MouseEvent) => {
        if (!heroRef.current) return;
        const rect = heroRef.current.getBoundingClientRect();
        setCursorPos({
            x: (e.clientX - rect.left) / rect.width - 0.5,
            y: (e.clientY - rect.top) / rect.height - 0.5
        });
    }, []);

    useEffect(() => {
        const el = heroRef.current;
        if (!el) return;
        el.addEventListener('mousemove', onMouseMove);
        return () => el.removeEventListener('mousemove', onMouseMove);
    }, [onMouseMove]);

    // Petals canvas
    const initPetals = useCallback((w: number, h: number) => {
        petalsRef.current = Array.from({ length: 28 }, () => ({
            x: Math.random() * w,
            y: Math.random() * h - h,
            vx: (Math.random() - 0.5) * 0.6,
            vy: Math.random() * 0.8 + 0.4,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.025,
            size: Math.random() * 10 + 6,
            opacity: Math.random() * 0.5 + 0.15,
            opacitySpeed: (Math.random() - 0.5) * 0.003,
            phase: Math.random() * Math.PI * 2
        }));
    }, []);

    const drawPetal = (ctx: CanvasRenderingContext2D, p: Petal) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));

        const colors = ['#e8c4b8', '#f0d4cc', '#ddb4a4', '#c8947a'];
        const color = colors[Math.floor(p.size * 3) % colors.length];

        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.5, p.size * 0.6, p.size * 0.5, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.6, p.size * 0.5, -p.size * 0.6, -p.size * 0.5, 0, -p.size);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            initPetals(canvas.width, canvas.height);
        };
        resize();
        window.addEventListener('resize', resize);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            petalsRef.current.forEach((p) => {
                p.x += p.vx + Math.sin(p.phase) * 0.3;
                p.y += p.vy;
                p.rotation += p.rotationSpeed;
                p.phase += 0.012;
                p.opacity += p.opacitySpeed;
                if (p.opacity > 0.65 || p.opacity < 0.1) p.opacitySpeed *= -1;
                if (p.y > canvas.height + 30) {
                    p.y = -30;
                    p.x = Math.random() * canvas.width;
                }
                drawPetal(ctx, p);
            });
            rafRef.current = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(rafRef.current);
        };
    }, [initPetals]);

    return (
        <section
            ref={heroRef}
            className="relative w-full overflow-hidden"
            style={{ minHeight: '100vh' }}
            aria-label="Hero section">

            {/* Slides */}
            {HERO_SLIDES.map((slide, i) =>
                <div
                    key={i}
                    className="absolute inset-0 transition-opacity duration-[1800ms] ease-in-out"
                    style={{ opacity: activeSlide === i ? 1 : 0 }}>

                    <AppImage
                        src={slide.src}
                        alt={slide.alt}
                        fill
                        priority={i === 0}
                        sizes="100vw"
                        className={`object-cover transition-transform duration-[12000ms] ease-out ${activeSlide === i && kenBurns ? 'scale-110' : 'scale-100'}`
                        } />

                </div>
            )}

            {/* Scrim — dark overlay for white text legibility */}
            <div
                className="absolute inset-0 z-10"
                style={{
                    background:
                        'linear-gradient(to top, rgba(10,6,2,0.75) 0%, rgba(10,6,2,0.45) 40%, rgba(10,6,2,0.25) 70%, rgba(10,6,2,0.15) 100%)'
                }} />


            {/* Petals canvas */}
            <canvas ref={canvasRef} id="petals-canvas" className="absolute inset-0 w-full h-full" />

            {/* Parallax content layer */}
            <div
                className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6"
                style={{
                    transform: `translate(${cursorPos.x * -18}px, ${cursorPos.y * -12}px)`,
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>

                {/* Eyebrow */}
                <div
                    className={`mb-6 transition-all duration-700 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`
                    }
                    style={{ transitionDelay: '0.1s' }}>

                    <span className="section-label font-bold text-center tracking-widest" style={{ color: 'rgba(232,196,184,0.9)' }}>
                        {t('hero.eyebrow')}
                    </span>
                </div>

                {/* Main Headline */}
                <h1 className="font-display text-hero font-bold text-center leading-none tracking-tight mb-4" style={{ color: '#fdf8f3' }}>
                    <span className="text-mask-wrapper">
                        <span className={`text-mask-inner ${titleVisible ? 'revealed' : ''}`} style={{ transitionDelay: '0.2s' }}>
                            {t('hero.title1')}
                        </span>
                    </span>
                    {' '}
                    <span className="text-mask-wrapper">
                        <span
                            className={`text-mask-inner italic ${titleVisible ? 'revealed' : ''}`}
                            style={{ transitionDelay: '0.38s', color: 'var(--blush)' }}>

                            {t('hero.title2')}
                        </span>
                    </span>
                </h1>

                {/* Subtitle */}
                <p
                    className={`font-sans text-base md:text-lg font-light text-center max-w-lg leading-relaxed mb-10 transition-all duration-900 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
                    }
                    style={{
                        color: 'rgba(253,248,243,0.85)',
                        transitionDelay: '0.6s'
                    }}>

                    {t('hero.subtitle')}
                </p>

                {/* CTAs */}
                <div
                    className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`
                    }
                    style={{ transitionDelay: '0.8s' }}>

                    <a
                        href="#contact"
                        className="pill-btn font-bold text-center"
                        style={{
                            backgroundColor: 'var(--blush)',
                            color: 'var(--primary)',
                            border: '1px solid transparent',
                            paddingLeft: '2.5rem',
                            paddingRight: '2.5rem'
                        }}>

                        {t('hero.btnOrder')}
                    </a>
                    <a
                        href="#collection"
                        className="pill-btn font-bold text-center"
                        style={{
                            backgroundColor: 'transparent',
                            color: '#fdf8f3',
                            border: '1px solid rgba(253,248,243,0.4)',
                            paddingLeft: '2.5rem',
                            paddingRight: '2.5rem'
                        }}>

                        {t('hero.btnCollection')}
                    </a>
                </div>
            </div>

            {/* Slide indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {HERO_SLIDES.map((_, i) =>
                    <button
                        key={i}
                        onClick={() => setActiveSlide(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className="transition-all duration-500"
                        style={{
                            width: activeSlide === i ? '2rem' : '0.4rem',
                            height: '0.4rem',
                            borderRadius: '9999px',
                            backgroundColor: activeSlide === i ? 'var(--blush)' : 'rgba(253,248,243,0.35)'
                        }} />

                )}
            </div>

            {/* Scroll cue */}
            <div
                className={`absolute bottom-8 right-8 z-20 flex flex-col items-center gap-2 transition-all duration-700 ${titleVisible ? 'opacity-100' : 'opacity-0'}`
                }
                style={{ transitionDelay: '1.2s' }}>

                <span className="section-label font-semibold" style={{ color: 'rgba(232,196,184,0.6)', writingMode: 'vertical-rl' }}>
                    {t('hero.scroll')}
                </span>
                <div
                    className="w-px h-10"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(232,196,184,0.6), transparent)'
                    }} />

            </div>
        </section>);

}
