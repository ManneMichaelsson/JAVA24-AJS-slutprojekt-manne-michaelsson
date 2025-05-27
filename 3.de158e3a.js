const suits = [
    'hearts',
    'clubs',
    'diamonds',
    'spades'
];
const chars = [
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    'Kn',
    'Q',
    'K',
    'A'
];
const deck = [];
for (const suit of suits)for (const char of chars)deck.push({
    suit,
    char
});
const shuffledDeck = _.shuffle(deck);
console.log(shuffledDeck);
const exCard = _.sample(deck);
console.log("Ditt kort du drog: F\xe4rg:", exCard.suit, ". Nummer: ", exCard.char);

//# sourceMappingURL=3.de158e3a.js.map
