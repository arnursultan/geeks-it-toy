const geeksLogo = '/geeks-logo.svg';

export type Technology = { name: string; icon: string; color?: string };

const organizationId = '70000001054702939';
// Координаты точки Geeks из ссылки 2ГИС для маршрута и центрирования виджета.
const mapPoint = { lat: 40.51932, lon: 72.80285 };
const mapZoom = 16;
const dateLabel = '7 ноября 2026 года';
const startTime = '13:00';
const brand = (name: string, icon: string, color: string): Technology => ({ name, icon, color });
const concept = (name: string, icon: string): Technology => ({ name, icon });

const fullstackCore = [
  brand('HTML5', 'html5', 'E34F26'),
  brand('CSS3', 'css3', '1572B6'),
  brand('JavaScript', 'javascript', 'F7DF1E'),
  brand('TypeScript', 'typescript', '3178C6'),
  brand('React', 'react', '61DAFB'),
  brand('Node.js', 'nodedotjs', '339933'),
  brand('Express.js', 'express', 'FFFFFF'),
  brand('PostgreSQL', 'postgresql', '4169E1'),
  concept('SQL', 'database'),
];
const fullstackTools = [
  brand('Git', 'git', 'F05032'),
  brand('GitHub', 'github', 'FFFFFF'),
  brand('Vite', 'vite', '646CFF'),
  brand('npm', 'npm', 'CB3837'),
  concept('REST API', 'api'),
  concept('JWT', 'jwt'),
  brand('Postman', 'postman', 'FF6C37'),
  brand('Figma', 'figma', 'F24E1E'),
  brand('Next.js', 'nextdotjs', 'FFFFFF'),
];
const backendCore = [
  brand('Python', 'python', '3776AB'),
  brand('Django', 'django', '44B78B'),
  concept('Django REST Framework (DRF)', 'api'),
  brand('PostgreSQL', 'postgresql', '4169E1'),
  concept('SQL', 'database'),
];
const backendTools = [
  brand('FastAPI', 'fastapi', '009688'),
  brand('Redis', 'redis', 'FF4438'),
  brand('Celery', 'celery', '37814A'),
  brand('Docker', 'docker', '2496ED'),
  brand('Linux', 'linux', 'FCC624'),
  brand('Git', 'git', 'F05032'),
  brand('GitHub', 'github', 'FFFFFF'),
  brand('Pytest', 'pytest', '0A9EDC'),
  brand('Ruff', 'ruff', 'D7FF64'),
  concept('REST API', 'api'),
  concept('JWT', 'jwt'),
];
const flutterCore = [
  brand('Dart', 'dart', '0175C2'),
  brand('Flutter', 'flutter', '54C5F8'),
  concept('BLoC', 'state'),
  concept('Cubit', 'state'),
  concept('Riverpod', 'state'),
];
const flutterTools = [
  brand('Firebase', 'firebase', 'DD2C00'),
  concept('REST API', 'api'),
  concept('Dio', 'api'),
  concept('Clean Architecture', 'architecture'),
  concept('MVVM', 'architecture'),
  brand('Git', 'git', 'F05032'),
  brand('GitHub', 'github', 'FFFFFF'),
];
const designCore = [
  brand('Figma', 'figma', 'F24E1E'),
  brand('FigJam', 'figma', 'F24E1E'),
  concept('UX Research', 'research'),
  concept('UI Design', 'design'),
];
const designTools = [
  concept('Design Systems', 'layers'),
  concept('UI Kit', 'layers'),
  concept('Prototyping', 'prototype'),
  concept('Wireframing', 'wireframe'),
  concept('User Flow', 'flow'),
  brand('Material Design', 'materialdesign', '757575'),
  concept('iOS Human Interface Guidelines', 'guidelines'),
  brand('Behance', 'behance', '1769FF'),
];

/** Официальный Geeks asset взят из страницы IT-академии it.geeks.kg. */
export const event = {
  dateTime: '2026-11-07T13:00:00+06:00',
  dateLabel,
  dateShort: '07.11.2026',
  startTime,
  timeZone: 'Asia/Bishkek',
  city: 'Ош',
  country: 'Кыргызстан',
  organizer: 'IT-академия Geeks',
  venue: 'Geeks',
  address: 'Кыргызстан, город Ош, ул. Мырзалы Аматова, 1, цокольный этаж, ЖК «Томирис».',
  mapUrl: `https://2gis.kg/osh/firm/${organizationId}`,
  routeUrl: `https://2gis.kg/osh/directions/points/%7C${encodeURIComponent(`${mapPoint.lon},${mapPoint.lat};${organizationId}`)}`,
  // Официальный 2ГИС widget for firmsonmap, привязан к карточке Geeks по ID.
  mapPreviewUrl: `https://widgets.2gis.com/widget?type=firmsonmap&options=${encodeURIComponent(JSON.stringify({ pos: { ...mapPoint, zoom: mapZoom }, opt: { city: 'osh' }, org: organizationId }))}&lang=ru`,
  mapProvider: '2ГИС',
  officialGeeksLogo: geeksLogo,
  contacts: {
    whatsappPhone: '+996 990 082 021',
    whatsapp: 'https://wa.me/996990082021',
    calls: [
      { phone: '+996 507 052 018', link: 'tel:+996507052018' },
      { phone: '+996 557 052 018', link: 'tel:+996557052018' },
      { phone: '+996 777 052 018', link: 'tel:+996777052018' },
    ],
    instagramHandle: '@geeks_osh',
    instagram: 'https://www.instagram.com/geeks_osh/',
  },
  terminalLines: [
    'Инициализация мероприятия...',
    'Загрузка системы Geeks...',
    'Определение локации: Ош, Кыргызстан',
    'Событие: IT ТОЙ',
    `Дата: ${dateLabel}`,
    `Время: ${startTime}`,
    'Статус: ГОТОВ К ЗАПУСКУ',
    'Добро пожаловать в мир IT!',
  ],
  tracks: [
    {
      id: '01',
      name: 'Fullstack JavaScript',
      code: 'WEB / FULL CYCLE',
      color: 'yellow',
      description: 'Полный цикл веб-разработки — от пользовательского интерфейса до серверной логики и баз данных.',
      featured: fullstackCore.slice(0, 4),
      stacks: [
        { label: 'Основной стек', items: fullstackCore },
        { label: 'Дополнительные инструменты', items: fullstackTools },
      ],
    },
    {
      id: '02',
      name: 'Backend Python',
      code: 'SERVER / API',
      color: 'green',
      description: 'Серверная разработка, API, базы данных, бизнес-логика и инфраструктура приложений.',
      featured: backendCore.slice(0, 4),
      stacks: [
        { label: 'Основной стек', items: backendCore },
        { label: 'Дополнительные технологии и инструменты', items: backendTools },
      ],
    },
    {
      id: '03',
      name: 'Flutter',
      code: 'CROSS-PLATFORM / APP',
      color: 'blue',
      description: 'Создание кроссплатформенных мобильных приложений для Android и iOS.',
      featured: flutterCore.slice(0, 4),
      stacks: [
        { label: 'Основной стек', items: flutterCore },
        { label: 'Дополнительные технологии и инструменты', items: flutterTools },
      ],
    },
    {
      id: '04',
      name: 'UX/UI Design',
      code: 'RESEARCH / DESIGN',
      color: 'pink',
      description: 'Исследование пользовательского опыта, проектирование интерфейсов и создание дизайн-систем.',
      featured: designCore.slice(0, 4),
      stacks: [
        { label: 'Основной стек', items: designCore },
        { label: 'Инструменты и практики', items: designTools },
      ],
    },
  ],
  discounts: [
    { value: '50%', title: 'Скидка', note: 'Розыгрыш скидки от Geeks' },
    { value: '100%', title: 'Скидка', note: 'Розыгрыш скидки от Geeks' },
    { value: '＋', title: 'Другие специальные скидки', note: 'Предложения от Geeks' },
  ],
};
