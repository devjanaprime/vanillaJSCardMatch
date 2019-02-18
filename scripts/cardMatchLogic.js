const verbose = true;

class Card{
    constructor( value ){
        this.value = value;
        this.imageUrl = 'images/' + value + '.jpg';
        this.matched = false;
        this.showing = false;
    } //end constructor
} //end card class

// globals
let currentGuess = { index0: null, index1: null };
let cards = [];
let guesses = [];
let canGuess = true;
let guessChecker;

// create deck
for( let i = 0; i < 10; i++ ){
    cards.push( new Card( i ), new Card( i ) );
}

// shuffle deck, logic from https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
let shuffle = (a) =>{
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
} // end shuffle function

cards = shuffle( cards );

let cardClick = ( e ) => {
    const id = getElement( e ).getAttribute( 'id' );
    if( !canGuess ){
        resetCards();
        resetGuess();
        clearTimeout( guessChecker );
    } // end can guess check
    if( verbose ) console.log( 'in cardClick:', id );
    if( currentGuess.index0 === null || currentGuess.index0 != id ) makeGuess( id );
} // end clicked

let getElement = ( clickEvent ) =>{
    return window.event.srcElement || window.event.target;
} // end getElement

let gameDone = () =>{
    if( verbose ) console.log( 'in gameDone' );
    for( card of cards ){
        if( !card.matched ) return false;
    } // end for
    return true;
} // end gameDone 

let makeGuess = ( index ) => {
    if( verbose ) console.log( 'in makeGuess:', index );
    if( currentGuess.index0 === null ){
        currentGuess.index0 = index;
        if( verbose ) console.log( 'first guess:', cards[ currentGuess.index0 ] );
        showCard( currentGuess.index0 );
    } // end first guess
    else{
        currentGuess.index1 = index;
        updateGuesses();
        showCard( currentGuess.index1 );
        if( verbose ) console.log( 'second guess:', cards[ currentGuess.index0 ], cards[ currentGuess.index1 ] );
        if( cards[ currentGuess.index0 ].value === cards[ currentGuess.index1 ].value){
            if( verbose ) console.log( 'match' );
            setMatched( currentGuess.index0 );
            setMatched( currentGuess.index1 );
            resetGuess();
            if( gameDone() ){
                if( verbose ) console.log( 'game won in', guesses.length, 'guesses' );
            } //end game over check
        } //end match
        else{
            if( verbose ) console.log( 'no match' );
            canGuess = false;
            let guessChecker = setTimeout( ()=>{ resetCards(); }, 2000 );
        } // end no match
    } // end second guess
} // end makeGuess

let resetCards = () => {
    if( verbose ) console.log( 'in resetCards' );
    if( !canGuess ){
        cards[ currentGuess.index0 ].showing = false;
        cards[ currentGuess.index0 ].matched = false;
        cards[ currentGuess.index1 ].showing = false;
        cards[ currentGuess.index1 ].matched = false;

        let el = document.getElementById( currentGuess.index0 );
        el.setAttribute( "src", 'images/back.png' );
        el.classList.remove('selected');
        el = document.getElementById( currentGuess.index1 );
        el.setAttribute( "src", 'images/back.png' );
        el.classList.remove('selected');
        resetGuess();
        canGuess = true;       
    } // end canGuess check
} //end resetCard

let resetGuess = () =>{
    if( verbose ) console.log( 'in resetGuess' );
    currentGuess.index0 = null;
    currentGuess.index1 = null;
} //end resetGuess

let setMatched = ( index ) =>{
    if( verbose ) console.log( 'in setMatched:', index );
    cards[ index ].showing = true;
    cards[ index ].matched = true;
    let el = document.getElementById( index );
    el.classList.remove('selected');
    el.classList.add('matched');
} //end setMatched

let showCard = ( index ) => {
    if( verbose ) console.log( 'in showCard:', index );
    cards[ index ].showing = true;
    let el = document.getElementById( index );
    el.setAttribute( 'src', 'images/' + cards[index].value + '.png' );
    el.classList.add('selected');
} // end showCard

let updateGrid = () =>{
    if( verbose ) console.log( 'in updateGrid:', cards );
    let gridText = '';
    for( index in cards ){
        gridText += `<img class='card' id='` + index + `' src="images/back.png" onClick="cardClick()"/>`;
    } // end for
    document.getElementById( 'cardsGrid' ).innerHTML= gridText;
} // end updateGrid

let updateGuesses = () =>{
    if( verbose ) console.log( 'in updateGuesses' );
    guesses.push( currentGuess );
    document.getElementById( 'guessesOut' ).innerHTML = guesses.length;
} // end updateGuesses

document.addEventListener("DOMContentLoaded", function() {
    updateGrid();
});





