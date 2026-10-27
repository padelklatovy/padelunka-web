/* =========================================================
   PADELUNKA – NASTAVENÍ WEBU
   Tady se doplňují údaje a soubory, které zatím chybí.
   Co necháte prázdné (""), se na webu vůbec nezobrazí –
   nikde nevznikne nefunkční tlačítko ani prázdný rámeček.
   ========================================================= */
window.PADELUNKA = {

  /* 1) KONTAKT – zobrazí se v sekcích Liga 2027 a Pro kluby a v patičce.
        Telefon pište ve tvaru +420 602 431 363 (mezery se pro volání odstraní samy). */
  kontaktEmail: "info@padelun.cz",
  kontaktTelefon: "+420 602 431 363",

  /* 2) ÚVODNÍ FOTKA z pilotu (výrazný výřez s lidmi).
        Soubory dejte do složky foto/ (návod v foto/README.md).
        ohnisko = kam má ořez mířit, např. "50% 30%" (vodorovně, svisle). */
  uvodniFoto: {
    src: "foto/hra-detail-1600.jpg",
    srcMale: "foto/hra-detail-900.jpg",
    popis: "Hráč a hráčka PADELUNKY připravení na příjem při prvním pilotu v Padel Klatovy",
    ohnisko: "50% 40%"
  },

  /* 3) FOTKY Z PILOTU – zobrazí se v sekci „Začalo to v Klatovech“ v tomto pořadí.
        popisek = krátký štítek na fotce, popis = text pro nevidomé a vyhledávače. */
  fotkyPilot: [
    { src: "foto/spolecna-fotka-1600.jpg", srcMale: "foto/spolecna-fotka-900.jpg",
      popis: "Společná fotka hráčů prvního pilotu PADELUNKY na kurtu v Padel Klatovy", popisek: "Společná fotka", ohnisko: "50% 55%" },
    { src: "foto/lavicka-fandeni-1600.jpg", srcMale: "foto/lavicka-fandeni-900.jpg",
      popis: "Hráči na lavičce u kurtu sledují a fandí spoluhráčům", popisek: "Třetí fandí", ohnisko: "50% 38%" },
    { src: "foto/hra-dvojice-1-1600.jpg", srcMale: "foto/hra-dvojice-1-900.jpg",
      popis: "Smíšená dvojice ve hře na kurtu Padel Klatovy", popisek: "Hra", ohnisko: "50% 50%" },
    { src: "foto/posezeni-smich-1600.jpg", srcMale: "foto/posezeni-smich-900.jpg",
      popis: "Hráči po hraní u stolu v zázemí klubu", popisek: "Posezení po hraní", ohnisko: "50% 30%" },
    { src: "foto/dve-trojice-u-site-1-1600.jpg", srcMale: "foto/dve-trojice-u-site-1-900.jpg",
      popis: "Dvě trojice, každá dva muži a jedna žena, u sítě před zápasem", popisek: "Trojice proti trojici", ohnisko: "50% 64%" },
    { src: "foto/hra-dvojice-2-1600.jpg", srcMale: "foto/hra-dvojice-2-900.jpg",
      popis: "Hráč a hráčka čekají na podání soupeře", popisek: "Na příjmu", ohnisko: "50% 50%" }
  ],

  /* 4) PRAVIDLA ke stažení (PDF). Verzi opište přesně z dokumentu. */
  pravidla: null,
  /* Příklad:
  pravidla: { soubor: "pravidla/PADELUNKA-pravidla-v1.0.pdf", verze: "1.0", datum: "25. 10. 2026" },
  */

  /* 5) VYSVĚTLUJÍCÍ VIDEO (MP4, H.264) + náhledový obrázek. Načte se až po kliknutí. */
  video: null
  /* Příklad:
  video: { soubor: "video/padelunka-jak-se-hraje.mp4", nahled: "video/nahled.jpg",
           popis: "Jak se hraje PADELUNKA – vysvětlující video" }
  */
};
