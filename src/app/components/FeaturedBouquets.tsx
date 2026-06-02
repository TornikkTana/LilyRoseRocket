'use client';

import React, { useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import QuickViewModal from '@/app/components/QuickViewModal';

export interface Bouquet {
    id: number;
    nameKey: string;
    subNameKey: string;
    price: string;
    tagKey: string;
    src: string;
    alt: string;
}

const BOUQUETS: Bouquet[] = [
    {
        id: 1,
        nameKey: 'name.peony',
        subNameKey: 'name.peonyGeo',
        price: '₾ 85',
        tagKey: 'tag.bestseller',
        src: "https://scontent.fkut1-1.fna.fbcdn.net/v/t51.82787-15/652765392_17880717117478348_3564240963677241333_n.jpg?stp=dst-jpegr_tt6&_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFKkKPsxGR8IGXM-8oCOSTqvhS6CYyBgSm-FLoJjIGBKfds9Lgwii2aku776BDkxRe-jDryQ8EEU7h2cFp41cHp&_nc_ohc=iXdr7ksPkN8Q7kNvwHWzJaJ&_nc_oc=AdqwSfgwPa7pHEL2Cb8kcgwamuWxVJn8-OZ4W1mq5hK9o3LJin3NDRBkWYG5QYCbtx20XZM9uojcni94JNM7dDph&_nc_zt=23&se=-1&_nc_ht=scontent.fkut1-1.fna&_nc_gid=AqpT9podiU-C_j983xoihA&_nc_ss=7b2a8&oh=00_Af_IljxIO6cjcWrbG8t-1Sdb-xOIE-xqipg1Wl7HB9QkWw&oe=6A23DFD7",
        alt: 'Lush pink peony bouquet with soft petals in cream wrapping'
    },
    {
        id: 2,
        nameKey: 'name.garden',
        subNameKey: 'name.gardenGeo',
        price: '₾ 110',
        tagKey: 'tag.wedding',
        src: "https://scontent.fkut1-1.fna.fbcdn.net/v/t51.82787-15/652010487_17880567489478348_4931587550175658259_n.jpg?stp=dst-jpegr_tt6&_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFezujDg94lfilF7Zx4j9RxAiornmoporkCKiueaimiuePfrgRtg8sqgl7BMZiEc63DldWO2Obi_YYlvZNR_wJX&_nc_ohc=txf-xJMcAHEQ7kNvwG3DFsf&_nc_oc=AdrXcYMBO1EMFkqiSo4nlg58_e8zT7HWzBW3n1PboMGvgzX0yAWdHS7qp_lI4oChsffQVFfGnWzaQblzT7TlaHK9&_nc_zt=23&se=-1&_nc_ht=scontent.fkut1-1.fna&_nc_gid=Yae2SaIuyZHB-JxI28yAeA&_nc_ss=7b2a8&oh=00_Af-lWAKmV3FgASsjmhyw4UeLT7pili0bV9ZMX8nD_qHD1Q&oe=6A23D4A3",
        alt: 'Mixed garden roses and greenery luxury arrangement'
    },
    {
        id: 3,
        nameKey: 'name.elegance',
        subNameKey: 'name.eleganceGeo',
        price: '₾ 95',
        tagKey: 'tag.new',
        src: "https://scontent.fkut1-1.fna.fbcdn.net/v/t51.82787-15/639923383_17877717879478348_274899717743265913_n.jpg?stp=dst-jpegr_tt6&_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFnopLzbUMaT4a1YBk8UO9aZN4wes-4BoZk3jB6z7gGhpk2g6fFkJf_Lbt9d9_zzESsUZ-JS8jofBOJMOy5qOxg&_nc_ohc=zbCqP8-wGhoQ7kNvwG5K6-G&_nc_oc=AdqSE4ADnZkq6zUtjzcfHTuhNLwyJ9N-9DCvTjtAQRvOnFvwB42Dd5Z5xtDS6_6kLZlRdj9H4K67HFOK4TwcDpoB&_nc_zt=23&se=-1&_nc_ht=scontent.fkut1-1.fna&_nc_gid=jztrnTss8QW4ZOlP7IWpoQ&_nc_ss=7b2a8&oh=00_Af9SnOzJ0Wat-B-Ld_6FVGzzf5wt9YwC3hoXBPFj4ngDjQ&oe=6A23D3F3",
        alt: 'Pure white rose and lily arrangement with sage foliage'
    },
    {
        id: 4,
        nameKey: 'name.cascade',
        subNameKey: 'name.cascadeGeo',
        price: '₾ 130',
        tagKey: 'tag.premium',
        src: "https://scontent.fkut1-1.fna.fbcdn.net/v/t51.82787-15/641334461_17878204869478348_5228967261116764074_n.jpg?stp=dst-jpegr_tt6&_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeH_n52mb-JCqwwT5xidWSMp8Uq0I8TByd3xSrQjxMHJ3X3TuQWEnyVYs92og4Lvt3SOFCMuANkNaE1dlG24Fsc2&_nc_ohc=Lp2cgkFH9kwQ7kNvwGbICv0&_nc_oc=Adpx-ehv2-Q1774ecwoGoMAR-wsWZ1LOaUa5-YJwZNCDOGWl5a-4SeOHkFET1sGMF26nJBHX0aDUz0ov1fM2mmAU&_nc_zt=23&se=-1&_nc_ht=scontent.fkut1-1.fna&_nc_gid=cR0wGtN-eqxnUVgmek97XA&_nc_ss=7b2a8&oh=00_Af-yQClSd0ulym9JOQmGXibBvsTk_GmIdC8AnOK2wsd_yg&oe=6A23C963",
        alt: 'Cascading deep red and blush rose bridal bouquet'
    },
    {
        id: 5,
        nameKey: 'name.dream',
        subNameKey: 'name.dreamGeo',
        price: '₾ 75',
        tagKey: 'tag.seasonal',
        src: "https://scontent.fkut1-1.fna.fbcdn.net/v/t39.30808-6/626716351_122165146550821799_8257779760828257917_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHogT_61eICUTDxTL5TXiEPepEcO3U5RIN6kRw7dTlEg1PibAFf5b0LSLRCNbgrDY80t5ZWPaMDqaaBWUCcfyLn&_nc_ohc=RFhd8H0QRLAQ7kNvwFmA0Bg&_nc_oc=AdrhdLFl0zKiEZYbR3AdIG6peF60WILgtzYoV4mmCl5tYEgf12N45tWFiyyvsTEst5TfZUFtWLt5L0ZLY6Ze1ecj&_nc_zt=23&_nc_ht=scontent.fkut1-1.fna&_nc_gid=Qydp5_0j0ybehFbJS8qWSg&_nc_ss=7b2a8&oh=00_Af-oGBeWOEOltQ3u3-ZbAmo6Sb0Ocr6VWwWbUGwkNhh1og&oe=6A23DF94",
        alt: 'Soft pastel mixed flowers in blush pink and lavender tones'
    },
    {
        id: 6,
        nameKey: 'name.love',
        subNameKey: 'name.loveGeo',
        price: '₾ 155',
        tagKey: 'tag.anniversary',
        src: "https://scontent.fkut1-1.fna.fbcdn.net/v/t51.82787-15/625550129_17875215279478348_4709832487333256111_n.jpg?stp=dst-jpegr_tt6&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeF45BqNxPRezUfpZtpVzYtjDJEHmaiOF0kMkQeZqI4XSZroxxVdvh8EVIZO4eC42IRNXeh9kZiVZbyc_g1ZkzNB&_nc_ohc=5N78oPXKP_MQ7kNvwEG4Ejg&_nc_oc=AdpFU_HzgcUEzSmWYwXiOmPZc_kcwauEURvnem5K-axluJyKGuyZruI4iejynpQrPfMzqM9b__a0jzzlgsDm9Awl&_nc_zt=23&se=-1&_nc_ht=scontent.fkut1-1.fna&_nc_gid=KqT_Xzdi9HJCmpLPWkMYOA&_nc_ss=7b2a8&oh=00_Af-pbDupzBdfTOgejXYdLi_KYCZv4kRKU052qUlBKJ_aJw&oe=6A23BFFA",
        alt: 'Grand luxury bouquet with red roses and gold accents for anniversaries'
    }];

export default function FeaturedBouquets() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();
    const { addToCart } = useCart();
    const [selectedBouquet, setSelectedBouquet] = React.useState<Bouquet | null>(null);

    useEffect(() => {
        const els = sectionRef.current?.querySelectorAll('.fade-up');
        if (!els) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
        );
        els.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="collection"
            ref={sectionRef}
            className="bg-background py-24 md:py-32 px-6 md:px-10">

            <div className="max-w-[1400px] mx-auto">
                {/* Section header */}
                <div className="mb-14 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 fade-up">
                    <div>
                        <span className="section-label mb-3 block">{t('bouquets.eyebrow')}</span>
                        <h2 className="font-display text-section-title font-light text-foreground">
                            {t('bouquets.title1')}{' '}
                            <span className="italic" style={{ color: 'var(--accent)' }}>
                                {t('bouquets.title2')}
                            </span>
                        </h2>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-xs leading-relaxed md:text-right">
                        {t('bouquets.desc')}
                    </p>
                </div>

                {/* Grid — 6 cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {BOUQUETS.map((bouquet, i) =>
                        <article
                            key={bouquet.id}
                            className={`group bouquet-card bg-card rounded-xl overflow-hidden fade-up stagger-${Math.min(i + 1, 6)}`}
                            style={{ boxShadow: '0 2px 16px rgba(26,18,8,0.06)' }}>

                            {/* Image */}
                            <div className="relative overflow-hidden" style={{ height: '340px' }}>
                                <AppImage
                                    src={bouquet.src}
                                    alt={bouquet.alt}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="card-img object-cover" />

                                {/* Tag badge */}
                                <div className="absolute top-4 left-4 z-10">
                                    <span
                                        className="text-xs font-semibold tracking-wider px-3 py-1 rounded-full"
                                        style={{
                                            backgroundColor: 'rgba(253,248,243,0.92)',
                                            color: 'var(--accent)',
                                            backdropFilter: 'blur(8px)'
                                        }}>

                                        {t(bouquet.tagKey)}
                                    </span>
                                </div>
                                {/* Quick view overlay */}
                                <div className="absolute inset-0 flex items-end justify-center pb-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-2">
                                    <button
                                        onClick={() => setSelectedBouquet(bouquet)}
                                        className="pill-btn text-xs font-semibold hover:-translate-y-1 transition-transform"
                                        style={{
                                            backgroundColor: 'rgba(253,248,243,0.92)',
                                            color: 'var(--primary)',
                                            backdropFilter: 'blur(8px)'
                                        }}>
                                        {t('bouquets.quickView')}
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); addToCart(bouquet); }}
                                        className="pill-btn text-xs font-semibold hover:-translate-y-1 transition-transform"
                                        style={{
                                            backgroundColor: 'var(--primary)',
                                            color: 'var(--background)',
                                            boxShadow: '0 4px 12px rgba(26,18,8,0.1)'
                                        }}>
                                        {t('cart.add')}
                                    </button>
                                </div>
                            </div>

                            {/* Card info */}
                            <div className="p-5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-card-title font-display font-semibold text-foreground leading-tight">
                                        {t(bouquet.nameKey)}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">{t(bouquet.subNameKey)}</p>
                                </div>
                                <span
                                    className="font-roboto text-lg font-semibold"
                                    style={{ color: 'var(--accent)' }}>

                                    {bouquet.price}
                                </span>
                            </div>
                        </article>
                    )}
                </div>

                {/* CTA row */}
                <div className="mt-14 flex justify-center fade-up">
                    <a href="#contact" className="pill-btn pill-btn-outline font-bold">
                        {t('bouquets.customBtn')}
                    </a>
                </div>
            </div>

            {/* Quick View Modal */}
            {selectedBouquet && (
                <QuickViewModal
                    bouquet={selectedBouquet}
                    onClose={() => setSelectedBouquet(null)}
                />
            )}
        </section>);

}
