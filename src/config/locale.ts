export const LocaleMap = {
    "id": { name: "Indonesian", nativeName: "Bahasa Indonesia" },
    "da": { name: "Danish", nativeName: "Dansk" },
    "de": { name: "German", nativeName: "Deutsch" },
    "en-GB": { name: "English, UK", nativeName: "English, UK" },
    "en-US": { name: "English, US", nativeName: "English, US" },
    "es-ES": { name: "Spanish", nativeName: "Español" },
    "es-419": { name: "Spanish, LATAM", nativeName: "Español, LATAM" },
    "fr": { name: "French", nativeName: "Français" },
    "hr": { name: "Croatian", nativeName: "Hrvatski" },
    "it": { name: "Italian", nativeName: "Italiano" },
    "lt": { name: "Lithuanian", nativeName: "Lietuviškai" },
    "hu": { name: "Hungarian", nativeName: "Magyar" },
    "nl": { name: "Dutch", nativeName: "Nederlands" },
    "no": { name: "Norwegian", nativeName: "Norsk" },
    "pl": { name: "Polish", nativeName: "Polski" },
    "pt-BR": { name: "Portuguese, Brazilian", nativeName: "Português do Brasil" },
    "ro": { name: "Romanian, Romania", nativeName: "Română" },
    "fi": { name: "Finnish", nativeName: "Suomi" },
    "sv-SE": { name: "Swedish", nativeName: "Svenska" },
    "vi": { name: "Vietnamese", nativeName: "Tiếng Việt" },
    "tr": { name: "Turkish", nativeName: "Türkçe" },
    "cs": { name: "Czech", nativeName: "Čeština" },
    "el": { name: "Greek", nativeName: "Ελληνικά" },
    "bg": { name: "Bulgarian", nativeName: "български" },
    "ru": { name: "Russian", nativeName: "Pусский" },
    "uk": { name: "Ukrainian", nativeName: "Українська" },
    "hi": { name: "Hindi", nativeName: "हिन्दी" },
    "th": { name: "Thai", nativeName: "ไทย" },
    "zh-CN": { name: "Chinese, China", nativeName: "中文" },
    "ja": { name: "Japanese", nativeName: "日本語" },
    "zh-TW": { name: "Chinese, Taiwan", nativeName: "繁體中文" },
    "ko": { name: "Korean", nativeName: "한국어" }
} as const;

export type LocaleCode = keyof typeof LocaleMap;

export const LocaleCodeList = Object.keys(LocaleMap) as LocaleCode[];
