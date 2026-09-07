export const LANGUAGES = ["ar", "ru", "tr", "en", "ka"] as const;

export type LangCode = (typeof LANGUAGES)[number];

export interface Phrases {
  name: string;
  native: string;
  code: string;
  dir: "ltr" | "rtl";
  greet: string;
  langShort: string;
  homeSub: string;
  reportT: string;
  reportS: string;
  itemT: string;
  itemS: string;
  serviceT: string;
  serviceS: string;
  checkoutT: string;
  checkoutS: string;
  infoT: string;
  infoS: string;
  back: string;
  menuShort: string;
  view: string;
  chooseLang: string;
  problemTitle: string;
  problemSub: string;
  ac: string;
  tv: string;
  wifi: string;
  water: string;
  noise: string;
  cleaning: string;
  other: string;
  describe: string;
  placeholder: string;
  addPhoto: string;
  photoAdded: string;
  send: string;
  reassure: string;
  itemsTitle: string;
  itemsSub: string;
  towels: string;
  pillow: string;
  iron: string;
  slippers: string;
  water2: string;
  kit: string;
  sendRequest: string;
  serviceTitle: string;
  serviceSub: string;
  checkoutTitle: string;
  checkoutSub: string;
  free: string;
  infoTitle: string;
  tapCopy: string;
  copied: string;
  add: string;
  remove: string;
  breakfast: string;
  spa: string;
  reception: string;
  checkoutRow: string;
  successTitle: string;
  successSub: string;
  confirmTitle: string;
  received: string;
  inProgress: string;
  done: string;
  etaLabel: string;
  eta: string;
  waiting: string;
  doneNote: string;
  replyPlaceholder: string;
  you: string;
  frontDesk: string;
  translated: string;
  justNow: string;
}

export const DICTIONARY: Record<LangCode, Phrases> = {
  ar: {
    name: "Arabic",
    native: "العربية",
    code: "AR",
    dir: "rtl",
    greet: "أهلاً بك",
    langShort: "العربية",
    homeSub: "اطلب ما تحتاجه بلغتك. الاستقبال يرى طلبك في نفس اللحظة.",
    reportT: "الإبلاغ عن مشكلة",
    reportS: "التكييف، التلفاز، الواي فاي، الماء الساخن، الضجيج",
    itemT: "طلب أغراض",
    itemS: "مناشف، وسادة، مكواة",
    serviceT: "خدمة الغرف",
    serviceS: "حتى 23:00",
    checkoutT: "تأخير المغادرة",
    checkoutS: "حسب التوفر",
    infoT: "الفندق والواي فاي",
    infoS: "كلمة المرور والمواعيد",
    back: "رجوع",
    menuShort: "الرئيسية",
    view: "عرض",
    chooseLang: "اللغة",
    problemTitle: "ما هي المشكلة؟",
    problemSub: "اختر ما ينطبق وأضف ملاحظة إن أردت.",
    ac: "التكييف",
    tv: "التلفاز",
    wifi: "الواي فاي",
    water: "الماء الساخن",
    noise: "الضجيج",
    cleaning: "التنظيف",
    other: "شيء آخر",
    describe: "تفاصيل إضافية (اختياري)",
    placeholder: "المكيف يصدر صوتاً عالياً في الليل…",
    addPhoto: "إضافة صورة",
    photoAdded: "IMG_2043.jpg مرفقة",
    send: "إرسال إلى الاستقبال",
    reassure:
      "اكتب بلغتك بحرية. الموظفون يقرأون طلبك بالإنجليزية ويجيبونك بالعربية.",
    itemsTitle: "ماذا تحتاج؟",
    itemsSub: "نوصله إلى بابك.",
    towels: "مناشف",
    pillow: "وسادة إضافية",
    iron: "مكواة",
    slippers: "شبشب",
    water2: "مياه شرب",
    kit: "أدوات نظافة",
    sendRequest: "إرسال الطلب",
    serviceTitle: "خدمة الغرف",
    serviceSub: "المطبخ مفتوح حتى 23:00. التوصيل ~25 دقيقة.",
    checkoutTitle: "تأخير المغادرة",
    checkoutSub: "الاستقبال يؤكد خلال دقائق.",
    free: "مجاناً",
    infoTitle: "معلومات الفندق",
    tapCopy: "اضغط للنسخ",
    copied: "تم النسخ",
    add: "إضافة",
    remove: "إزالة",
    breakfast: "الإفطار",
    spa: "السبا والمسبح",
    reception: "الاستقبال",
    checkoutRow: "المغادرة",
    successTitle: "تم الإرسال",
    successSub: "الاستقبال استلم طلبك. سنبقيك على علم.",
    confirmTitle: "طلبك قيد المتابعة",
    received: "تم الاستلام",
    inProgress: "قيد التنفيذ",
    done: "تم",
    etaLabel: "الوقت المتوقع",
    eta: "15 دقيقة",
    waiting: "الاستقبال يراجع طلبك الآن.",
    doneNote: "أُنجز طلبك. نتمنى لك إقامة طيبة.",
    replyPlaceholder: "اكتب رسالة…",
    you: "أنت",
    frontDesk: "الاستقبال",
    translated: "مترجم إلى العربية",
    justNow: "الآن",
  },

  ru: {
    name: "Russian",
    native: "Русский",
    code: "RU",
    dir: "ltr",
    greet: "Добро пожаловать",
    langShort: "Русский",
    homeSub: "Попросите что угодно на своём языке. Ресепшн видит запрос сразу.",
    reportT: "Сообщить о проблеме",
    reportS: "Кондиционер, ТВ, WiFi, горячая вода, шум",
    itemT: "Попросить вещи",
    itemS: "Полотенца, подушка, утюг",
    serviceT: "Room service",
    serviceS: "До 23:00",
    checkoutT: "Поздний выезд",
    checkoutS: "По наличию",
    infoT: "Отель и WiFi",
    infoS: "Пароль и часы работы",
    back: "Назад",
    menuShort: "Главная",
    view: "Открыть",
    chooseLang: "Язык",
    problemTitle: "Что случилось?",
    problemSub: "Выберите подходящее и добавьте детали.",
    ac: "Кондиционер",
    tv: "Телевизор",
    wifi: "WiFi",
    water: "Горячая вода",
    noise: "Шум",
    cleaning: "Уборка",
    other: "Другое",
    describe: "Подробнее (необязательно)",
    placeholder: "Кондиционер сильно шумит ночью…",
    addPhoto: "Добавить фото",
    photoAdded: "IMG_2043.jpg прикреплён",
    send: "Отправить на ресепшн",
    reassure:
      "Пишите свободно по-русски. Персонал читает по-английски и ответит вам на русском.",
    itemsTitle: "Что вам нужно?",
    itemsSub: "Принесём в номер.",
    towels: "Полотенца",
    pillow: "Подушка",
    iron: "Утюг",
    slippers: "Тапочки",
    water2: "Питьевая вода",
    kit: "Набор для душа",
    sendRequest: "Отправить запрос",
    serviceTitle: "Room service",
    serviceSub: "Кухня до 23:00. Доставка ~25 мин.",
    checkoutTitle: "Поздний выезд",
    checkoutSub: "Ресепшн подтвердит за несколько минут.",
    free: "Бесплатно",
    infoTitle: "Об отеле",
    tapCopy: "Нажмите, чтобы скопировать",
    copied: "Скопировано",
    add: "Добавить",
    remove: "Убрать",
    breakfast: "Завтрак",
    spa: "Спа и бассейн",
    reception: "Ресепшн",
    checkoutRow: "Выезд",
    successTitle: "Отправлено",
    successSub: "Ресепшн получил запрос. Будем держать вас в курсе.",
    confirmTitle: "Запрос в работе",
    received: "Принято",
    inProgress: "В работе",
    done: "Готово",
    etaLabel: "Ожидаемое время",
    eta: "15 мин",
    waiting: "Ресепшн сейчас смотрит ваш запрос.",
    doneNote: "Всё готово. Хорошего отдыха.",
    replyPlaceholder: "Написать сообщение…",
    you: "Вы",
    frontDesk: "Ресепшн",
    translated: "переведено на русский",
    justNow: "только что",
  },

  tr: {
    name: "Turkish",
    native: "Türkçe",
    code: "TR",
    dir: "ltr",
    greet: "Hoş geldiniz",
    langShort: "Türkçe",
    homeSub: "İhtiyacınızı kendi dilinizde yazın. Resepsiyon anında görür.",
    reportT: "Sorun bildir",
    reportS: "Klima, TV, WiFi, sıcak su, gürültü",
    itemT: "Bir şey iste",
    itemS: "Havlu, yastık, ütü",
    serviceT: "Oda servisi",
    serviceS: "23:00’a kadar",
    checkoutT: "Geç çıkış",
    checkoutS: "Müsaitliğe bağlı",
    infoT: "Otel & WiFi",
    infoS: "Şifre ve saatler",
    back: "Geri",
    menuShort: "Ana sayfa",
    view: "Gör",
    chooseLang: "Dil",
    problemTitle: "Sorun nedir?",
    problemSub: "Uygun olanı seçin, isterseniz not ekleyin.",
    ac: "Klima",
    tv: "TV",
    wifi: "WiFi",
    water: "Sıcak su",
    noise: "Gürültü",
    cleaning: "Temizlik",
    other: "Diğer",
    describe: "Biraz daha anlatın (isteğe bağlı)",
    placeholder: "Klima geceleri çok ses yapıyor…",
    addPhoto: "Fotoğraf ekle",
    photoAdded: "IMG_2043.jpg eklendi",
    send: "Resepsiyona gönder",
    reassure:
      "Türkçe rahatça yazın. Personel İngilizce okur ve size Türkçe yanıt verir.",
    itemsTitle: "Neye ihtiyacınız var?",
    itemsSub: "Kapınıza getiririz.",
    towels: "Havlu",
    pillow: "Ekstra yastık",
    iron: "Ütü",
    slippers: "Terlik",
    water2: "İçme suyu",
    kit: "Duş seti",
    sendRequest: "Talebi gönder",
    serviceTitle: "Oda servisi",
    serviceSub: "Mutfak 23:00’a kadar. Teslimat ~25 dk.",
    checkoutTitle: "Geç çıkış",
    checkoutSub: "Resepsiyon dakikalar içinde onaylar.",
    free: "Ücretsiz",
    infoTitle: "Otel bilgisi",
    tapCopy: "Kopyalamak için dokunun",
    copied: "Kopyalandı",
    add: "Ekle",
    remove: "Çıkar",
    breakfast: "Kahvaltı",
    spa: "Spa & havuz",
    reception: "Resepsiyon",
    checkoutRow: "Çıkış",
    successTitle: "Gönderildi",
    successSub: "Resepsiyon talebinizi aldı. Sizi haberdar edeceğiz.",
    confirmTitle: "Talebiniz işlemde",
    received: "Alındı",
    inProgress: "İşlemde",
    done: "Tamam",
    etaLabel: "Tahmini süre",
    eta: "15 dk",
    waiting: "Resepsiyon talebinizi inceliyor.",
    doneNote: "Her şey tamam. İyi tatiller.",
    replyPlaceholder: "Mesaj yazın…",
    you: "Siz",
    frontDesk: "Resepsiyon",
    translated: "Türkçeye çevrildi",
    justNow: "az önce",
  },

  en: {
    name: "English",
    native: "English",
    code: "EN",
    dir: "ltr",
    greet: "Welcome",
    langShort: "English",
    homeSub:
      "Ask for anything in your own language. The front desk sees it right away.",
    reportT: "Report a problem",
    reportS: "AC, TV, WiFi, hot water, noise",
    itemT: "Request items",
    itemS: "Towels, pillow, iron",
    serviceT: "Room service",
    serviceS: "Until 23:00",
    checkoutT: "Late checkout",
    checkoutS: "Subject to availability",
    infoT: "Hotel & WiFi",
    infoS: "Password and hours",
    back: "Back",
    menuShort: "Home",
    view: "View",
    chooseLang: "Language",
    problemTitle: "What’s wrong?",
    problemSub: "Pick what applies and add a note if you like.",
    ac: "AC",
    tv: "TV",
    wifi: "WiFi",
    water: "Hot water",
    noise: "Noise",
    cleaning: "Cleaning",
    other: "Other",
    describe: "Tell us more (optional)",
    placeholder: "The AC makes a loud noise at night…",
    addPhoto: "Add a photo",
    photoAdded: "IMG_2043.jpg attached",
    send: "Send to front desk",
    reassure:
      "Write freely in your language. Staff read it in English and answer back in yours.",
    itemsTitle: "What do you need?",
    itemsSub: "Delivered to your door.",
    towels: "Towels",
    pillow: "Extra pillow",
    iron: "Iron",
    slippers: "Slippers",
    water2: "Drinking water",
    kit: "Shower kit",
    sendRequest: "Send request",
    serviceTitle: "Room service",
    serviceSub: "Kitchen open until 23:00. Delivery ~25 min.",
    checkoutTitle: "Late checkout",
    checkoutSub: "The front desk confirms within minutes.",
    free: "Free",
    infoTitle: "Hotel info",
    tapCopy: "Tap to copy",
    copied: "Copied",
    add: "Add",
    remove: "Remove",
    breakfast: "Breakfast",
    spa: "Spa & pool",
    reception: "Reception",
    checkoutRow: "Checkout",
    successTitle: "Sent",
    successSub: "The front desk has your request. We’ll keep you posted.",
    confirmTitle: "Your request is live",
    received: "Received",
    inProgress: "In progress",
    done: "Done",
    etaLabel: "Estimated time",
    eta: "15 min",
    waiting: "The front desk is looking at your request now.",
    doneNote: "All done. Enjoy your stay.",
    replyPlaceholder: "Write a message…",
    you: "You",
    frontDesk: "Front desk",
    translated: "translated for you",
    justNow: "just now",
  },

  ka: {
    name: "Georgian",
    native: "ქართული",
    code: "KA",
    dir: "ltr",
    greet: "მოგესალმებით",
    langShort: "ქართული",
    homeSub: "მოითხოვეთ ყველაფერი თქვენს ენაზე. მიმღები მაშინვე ხედავს.",
    reportT: "პრობლემის შეტყობინება",
    reportS: "კონდიციონერი, TV, WiFi, ცხელი წყალი, ხმაური",
    itemT: "ნივთის მოთხოვნა",
    itemS: "პირსახოცი, ბალიში, უთო",
    serviceT: "ოთახის სერვისი",
    serviceS: "23:00-მდე",
    checkoutT: "გვიანი გასვლა",
    checkoutS: "ხელმისაწვდომობის მიხედვით",
    infoT: "სასტუმრო და WiFi",
    infoS: "პაროლი და საათები",
    back: "უკან",
    menuShort: "მთავარი",
    view: "ნახვა",
    chooseLang: "ენა",
    problemTitle: "რა მოხდა?",
    problemSub: "აირჩიეთ და დაამატეთ კომენტარი.",
    ac: "კონდიციონერი",
    tv: "ტელევიზორი",
    wifi: "WiFi",
    water: "ცხელი წყალი",
    noise: "ხმაური",
    cleaning: "დასუფთავება",
    other: "სხვა",
    describe: "დეტალები (სურვილისამებრ)",
    placeholder: "კონდიციონერი ღამით ხმაურობს…",
    addPhoto: "ფოტოს დამატება",
    photoAdded: "IMG_2043.jpg დამატებულია",
    send: "გაგზავნა მიმღებთან",
    reassure:
      "დაწერეთ ქართულად. პერსონალი კითხულობს ინგლისურად და გიპასუხებთ ქართულად.",
    itemsTitle: "რა გჭირდებათ?",
    itemsSub: "მოგიტანთ ოთახში.",
    towels: "პირსახოცი",
    pillow: "ბალიში",
    iron: "უთო",
    slippers: "ჩუსტები",
    water2: "სასმელი წყალი",
    kit: "შხაპის ნაკრები",
    sendRequest: "გაგზავნა",
    serviceTitle: "ოთახის სერვისი",
    serviceSub: "სამზარეულო 23:00-მდე. მიტანა ~25 წთ.",
    checkoutTitle: "გვიანი გასვლა",
    checkoutSub: "მიმღები დაადასტურებს რამდენიმე წუთში.",
    free: "უფასო",
    infoTitle: "სასტუმროს ინფო",
    tapCopy: "შეეხეთ კოპირებისთვის",
    copied: "დაკოპირდა",
    add: "დამატება",
    remove: "გამოკლება",
    breakfast: "საუზმე",
    spa: "სპა და აუზი",
    reception: "მიმღები",
    checkoutRow: "გასვლა",
    successTitle: "გაიგზავნა",
    successSub: "მიმღებმა მიიღო თქვენი მოთხოვნა.",
    confirmTitle: "მოთხოვნა მიმდინარეობს",
    received: "მიღებულია",
    inProgress: "მიმდინარეობს",
    done: "დასრულდა",
    etaLabel: "სავარაუდო დრო",
    eta: "15 წთ",
    waiting: "მიმღები ამჟამად განიხილავს.",
    doneNote: "ყველაფერი მზადაა. სასიამოვნო დასვენებას.",
    replyPlaceholder: "დაწერეთ შეტყობინება…",
    you: "თქვენ",
    frontDesk: "მიმღები",
    translated: "ითარგმნა ქართულად",
    justNow: "ახლახან",
  },
};
