export type ColorTheme = "light" | "dark";
export type Size = number | "full";

export type Locale =
  /** English */
  | "en" // English
  | "in" // English (India)
  | "de_DE" // German
  | "fr" // French
  | "ca_ES" // Catalan
  | "es" // Spanish
  | "it" // Italian
  | "pl" // Polish
  | "tr" // Turkish
  | "ru" // Russian
  | "br" // Portuguese (Brazil)
  | "id" // Indonesian
  | "ms_MY" // Malay
  | "th_TH" // Thai
  | "vi_VN" // Vietnamese
  | "ja" // Japanese
  | "ko" // Korean
  | "zh_CN" // Simplified Chinese
  | "zh_TW" // Traditional Chinese
  | "ar_AE" // Arabic
  | "he_IL"; // Hebrew

export type LocaleFull =
  | "English"
  | "English (India)"
  | "German"
  | "French"
  | "Catalan"
  | "Spanish"
  | "Italian"
  | "Polish"
  | "Turkish"
  | "Russian"
  | "Portuguese"
  | "Indonesian"
  | "Malay"
  | "Thai"
  | "Vietnamese"
  | "Japanese"
  | "Korean"
  | "Simplified Chinese"
  | "Traditional Chinese"
  | "Arabic"
  | "Hebrew";
