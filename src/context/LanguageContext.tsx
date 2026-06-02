'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ka' | 'en' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ka: {
    // Header & Footer Links
    'nav.collection': 'კოლექცია',
    'nav.story': 'ჩვენი ისტორია',
    'nav.gallery': 'გალერეა',
    'nav.delivery': 'მიწოდება',
    'nav.contact': 'კონტაქტი',
    'nav.orderNow': 'შეკვეთა',

    // Hero Section
    'hero.eyebrow': 'თბილისი, საქართველო · დაარსების წელი 2024',
    'hero.title1': 'ლილი',
    'hero.title2': 'როუზი',
    'hero.subtitle': 'ექსკლუზიური ყვავილები და ელეგანტური თაიგულები თბილისში',
    'hero.btnOrder': 'თაიგულის შეკვეთა',
    'hero.btnCollection': 'კოლექციის ნახვა',
    'hero.scroll': 'ჩამოსქროლეთ',

    // Featured Bouquets
    'bouquets.eyebrow': '01 / ჩვენი კოლექცია',
    'bouquets.title1': 'რჩეული',
    'bouquets.title2': 'თაიგულები',
    'bouquets.desc': 'თითოეული თაიგული იქმნება ხელით უახლესი ყვავილებისგან და მიეწოდება იმავე დღეს თბილისის მასშტაბით.',
    'bouquets.customBtn': 'ინდივიდუალური თაიგულის შეკვეთა',
    'bouquets.quickView': 'სწრაფი ნახვა',
    'modal.street': 'ქუჩა, შენობა, ბინა...',
    'modal.orderBtn': 'შეუკვეთე WhatsApp-ით',
    'modal.orderDetails': 'შეკვეთის დეტალები',
    'modal.name': 'სახელი',
    'modal.phone': 'ტელეფონის ნომერი',
    'modal.district': 'უბანი',
    'modal.address': 'მისამართი',
    'modal.description': 'ულამაზესად გაფორმებული ახალი ყვავილები, სათუთად შერჩეული და სიყვარულით შეფუთული. იდეალურია ნებისმიერი შემთხვევისთვის. დეტალებისა და ინდივიდუალური ცვლილებების განსახილველად შეგიძლიათ დაუკავშირდეთ ჩვენს ფლორისტს.',
    'cart.title': 'თქვენი კალათა',
    'cart.empty': 'თქვენი კალათა ცარიელია.',
    'cart.add': 'კალათაში დამატება',
    'cart.total': 'სულ',
    'cart.whatsapp.greeting': 'გამარჯობა, მსურს შემდეგი თაიგულების შეკვეთა:',
    'cart.whatsapp.total': 'ჯამური ფასი:',
    'cart.whatsapp.details': 'ჩემი დეტალები:',
    'cart.whatsapp.name': 'სახელი',
    'cart.whatsapp.phone': 'ტელეფონი',
    'cart.whatsapp.address': 'მისამართი',
    'cart.whatsapp.confirm': 'გთხოვთ დამიდასტუროთ შეკვეთა.',
    'modal.whatsapp.greeting': 'გამარჯობა, მსურს შეკვეთა:',
    'modal.whatsapp.bouquet': 'თაიგული',
    'modal.whatsapp.price': 'ფასი',
    'district.vake': 'ვაკე',
    'district.saburtalo': 'საბურთალო',
    'district.vera': 'ვერა',
    'district.mtatsminda': 'მთაწმინდა',
    'district.chugureti': 'ჩუღურეთი',
    'district.didube': 'დიდუბე',
    'district.isani': 'ისანი',
    'district.samgori': 'სამგორი',
    'district.gldani': 'გლდანი',
    'district.didiDighomi': 'დიდი დიღომი',
    'district.nadzaladevi': 'ნაძალადევი',
    'district.krtsanisi': 'კრწანისი',


    // Bouquet Tags & Names
    'tag.bestseller': 'ბესტსელერი',
    'tag.wedding': 'ქორწილი',
    'tag.new': 'ახალი',
    'tag.premium': 'პრემიუმი',
    'tag.seasonal': 'სეზონური',
    'tag.anniversary': 'საიუბილეო',

    'name.peony': 'ვარდისფერი პეონი',
    'name.peonyGeo': 'Blushing Peony',
    'name.garden': 'ბაღის რომანი',
    'name.gardenGeo': 'Garden Romance',
    'name.elegance': 'თეთრი ელეგანტურობა',
    'name.eleganceGeo': 'White Elegance',
    'name.cascade': 'ვარდების კასკადი',
    'name.cascadeGeo': 'Rose Cascade',
    'name.dream': 'პასტელის სიზმარი',
    'name.dreamGeo': 'Pastel Dream',
    'name.love': 'მარადიული სიყვარული',
    'name.loveGeo': 'Eternal Love',

    // About Section
    'about.eyebrow': '02 / ჩვენი ისტორია',
    'about.title1': 'ყვავილები შექმნილი',
    'about.title2': 'გრძნობით',
    'about.desc1': 'თბილისის გულში დაბადებული „ლილი როუზი“ დაიწყო როგორც პატარა სტუდია ერთი მისიით: თითოეული თაიგული ხელოვნების ნიმუშად გვექცია. ჩვენ გვჯერა, რომ ყვავილებს მოაქვთ ემოცია — სიხარული, სიყვარული, მადლიერება — და ჩვენი საქმე ამ გრძნობების ფურცლებსა და ღეროებში გადატანაა.',
    'about.desc2': 'თითოეული თაიგული იწყობა მიწოდების დღეს, საიმედო მწარმოებლებისგან მიღებული საუკეთესო ყვავილებით. ქორწილისთვის, იუბილესთვის თუ უბრალოდ მოულოდნელი სიყვარულის ჟესტისთვის, ჩვენ თბილისის ყველაზე ელეგანტურ ყვავილოვან დიზაინს თქვენს კარამდე მოვიტანთ.',
    'about.quote': '„ყოველი ყვავილი თავის ისტორიას ყვება. ჩვენ გეხმარებით თქვენი ისტორიის მოყოლაში.“',
    'about.studio': '— ლილი როუზის სტუდია, თბილისი',

    'pillar.crafted': 'ხელნაკეთი',
    'pillar.craftedDesc': 'თითოეული თაიგული იწყობა ხელით განსაკუთრებული ზრუნვითა და სიზუსტით.',
    'pillar.delivery': 'მიწოდება იმავე დღეს',
    'pillar.deliveryDesc': 'ახალი ყვავილები პირდაპირ თქვენს კარამდე თბილისის მასშტაბით რამდენიმე საათში.',
    'pillar.love': 'სიყვარულით გაზრდილი',
    'pillar.loveDesc': 'მიღებული საუკეთესო ქართული და ევროპული ყვავილების ფერმებიდან.',

    'stat.delivered': 'მიწოდებული თაიგული',
    'stat.rating': 'მომხმარებელთა შეფასება',
    'stat.time': 'მიწოდება თბილისში',

    // Instagram Gallery
    'gallery.eyebrow': '03 / ინსტაგრამი',
    'gallery.title1': 'ჩვენი',
    'gallery.title2': 'გალერეა',
    'gallery.followBtn': 'მიყევით ინსტაგრამზე',

    // Delivery Section
    'delivery.eyebrow': '04 / მიწოდება და შეკვეთები',
    'delivery.title1': 'ჩვენი სტუდიიდან',
    'delivery.title2': 'თქვენს კარამდე',

    'del.panel1.title': 'მიწოდება იმავე დღეს',
    'del.panel1.titleGeo': 'Same-Day Delivery',
    'del.panel1.desc': 'შეუკვეთეთ 14:00 საათამდე და მიიღეთ თქვენი ახალი თაიგული თბილისის ნებისმიერ წერტილში იმავე დღეს. ჩვენ ვზრუნავთ ლოჯისტიკაზე — თქვენ ტკბებით მომენტით.',
    'del.panel1.highlight': 'თბილისის მასშტაბით · შეკვეთები 14:00-მდე',

    'del.panel2.title': 'ინდივიდუალური შეკვეთები',
    'del.panel2.titleGeo': 'Custom Orders',
    'del.panel2.desc': 'გაქვთ განსაკუთრებული იდეა? გაგვიზიარეთ ინსტაგრამის ან WhatsApp-ის საშუალებით და ჩვენი ფლორისტები შექმნიან თაიგულს ექსკლუზიურად თქვენთვის.',
    'del.panel2.highlight': 'ქორწილები · ღონისძიებები · საჩუქრები',

    'del.panel3.title': 'მარტივი შეკვეთა',
    'del.panel3.titleGeo': 'Easy Ordering',
    'del.panel3.desc': 'შეუკვეთეთ პირდაპირ ინსტაგრამის შეტყობინებით, ფეისბუქით ან WhatsApp-ით. ყოველგვარი რთული ფორმების გარეშე — უბრალოდ მოგვწერეთ და თაიგული გზაშია.',
    'del.panel3.highlight': 'Instagram · Facebook · WhatsApp',

    // Contact Section
    'contact.eyebrow': '05 / კონტაქტი',
    'contact.title1': 'შეუკვეთეთ თქვენი',
    'contact.title2': 'სრულყოფილი თაიგული',
    'contact.desc': 'დაგვიკავშირდით თქვენთვის სასურველი არხით. ჩვენ გიპასუხებთ რამდენიმე წუთში და მოგაწვდით თაიგულს იმავე დღეს თბილისის მასშტაბით.',
    'contact.available': 'ხელმისაწვდომია ახლა',
    'contact.deliveryNote': 'თბილისი, საქართველო · მიწოდება ქალაქის მასშტაბით იმავე დღეს',
    'contact.locNote': 'თბილისი, საქართველო · მიწოდება იმავე დღეს',
    'contact.whatsAppHandle': 'მოგვწერეთ შეტყობინება',
    'contact.fbHandle': 'ლილი როუზი თბილისი',

    // Footer
    'footer.brand': 'ფუფუნების კლასის ხელნაკეთი თაიგულები. მიწოდება იმავე დღეს თბილისში, საქართველო.',
    'footer.privacy': 'კონფიდენციალურობა',
    'footer.terms': 'პირობები',
    'footer.rights': 'ყველა უფლება დაცულია.',
  },
  en: {
    // Header & Footer Links
    'nav.collection': 'Collection',
    'nav.story': 'Our Story',
    'nav.gallery': 'Gallery',
    'nav.delivery': 'Delivery',
    'nav.contact': 'Contact',
    'nav.orderNow': 'Order Now',

    // Hero Section
    'hero.eyebrow': 'Tbilisi, Georgia · Est. 2024',
    'hero.title1': 'Lily',
    'hero.title2': 'Rose',
    'hero.subtitle': 'Luxury Flowers & Elegant Bouquets in Tbilisi',
    'hero.btnOrder': 'Order Bouquet',
    'hero.btnCollection': 'View Collection',
    'hero.scroll': 'Scroll',

    // Featured Bouquets
    'bouquets.eyebrow': '01 / Our Collection',
    'bouquets.title1': 'Featured',
    'bouquets.title2': 'Bouquets',
    'bouquets.desc': 'Each arrangement is hand-crafted with the freshest blooms, delivered same-day across Tbilisi.',
    'bouquets.customBtn': 'Order a Custom Bouquet',
    'bouquets.quickView': 'Quick View',
    'modal.street': 'Street, Building, Apt...',
    'modal.orderBtn': 'Order via WhatsApp',
    'modal.orderDetails': 'Order Details',
    'modal.name': 'Name',
    'modal.phone': 'Phone Number',
    'modal.district': 'District',
    'modal.address': 'Address',
    'modal.description': 'Beautifully arranged fresh flowers, carefully selected and wrapped with love. Perfect for any occasion. Details and custom modifications can be discussed with our florist.',
    'cart.title': 'Your Cart',
    'cart.empty': 'Your cart is empty.',
    'cart.add': 'Add to Cart',
    'cart.total': 'Total',
    'cart.whatsapp.greeting': 'Hello, I would like to order the following items:',
    'cart.whatsapp.total': 'Total Price:',
    'cart.whatsapp.details': 'My Details:',
    'cart.whatsapp.name': 'Name',
    'cart.whatsapp.phone': 'Phone',
    'cart.whatsapp.address': 'Address',
    'cart.whatsapp.confirm': 'Please confirm my order.',
    'modal.whatsapp.greeting': 'Hello, I would like to order:',
    'modal.whatsapp.bouquet': 'Bouquet',
    'modal.whatsapp.price': 'Price',
    'district.vake': 'Vake',
    'district.saburtalo': 'Saburtalo',
    'district.vera': 'Vera',
    'district.mtatsminda': 'Mtatsminda',
    'district.chugureti': 'Chugureti',
    'district.didube': 'Didube',
    'district.isani': 'Isani',
    'district.samgori': 'Samgori',
    'district.gldani': 'Gldani',
    'district.didiDighomi': 'Didi Dighomi',
    'district.nadzaladevi': 'Nadzaladevi',
    'district.krtsanisi': 'Krtsanisi',


    // Bouquet Tags & Names
    'tag.bestseller': 'Bestseller',
    'tag.wedding': 'Wedding',
    'tag.new': 'New',
    'tag.premium': 'Premium',
    'tag.seasonal': 'Seasonal',
    'tag.anniversary': 'Anniversary',

    'name.peony': 'Blushing Peony',
    'name.peonyGeo': 'ვარდისფერი პეონი',
    'name.garden': 'Garden Romance',
    'name.gardenGeo': 'ბაღის რომანი',
    'name.elegance': 'White Elegance',
    'name.eleganceGeo': 'თეთრი სიმდიდრე',
    'name.cascade': 'Rose Cascade',
    'name.cascadeGeo': 'ვარდების კასკადი',
    'name.dream': 'Pastel Dream',
    'name.dreamGeo': 'პასტელის სიზმარი',
    'name.love': 'Eternal Love',
    'name.loveGeo': 'მარადიული სიყვარული',

    // About Section
    'about.eyebrow': '02 / Our Story',
    'about.title1': 'Flowers crafted with',
    'about.title2': 'intention',
    'about.desc1': 'Born in the heart of Tbilisi, Lily Rose began as a small studio with one mission: to make every bouquet feel like a work of art. We believe flowers carry emotion — joy, love, gratitude — and our job is to translate that feeling into petals and stems.',
    'about.desc2': 'Each arrangement is assembled fresh on the day of delivery, using only the finest blooms sourced from trusted growers. Whether for a wedding, anniversary, or a spontaneous gesture of love, we bring Tbilisi\'s most elegant floral designs to your door.',
    'about.quote': '"Every flower tells a story. We help you tell yours."',
    'about.studio': '— Lily Rose Studio, Tbilisi',

    'pillar.crafted': 'Hand-crafted',
    'pillar.craftedDesc': 'Every bouquet assembled by hand with care and precision.',
    'pillar.delivery': 'Same-day Delivery',
    'pillar.deliveryDesc': 'Fresh to your door anywhere in Tbilisi within hours.',
    'pillar.love': 'Grown with Love',
    'pillar.loveDesc': 'Sourced from trusted Georgian and European flower farms.',

    'stat.delivered': 'Bouquets Delivered',
    'stat.rating': 'Customer Rating',
    'stat.time': 'Delivery in Tbilisi',

    // Instagram Gallery
    'gallery.eyebrow': '03 / Instagram',
    'gallery.title1': 'Our',
    'gallery.title2': 'Gallery',
    'gallery.followBtn': 'Follow on Instagram',

    // Delivery Section
    'delivery.eyebrow': '04 / Delivery & Orders',
    'delivery.title1': 'From our studio',
    'delivery.title2': 'to your door',

    'del.panel1.title': 'Same-Day Delivery',
    'del.panel1.titleGeo': 'მიტანა იმავე დღეს',
    'del.panel1.desc': 'Order before 2 PM and receive your fresh bouquet anywhere in Tbilisi the same day. We handle the logistics — you enjoy the moment.',
    'del.panel1.highlight': 'Tbilisi-wide · Orders by 2 PM',

    'del.panel2.title': 'Custom Orders',
    'del.panel2.titleGeo': 'ინდივიდუალური შეკვეთა',
    'del.panel2.desc': 'Have a specific vision? Share your idea via Instagram or WhatsApp and our florists will craft a bespoke arrangement just for you.',
    'del.panel2.highlight': 'Weddings · Events · Gifts',

    'del.panel3.title': 'Easy Ordering',
    'del.panel3.titleGeo': 'მარტივი შეკვეთა',
    'del.panel3.desc': 'Order directly via Instagram DM, Facebook Messenger, or WhatsApp. No complicated forms — just a message and your bouquet is on its way.',
    'del.panel3.highlight': 'Instagram · Facebook · WhatsApp',

    // Contact Section
    'contact.eyebrow': '05 / Contact Us',
    'contact.title1': 'Order your',
    'contact.title2': 'perfect bouquet',
    'contact.desc': 'Reach us through your preferred channel. We respond within minutes and deliver same-day across Tbilisi.',
    'contact.available': 'Available now',
    'contact.deliveryNote': 'Tbilisi, Georgia · Same-day delivery city-wide',
    'contact.locNote': 'Tbilisi, Georgia · Same-day delivery city-wide',
    'contact.whatsAppHandle': 'Send a message',
    'contact.fbHandle': 'Lily Rose Tbilisi',

    // Footer
    'footer.brand': 'Luxury hand-crafted bouquets. Same-day delivery in Tbilisi, Georgia.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.rights': 'All rights reserved.',
  },
  ru: {
    // Header & Footer Links
    'nav.collection': 'Коллекция',
    'nav.story': 'Наша история',
    'nav.gallery': 'Галерея',
    'nav.delivery': 'Доставка',
    'nav.contact': 'Контакты',
    'nav.orderNow': 'Заказать',

    // Hero Section
    'hero.eyebrow': 'Тбилиси, Грузия · Основано в 2024',
    'hero.title1': 'Лили',
    'hero.title2': 'Роуз',
    'hero.subtitle': 'Эксклюзивные цветы и элегантные букеты в Тбилиси',
    'hero.btnOrder': 'Заказать букет',
    'hero.btnCollection': 'Посмотреть коллекцию',
    'hero.scroll': 'Листайте вниз',

    // Featured Bouquets
    'bouquets.eyebrow': '01 / Наша Коллекция',
    'bouquets.title1': 'Наши лучшие',
    'bouquets.title2': 'Букеты',
    'bouquets.desc': 'Каждая композиция создается вручную из свежайших цветов с доставкой в тот же день по всему Тбилиси.',
    'bouquets.customBtn': 'Заказать индивидуальный букет',
    'bouquets.quickView': 'Быстрый просмотр',
    'modal.street': 'Улица, дом, квартира...',
    'modal.orderBtn': 'Заказать через WhatsApp',
    'modal.orderDetails': 'Детали заказа',
    'modal.name': 'Имя',
    'modal.phone': 'Номер телефона',
    'modal.district': 'Район',
    'modal.address': 'Адрес',
    'modal.description': 'Красиво оформленные свежие цветы, тщательно отобранные и упакованные с любовью. Идеально подходят для любого случая. Детали и индивидуальные изменения можно обсудить с нашим флористом.',
    'cart.title': 'Ваша корзина',
    'cart.empty': 'Ваша корзина пуста.',
    'cart.add': 'Добавить в корзину',
    'cart.total': 'Итого',
    'cart.whatsapp.greeting': 'Здравствуйте, я хотел бы заказать следующие букеты:',
    'cart.whatsapp.total': 'Общая стоимость:',
    'cart.whatsapp.details': 'Мои детали:',
    'cart.whatsapp.name': 'Имя',
    'cart.whatsapp.phone': 'Телефон',
    'cart.whatsapp.address': 'Адрес',
    'cart.whatsapp.confirm': 'Пожалуйста, подтвердите мой заказ.',
    'modal.whatsapp.greeting': 'Здравствуйте, я хотел бы заказать:',
    'modal.whatsapp.bouquet': 'Букет',
    'modal.whatsapp.price': 'Цена',
    'district.vake': 'Ваке',
    'district.saburtalo': 'Сабуртало',
    'district.vera': 'Вера',
    'district.mtatsminda': 'Мтацминда',
    'district.chugureti': 'Чугурети',
    'district.didube': 'Дидубе',
    'district.isani': 'Исани',
    'district.samgori': 'Самгори',
    'district.gldani': 'Глдани',
    'district.didiDighomi': 'Диди Дигоми',
    'district.nadzaladevi': 'Надзаладеви',
    'district.krtsanisi': 'Крцаниси',

    // Bouquet Tags & Names
    'tag.bestseller': 'Хит продаж',
    'tag.wedding': 'Свадьба',
    'tag.new': 'Новинка',
    'tag.premium': 'Премиум',
    'tag.seasonal': 'Сезонные',
    'tag.anniversary': 'Юбилей',

    'name.peony': 'Нежный пион',
    'name.peonyGeo': 'Blushing Peony',
    'name.garden': 'Садовый романс',
    'name.gardenGeo': 'Garden Romance',
    'name.elegance': 'Белая элегантность',
    'name.eleganceGeo': 'White Elegance',
    'name.cascade': 'Каскад роз',
    'name.cascadeGeo': 'Rose Cascade',
    'name.dream': 'Пастельная мечта',
    'name.dreamGeo': 'Pastel Dream',
    'name.love': 'Вечная любовь',
    'name.loveGeo': 'Eternal Love',

    // About Section
    'about.eyebrow': '02 / Наша история',
    'about.title1': 'Цветы, созданные с',
    'about.title2': 'любовью',
    'about.desc1': 'Рожденная в самом сердце Тбилиси, студия Lily Rose начиналась с одной простой миссии: превратить каждый букет в произведение искусства. Мы верим, что цветы передают эмоции — радость, любовь, благодарность — и наша работа — выразить эти чувства в лепестках и стеблях.',
    'about.desc2': 'Каждая композиция собирается свежей непосредственно в день доставки из лучших цветов от проверенных поставщиков. Будь то свадьба, юбилей или просто спонтанный жест любви, мы доставим самые элегантные флористические дизайны Тбилиси прямо к вашей двери.',
    'about.quote': '«Каждый цветок рассказывает историю. Мы помогаем вам рассказать вашу.»',
    'about.studio': '— Студия Lily Rose, Тбилиси',

    'pillar.crafted': 'Ручная работа',
    'pillar.craftedDesc': 'Каждый букет собирается вручную с особым вниманием и заботой.',
    'pillar.delivery': 'Доставка в тот же день',
    'pillar.deliveryDesc': 'Свежие цветы прямо к вашей двери по Тбилиси в течение нескольких часов.',
    'pillar.love': 'Выращено с любовью',
    'pillar.loveDesc': 'Поставляется с лучших грузинских и европейских цветочных ферм.',

    'stat.delivered': 'Доставлено букетов',
    'stat.rating': 'Оценка клиентов',
    'stat.time': 'Доставка по Тбилиси',

    // Instagram Gallery
    'gallery.eyebrow': '03 / Instagram',
    'gallery.title1': 'Наша',
    'gallery.title2': 'Галерея',
    'gallery.followBtn': 'Подписаться в Instagram',

    // Delivery Section
    'delivery.eyebrow': '04 / Доставка и Заказы',
    'delivery.title1': 'Из нашей студии',
    'delivery.title2': 'к вашей двери',

    'del.panel1.title': 'Доставка в тот же день',
    'del.panel1.titleGeo': 'Same-Day Delivery',
    'del.panel1.desc': 'Закажите до 14:00 и получите свежий букет в любой точке Тбилиси в тот же день. Мы берем логистику на себя — вы наслаждаетесь моментом.',
    'del.panel1.highlight': 'По Тбилиси · Заказы до 14:00',

    'del.panel2.title': 'Индивидуальные заказы',
    'del.panel2.titleGeo': 'Custom Orders',
    'del.panel2.desc': 'Есть особые пожелания? Поделитесь своей идеей в Instagram или WhatsApp, и наши флористы создадут букет специально для вас.',
    'del.panel2.highlight': 'Свадьбы · Мероприятия · Подарки',

    'del.panel3.title': 'Простой заказ',
    'del.panel3.titleGeo': 'Easy Ordering',
    'del.panel3.desc': 'Заказывайте напрямую через Instagram DM, Facebook Messenger или WhatsApp. Никаких сложных форм — просто напишите нам, и букет уже в пути.',
    'del.panel3.highlight': 'Instagram · Facebook · WhatsApp',

    // Contact Section
    'contact.eyebrow': '05 / Контакты',
    'contact.title1': 'Закажите ваш',
    'contact.title2': 'идеальный букет',
    'contact.desc': 'Свяжитесь с нами любым удобным способом. Мы отвечаем в течение нескольких минут и доставляем в тот же день по всему Тбилиси.',
    'contact.available': 'Доступно сейчас',
    'contact.deliveryNote': 'Тбилиси, Грузия · Доставка в тот же день по всему городу',
    'contact.locNote': 'Тбилиси, Грузия · Доставка в тот же день',
    'contact.whatsAppHandle': 'Написать сообщение',
    'contact.fbHandle': 'Lily Rose Тбилиси',

    // Footer
    'footer.brand': 'Роскошные букеты ручной работы. Доставка в тот же день в Тбилиси, Грузия.',
    'footer.privacy': 'Политика конфиденциальности',
    'footer.terms': 'Условия использования',
    'footer.rights': 'Все права защищены.',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ka');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language') as Language;
      if (savedLang && (savedLang === 'ka' || savedLang === 'en' || savedLang === 'ru')) {
        setLanguageState(savedLang);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['ka'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
