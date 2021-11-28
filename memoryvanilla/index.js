const Body = document.querySelector("body");
const Board = document.querySelector(".playBoard"); // Board kommer senare att användas för att lägga till våra kort.
let deck = []; // Initierar deck som en tom array, den kommer dock att fyllas på innan vi gör något.
let flippedCards = 0; // En räknare för att se hur många kort som är vända
let first = null; // Initierar ett första och andra kort som null där vi sedan kommer att spara de kort som ska jämföras
let second = null;

// Startar hela applikationen. Kunde egentligen anropa getDeck direkt. Men finns möjlighet att bygga ut.
async function start() {
  await getDeck(); // Hämtar vårat deck
  setUpBoard(); // Använder data för att rendera vårat spelbräda. Huvuddelen av funktionaliteten sätts upp här.
}

// Hämta ett deck och spara det i en variabel
async function getDeck() {
  const res = await fetch(
    "https://deckofcardsapi.com/api/deck/new/draw/?count=52"
  );
  const data = await res.json();
  deck = data.cards;
}

// Rendera ett bräde, lägg till eventlisteners på samtliga kort.
function setUpBoard() {
  if (deck.length > 0) {
    // Kontrollerar att vi verkligen har ett deck innan vi renderar
    deck.forEach((card) => {
      // Wrapper funktion för att kunna skicka med kortet till flipcard och fortfarande kunna ta bort eventListenern senare
      // Måste ha den här för att komma åt kortet.
      function cardClick(e) {
        let elem = getElement(e); // För att spara det faktiskta elementet vi vill åt.

        // En kontroll om ett kortet redan är matchat.
        if (elem.classList.contains("matched")) {
          // Tar bort event listeners om jag försöker clicka på ett redan matchat kort.
          elem.removeEventListener("click", cardClick);
        } else {
          flipCard(elem, card); // Vänder på kortet
        }
      }

      const Card = document.createElement("div"); // Skapar våran kortContainer
      const CardFace = document.createElement("img"); // En image för framsida och en för baksida.
      const CardBack = document.createElement("img");
      CardFace.className = "cardFace flipped"; // Initiera framsidan nedvänd
      CardBack.className = "cardBack";
      CardFace.setAttribute("src", card.image); // Framsidan är våran bild
      CardBack.setAttribute(
        "src",
        "https://deckofcardsapi.com/static/img/X1.png" // Baksidan är jokern som jag bara har kollat upp länken till.
      );
      Card.className = "card";
      Card.appendChild(CardFace);
      Card.appendChild(CardBack);
      Card.addEventListener("click", cardClick); // Lägger vår wrapperfunktion som callback till eventListenern så att vi kan ta bort den sen.

      Board.appendChild(Card);
    });
  }
}

function getElement(e) {
  // En kontroll att det är själva kortet vi har landat på när vi klickat. Eventet kan och oftast kommer att triggas på en child
  if (e.target.className !== "card") {
    return e.target.parentNode;
  } else {
    // Vet att mina children bara går ner en nivå så detta funkar.
    return e.target;
  }
}

// Mina kort har 2 img-taggar. Jag vill vända på båda.
function flipChildren(elem) {
  for (let i = 0; i < elem.childNodes.length; i++) {
    const element = elem.childNodes[i];

    // En ternary som kollar om img-taggen är flippad eller inte och gör den till motsatsen
    element.classList.contains("flipped")
      ? element.classList.remove("flipped")
      : element.classList.add("flipped");
  }
}

function flipCard(elem, card) {
  // Kolla att vi inte vill flippa för många kort
  if (flippedCards < 2) {
    flipChildren(elem); // Vänd på kortet
    if (!first) {
      // Kolla om kortet är det första
      first = {
        // Jag sparar både elementet och kortet för att hålla koll på båda
        elem,
        card,
      };
      flippedCards++; // Öka mängden vända kort.

      // Kollar att inget andra kort finns och att vi inte klickat på det första igen.
    } else if (card.code !== first.card.code && !second) {
      second = {
        elem,
        card,
      };
      flippedCards++;

      // Nollställer om vi klickat på första kortet igen.
    } else if (card.code === first.card.code) {
      first = null;
      flippedCards = 0;
    }

    // Har vi 2 kort och inte klickat samma så jämför vi våra kort. De kommer fortsätta vara uppvända tills nästa klick
  } else {
    compareCards();
  }
}

// Jämför 2 kort för att se om de ska låsas eller inte
function compareCards() {
  if (
    first.card.value === second.card.value && // Matchar värdet
    getColor(first.card.suit) === getColor(second.card.suit) // Och matchar färgen
  ) {
    first.elem.classList.add("matched"); // Lägg till matched på båda elementen
    second.elem.classList.add("matched");
    flippedCards = 0; // Nollställ countern
  } else {
    // Vid ingen match så vänder vi bara tillbaka korten
    flipChildren(first.elem);
    flipChildren(second.elem);
  }

  // Sen nollställer vi kort och räknare
  first = null;
  second = null;
  flippedCards = 0;
}

// EN enkel funktion som kollar färgen på ett kort
function getColor(suit) {
  if (suit === "DIAMONDS" || suit === "HEARTS") return "red";
  return "black";
}

start();
