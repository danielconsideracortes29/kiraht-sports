/* =========================================================================
   KIRAHT SPORTS — SITE CONTENT
   Edit this file to update players, coaches, team and contact details.
   - Leave a field as null to show "To be confirmed" on the website.
   - To add a photo: put the image in assets/people/ and set photo: "assets/people/file.jpg"
   ========================================================================= */

window.KIRAHT = {
  instagram: {
    handle: "kirahtsports",
    url: "https://www.instagram.com/kirahtsports/",
    dm: "https://ig.me/m/kirahtsports",
    // Paste links to selected Instagram posts here, e.g.
    // { url: "https://www.instagram.com/p/XXXXXXXX/", caption: "Short caption", image: "assets/instagram/post1.jpg" }
    posts: []
  },

  // Only verified details. Empty values are hidden on the site.
  contact: {
    email: "",
    phone: "",
    whatsapp: "", // digits only, with country code, e.g. "5521999999999"
    location: ""
  },

  team: [
    { name: "Flávio Viana", role: "Founder & Owner", bio: null, photo: null, links: [] },
    { name: "Daniel Lins Cortes", role: "Football Agent", bio: null, photo: null, links: [] },
    { name: "Tharik Vidinha", role: "Licensed Football Agent", bio: null, photo: null, links: [] }
  ],

  /* Countries are listed in display order. */
  countries: [
    { id: "brazil", name: "Brazil" },
    { id: "uae", name: "United Arab Emirates" },
    { id: "saudi", name: "Saudi Arabia" },
    { id: "qatar", name: "Qatar" },
    { id: "thailand", name: "Thailand" },
    { id: "iran", name: "Iran" },
    { id: "kuwait", name: "Kuwait" },
    { id: "ukraine", name: "Ukraine" },
    { id: "japan", name: "Japan" },
    { id: "bahrain", name: "Bahrain" },
    { id: "turkey", name: "Türkiye" }
  ],

  /* PLAYERS — season 2026/27 */
  players: [
    // Brazil
    { name: "Everaldo", club: "Bahia", country: "brazil", competition: null },
    { name: "Magrão", club: "Fortaleza", country: "brazil", competition: null },
    { name: "Yago", club: "América Mineiro", country: "brazil", competition: null },
    { name: "Emerson", club: "América Mineiro", country: "brazil", competition: null },
    // UAE — Pro League
    { name: "Gassama", club: "Ajman", country: "uae", competition: "UAE Pro League" },
    { name: "Victor Hugo", club: "Ajman", country: "uae", competition: "UAE Pro League" },
    { name: "Lucas Pimenta", club: "Al Wahda", country: "uae", competition: "UAE Pro League" },
    { name: "Jadson", club: "Al Wahda", country: "uae", competition: "UAE Pro League" },
    { name: "Felipe Motta", club: "Al Nasr", country: "uae", competition: "UAE Pro League" },
    { name: "João Moreira", club: "Al Nasr", country: "uae", competition: "UAE Pro League" },
    { name: "Arielson", club: "Al Dhafra", country: "uae", competition: "UAE Pro League" },
    { name: "Serafim", club: "Al Dhafra", country: "uae", competition: "UAE Pro League" },
    { name: "Zé Welinton", club: "Al Dhafra", country: "uae", competition: "UAE Pro League" },
    { name: "Marcelinho", club: "Al Dhafra", country: "uae", competition: "UAE Pro League" },
    { name: "Samir", club: "Al Dhafra", country: "uae", competition: "UAE Pro League" },
    { name: "Kauã Bastian", club: "Hatta", country: "uae", competition: "UAE Pro League" },
    // UAE — U-23
    { name: "Carlos André", club: "Sharjah", country: "uae", competition: "UAE U-23 League" },
    { name: "Kauã", club: "Al Nasr", country: "uae", competition: "UAE U-23 League", slug: "kaua-al-nasr" },
    // UAE — second tier
    { name: "Lucas Galvão", club: "Dibba", country: "uae", competition: "UAE First Division" },
    { name: "Rangel", club: "Fujairah", country: "uae", competition: "UAE First Division" },
    // Saudi Arabia
    { name: "Hugo Moura", club: "Al Fayha", country: "saudi", competition: "Saudi Pro League" },
    { name: "Lázaro", club: "Al Fayha", country: "saudi", competition: "Saudi Pro League" },
    { name: "Sorriso", club: "Al Fateh", country: "saudi", competition: "Saudi Pro League" },
    // Qatar
    { name: "João Pedro", club: "Qatar SC", country: "qatar", competition: null },
    // Thailand
    { name: "Felipe Maia", club: "Bangkok United", country: "thailand", competition: null },
    { name: "Kaká Mendes", club: "Port FC", country: "thailand", competition: null },
    { name: "Jefferson", club: "Sukhothai", country: "thailand", competition: null },
    // Iran
    { name: "Édson", club: "Chadormalu", country: "iran", competition: null },
    // Kuwait
    { name: "Evans", club: "Al Jahra", country: "kuwait", competition: null },
    // Ukraine
    { name: "Fabrício Yan", club: "NK Veres", country: "ukraine", competition: null },
    // Japan
    { name: "Anderson Lopes", club: "Vissel Kobe", country: "japan", competition: null },
    // Bahrain
    { name: "Samuel", club: "Al Riffa", country: "bahrain", competition: null },
    // Türkiye
    { name: "David Kaiki", club: "Batman Petrolspor", country: "turkey", competition: null }
  ],
  /* Optional fields per player:
     fullName, nationality, position, contract, born, photo, bio, career: ["2024–25 · Club", ...] */

  /* COACHES — public career facts from club announcements and press (Nov 2026). */
  coaches: [
    {
      name: "Fábio Carille",
      fullName: "Fábio Luiz Carille de Araújo",
      club: "Al Fayha",
      country: "saudi",
      competition: "Saudi Pro League",
      nationality: "Brazil",
      born: "26 September 1973 · São Paulo",
      contract: "2026–27 season",
      bio: "A former central defender and left-back, Carille spent years on Corinthians' coaching staff before taking charge of the first team. He has since built substantial experience in Saudi football and was appointed head coach of Al Fayha for the 2026–27 season.",
      career: ["Corinthians", "Al Wehda", "Al Ittihad", "Santos", "Damac", "Al Fayha · since Sep 2026"]
    },
    {
      name: "Umberto Louzer",
      fullName: "Umberto Lourenço Louzer Filho",
      club: "Criciúma",
      clubNote: "On loan from Guarani",
      country: "brazil",
      competition: "Campeonato Brasileiro Série B",
      nationality: "Brazil",
      born: "24 February 1980",
      contract: null,
      bio: "A former Guarani midfielder, Louzer returned to the club as an assistant and became head coach in 2018, leading Guarani back to the top tier of the Campeonato Paulista. He has since coached widely across Brazil's Série A and Série B, and in September 2026 joined Criciúma on loan from Guarani for the run-in of the Série B.",
      career: ["Guarani · from 2018", "Vila Nova", "Chapecoense", "Coritiba", "Sport Recife", "Atlético Goianiense", "CRB", "Novorizontino", "América Mineiro · 2026", "Guarani · 2026", "Criciúma · since Sep 2026"]
    },
    {
      name: "Péricles Chamusca",
      fullName: "Péricles Chamusca",
      club: "Al Wahda",
      country: "uae",
      competition: "UAE Pro League",
      nationality: "Brazil",
      born: "29 September 1965",
      contract: "2026–27 season",
      bio: "Brazilian head coach with long experience in Gulf football. Al Wahda appointed him to lead the first team for the 2026–27 season.",
      career: ["Al Wahda · since Sep 2026"]
    }
  ]
};
