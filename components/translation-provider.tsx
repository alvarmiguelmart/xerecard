import Script from "next/script";

export function TranslationProvider() {
  return (
    <>
      <div id="google_translate_element" className="hidden" />
      <Script
        id="google-translate-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html:
            "window.googleTranslateElementInit=function(){new window.google.translate.TranslateElement({pageLanguage:'pt',includedLanguages:'en,pt',autoDisplay:false},'google_translate_element')};"
        }}
      />
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}
