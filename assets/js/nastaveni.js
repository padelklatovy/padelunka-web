/* =========================================================
   PADELUNKA – NASTAVENÍ WEBU
   Tady se doplňují údaje a soubory, které zatím chybí.
   Co necháte prázdné (""), se na webu vůbec nezobrazí –
   nikde nevznikne nefunkční tlačítko ani prázdný rámeček.
   ========================================================= */
window.PADELUNKA = {

  /* 1) KONTAKT – jediný údaj, který je k doplnění.
        Příklad: "info@padelunka.cz"
        Dokud je prázdný, web místo tlačítek napíše, že kontakt brzy doplníme. */
  kontaktEmail: "",

  /* 2) ÚVODNÍ FOTKA z pilotu (výrazný výřez s lidmi).
        Soubory dejte do složky foto/ (návod v foto/README.md).
        ohnisko = kam má ořez mířit, např. "50% 30%" (vodorovně, svisle). */
  uvodniFoto: null,
  /* Příklad:
  uvodniFoto: {
    src: "foto/pilot-hra-1600.jpg",
    srcMale: "foto/pilot-hra-900.jpg",
    popis: "Hráči PADELUNKY při prvním pilotu v Padel Klatovy",
    ohnisko: "50% 35%"
  },
  */

  /* 3) FOTKY Z PILOTU – nejlépe 4: společná, hra, zázemí, posezení. */
  fotkyPilot: [
    /* { src: "foto/spolecna-1600.jpg", srcMale: "foto/spolecna-900.jpg",
         popis: "Společná fotka účastníků pilotu", popisek: "Společná fotka", ohnisko: "50% 40%" }, */
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
