		$(document).ready(function() {

        $("#replayButton").on("click", function() {

            rematch();
        })
			
		function Deck() {
            var ranks = [1,2,3,4,5,6,7,8,9,10,11,12,13];
            var suits = [1,2,3,4];
            var deck = [];

            for (var s = 1; s <= suits.length; s++) {
                for (var r = 1; r <= ranks.length; r++) {
                    deck.push(new Card(s, r));
                }
            }

	        this.getDeck = function() {
	          return deck;
	        }

	        this.deal = function() {
	          return deck.shift();
	        }

	        this.shuffle = function(deck) {
	            var currentIndex = deck.length, holder, rand;

	            while (0 !== currentIndex) {

	                rand = Math.floor(Math.random() * currentIndex);
	                currentIndex -= 1;

	                holder = deck[currentIndex];
	                deck[currentIndex] = deck[rand];
	                deck[rand] = holder;
	            }

	            return deck;

	            }

	        this.shuffle(deck);

    	}


        function Card(suit, rank) {
            var suit = suit, rank = rank;
            
            this.getRank = function() {
                switch(rank) {
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                    default:
                        return rank;
                    case 11:
                        rank = "Jack";
                        return rank;
                    case 12:
                        rank = "Queen";
                        return rank;;
                    case 13:
                        rank = "King";
                        return rank;
                    case 1:
                        rank = "Ace";
                        return rank;
            	}
            }

            this.getSuit = function() {
                switch(suit) {
                    default:
                        return suit;
                    case 1:
                        suit = "\u2666";
                        return suit;
                    case 2:
                        suit = "\u2663";
                        return suit;
                    case 3:
                        suit = "\u2665";
                        return suit;
                    case 4:
                        suit = "\u2660";
                        return suit;
                }		
            }
 
            this.getValue = function() {
                var rank = this.getRank();
                if (rank == "Jack" || rank == "Queen" || rank == "King") {
                    rank = 10;
                } else if (rank == "Ace") {
                    rank = 11;
                } else {
                    rank = rank;
                }
                return rank;
            }

        }
        

        function Hand(deck) {
            var hand = [], aced = 0, score = 0;

            this.getFaceupcard = function() {
            	 var result = "";
            	 result += "|" + hand[0].getSuit() + hand[0].getRank() + "| ";
            	 return result; 
            }

            this.hitMe = function(deck) {
                var card = deck.deal();
                score += card.getValue();

                if (card.getRank() == "Ace") {
                    aced ++;
                    console.log("aced found");
                }
                hand.push(card);

            };

            this.hitMe(deck);


            this.printHand = function() {
                var hand_string = "";

          		for (var i = 0; i < hand.length; i++) {
                	hand_string += "|" + hand[i].getSuit() + 
                    " " + hand[i].getRank() + "| ";
          		}
                
                return hand_string;
            }

            this.getAced = function() {
                return aced;
            }


            this.getScore = function() {
                return score;
            }

            this.aceScore = function() {
                if (aced) {
                    score -= 10;
                    aced--;
                }
                else {
                    return;
                }
            }

        }
      

        function playAsDealer(deck) {
            var dealerHand = new Hand(deck);
            return dealerHand;
        }

        function playAsUser(deck) {
            var userHand = new Hand(deck);
            return userHand;
        }

        function secondDealing(userHand, dealerHand,deck) {
            userHand.hitMe(deck);
            dealerHand.hitMe(deck);
        }


        function declareWinner(userHand, dealerHand) {
            $("#playerHand").text(userHand.printHand());
            $("#dealerHand").text(dealerHand.printHand());

            if (dealerHand.getScore() > 21) {
                $("#messageBox").text("You win! You had a score of " + userHand.getScore() + " and the Dealer busted with a score of " + dealerHand.getScore());
            } else if (userHand.getScore() > dealerHand.getScore()) {
                $("#messageBox").text("You win! You had a score of " + userHand.getScore() + " and the Dealer had a score of " + dealerHand.getScore());
            } else if (userHand.getScore() < dealerHand.getScore()) {
                $("#messageBox").text("You lose! You had a score of " + userHand.getScore() + " and the Dealer had a score of " + dealerHand.getScore());
            } else if (userHand.getScore() == dealerHand.getScore()) {
                $("#messageBox").text("You draw! You had a score of " + userHand.getScore() + " and the dealer had a score of " + dealerHand.getScore());
            }

        }

  
		function playingPhase(userHand, dealerHand, deck) {

            $("#playerHand").text(userHand.printHand());
            $("#dealerHand").text(dealerHand.getFaceupcard());

            $("#messageBox").text("You have a score of " + userHand.getScore() + ".");

            if (userHand.getScore() > 21 ) {

                if (userHand.getAced()) {
                    userHand.aceScore();
                    return playingPhase(userHand, dealerHand, deck);
                }

                else if (userHand.getAced() == 0) {
                    $("#hitButton").unbind();
                    $("#stayButton").unbind();
                    return endGame(userHand);
                }

            }

            else if (userHand.getScore() == 21) {
                $("#hitButton").unbind();
                $("#stayButton").unbind();
                return dealerTurn(userHand, dealerHand, deck);
            }

            else {
                console.log("exected");

                $("#hitButton").on("click", function() {
                    console.log("hitbutton clicked");
                    userHand.hitMe(deck);
                    $("#hitButton").unbind();
                    console.log("hitbutton unbinded");

                    return playingPhase(userHand, dealerHand, deck);

                });

                $("#stayButton").on("click", function() {
                    console.log("staybutton clicked");
                    $("#hitButton").unbind();
                    return dealerTurn(userHand, dealerHand, deck);


                });
                    

            }
                
        } 
          
        function dealerTurn(userHand, dealerHand, deck) {

                if (dealerHand.getScore() < 17) {
                    dealerHand.hitMe(deck);
                    return dealerTurn(userHand, dealerHand, deck);
                }

                else if (dealerHand.getScore() > 17) {

                    if (dealerHand.getScore() > userHand.getScore()) {
                        return declareWinner(userHand, dealerHand);
                    }

                    else if (dealerHand.getAced()) {
                        dealerHand.aceScore();
                        return dealerTurn(userHand, dealerHand, deck);
                    }
                }

                return declareWinner(userHand, dealerHand);

            }

        
        function endGame(userHand) {
            return $("#messageBox").text("You bust! You had a score of " + userHand.getScore());

        }

        function rematch() {
            $("#messageBox").text("");
            return playGame();
        }

        function playGame() {
            var Deck1 = new Deck();
            var userHand = playAsUser(Deck1);
            var dealerHand = playAsDealer(Deck1);

            secondDealing(userHand, dealerHand, Deck1);

            playingPhase(userHand, dealerHand, Deck1);

          }

        playGame();

    });
