# Lite tips för att förnkla uppgift 2

## Saker att tänka på

- Det är viktigt att tänka på at saker som inte ligger i state kommer inte att rendera om eran applikation.
- `useEffect()` körs vid första renderingen och sen varje gång som något i dess dependency array ändras.
- För att rendera element baserat på data som ni har i en array kan ni nyttja `minArray.map()` funktionen och returnera JSX ("HTML")
- Det går att lägga till fler attribut i ett redan existerande objekt med hjälp av spread syntax.

## Potentiell grund för lösning

Denna uppgift kräver i sig inte så farligt mycket kod i sig. Svårigheten kommer från att det kan vara svårt att veta vad man ska ha för approach till uppgiften. Jag kommer här att ge några förslag på funktioner och logik som kan användas om ni sitter fast. Jag kommer inte skriva det i kod utan snarare ge beskrivande exempel i ord.

### Starten

Starten kan vara svår att tackla. Men grunderna har ni fått. Jag har i lektion 7 och 8 båda gått igenom hur vi hämtar data i React. Lektion 8 speciellt är relevant då jag där faktiskt visar er hur ni hämtar data från Deck of cards API:et.

vad som kommer att behövas är en `useEffect` med en tom dependency array för att anropa API:et endast vid första rendering. Vi kommer endast att behöva hämta kort 1 gång i denna uppgift.

För att vi sedan ska kunna använda vår data i våran JSX på ett rimligt sätt så borde det nu sparas i state. Spara arrayen av kort i state, det andra kommer ni inte att behöva längre.

Härifrån så finns det primärt 2 vägar att gå. Att använda hela decket och i framtiden köra en kontroll för suit och för value, alternativt att dra ett antal kort, duplicera arrayen och seda lägga ihop dessa till en array som ni använder, där alla kort nu kommer att ha en kopia. Om ni väljer den andra metoden måste ni se till att blanda den nya arrayen också.

Få ut alla kort ni nu har på skärmen. Bärja med en simpel img-tag och konvertera sedan kanske till en komponent som tar props.

Kom ihåg att vid rendering av något som initialt är undefined så måste vi göra en kontroll att det vi renderar finns innan vi försöker att skriva ut det. Exempelvis med en ternary-operator `data && renderStuff`

### Första logiska utmaningen

Nästa steg är att hitta ett sätt att dälja de kort som inte klickats på. Det kan lösas lättast med att ha ett kort/bild som agerar som baksida på kortet, sen att varje komponent har ett lokalt state som avgör om kortets riktiga bild eller kortets baksida ska visas.

Det är dock viktigt att ni kan kontrollera detta state från er parent. Det är para er parent som har vetskap om samtliga av era kort.

### Den riktiga utmaningen

Hela grunden för ett memory är att det endast går att vända 2 kort i taget.

Mitt förslag är att skapa state för dessa 2 kort. För vi behöver ha korten sparade någonstans för att sedan kunna jämföra dem.

Beroende på hur ni har löst arrayen med kort kommer också här nästa utmaning när ni väl har sparat 2 kort i state-variabler.
Har ni hämtat kort och sedan duplicerat dem så kan ni enkelt bara jämför objektens code. Har ni dock gjort som jag i exemplet så kommer ni att behöva jämföra både suit och value. Ni kommer dessutom att behöva ska en funktion för att konvertera om suit till en färg så att den kan jämföras.

### Slutspurt

Det sista av vikt som behöver göra is applikationen är att hitta ett sätt att låsa de kort som har matchas. Så att de inte går att tryckas på igen. Återigen finns det många sätt att lösa det. Mitt förslag är dock att ha ett lokalt state i era Card som kollar om kortet har matchats och sedan sätts till att vara matchat. På detta sätt kan vi sedan låsa bilden som vi använder.

Ett alternativ till detta är att lägga till ett attribut på era kort-objekt. Detta kan göra med en map exempelvis. Kombinerat med en object-spread. Detta kan vara ett enklare sätt om man inte oroar sig för att mutera datan. Vilket i detta fall inte är några problem att göra.
