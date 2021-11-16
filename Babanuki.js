var deck = [];
var playerHand = [];
var cpuHand = [];
var firstPick = null;
var isDraw = false;
var turn = "Player";
let matchNum = 0;
let playFirst = "cpu";
// cardオブジェクト
function Card(num, mark) {
    this.id = num + mark * 13;
    this.num = num;
    this.mark = mark;
    // カードの表を表示
    Card.prototype.print = function() {
        let number = document.createElement("p");
        let cardMark = document.createElement("span");
        let card = document.getElementById("cardId" + this.id);
        // カードのプロパティの　mark（1〜4）を使ってマークを指定
        switch (this.mark) {
            case 0:
                mark = '♠'
                break;
            case 1:
                mark = '♥'
                    // numberとmarkの色を赤にする
                number.style.color = "red";
                cardMark.style.color = "red";
                break;
            case 2:
                mark = '♣'
                break;
            case 3:
                mark = '♦'
                number.style.color = "red";
                cardMark.style.color = "red";
                break;
            case 4:
                mark = "JOKER"
                this.num = "💀"
                break;
        }
        // <p class="number">cardNum</p>
        number.textContent = this.num;
        number.classList.add("number");
        // <span class="mark">cardMark</span>
        cardMark.textContent = mark;
        cardMark.classList.add("mark");
        // <div class="card">に 子要素<p class="number">cardNum</p>と
        // 子要素<span class="mark">cardMark</span>を追加
        card.appendChild(number);
        card.appendChild(cardMark);
        // 
    };
    Card.prototype.deprint = function() {
            let card = document.getElementById("cardId" + this.id);
            while (card.lastChild) {
                card.removeChild(card.lastChild);
            }
        }
        // 引数で指定した手札にカードを追加
    Card.prototype.addToHand = function(hand) {
            hand.push(this);
            let cardDiv = document.getElementById("cardId" + this.id);
            if (hand == playerHand) {
                let handDiv = document.getElementById("player1");
                handDiv.insertBefore(cardDiv, null);
            } else {
                let handDiv = document.getElementById("cpu");
                handDiv.insertBefore(cardDiv, null);
            }
        }
        // カードをクリックした時の処理
    Card.prototype.click = function() {
        let cardDiv = document.getElementById('cardId' + this.id);
        cardDiv.addEventListener('click', (e) => {
            // if clicked cpu hand
            if (e.currentTarget.parentNode.className == 'cpu' && !isDraw) {
                // 引いたカードを手札に加える
                selectCard(e, cpuHand).addToHand(playerHand);
                selectCard(e, cpuHand).print();
                cpuHand.splice(cpuHand.indexOf(selectCard(e, cpuHand)), 1);
                isDraw = true;
            }
            // if clicked player hand
            else if (e.currentTarget.parentNode.className == 'player1' && turn == "Player") {
                e.currentTarget.classList.add("picked");
                if (firstPick == null) {
                    firstPick = selectCard(e, playerHand);
                } else {
                    let secondPick = selectCard(e, playerHand);
                    compareCard(firstPick, secondPick);
                    firstPick = null;
                }
            }
            gameResult();
        });
    }
}
// デッキ生成
function createDech() {
    let card = new Card(14, 4);
    let cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardDiv.setAttribute("id", "cardId" + card.id);
    document.getElementById("deck").appendChild(cardDiv);
    deck.push(card); //JOKER{NUM=14,MARK=4}
    for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 14; j++) {
            card = new Card(j, i);
            deck.push(card);
            cardDiv = document.createElement("div");
            cardDiv.classList.add("card");
            cardDiv.setAttribute("id", "cardId" + card.id);
            document.getElementById("deck").appendChild(cardDiv);
        }
    }
}
createDech();
// ランダムに両者の手札に配る
function dealDech() {
    let randomNum;
    // デッキから無くなるまでカードを配る
    while (deck.length != 0) {
        randomNum = Math.floor(Math.random() * deck.length);
        // Cpuに配る
        if (playFirst == 'cpu') {
            playFirst = 'player'
            deck[randomNum].addToHand(cpuHand);
            deck[randomNum].click();
            // deck[randomNum].print(); //デバッグ用
        }
        // プレイヤーに配る
        else {
            playFirst = 'cpu'
            deck[randomNum].addToHand(playerHand);
            deck[randomNum].click();
            deck[randomNum].print();
        }
        // 配ったカードをデッキから削除
        deck.splice(randomNum, 1);
    }
}
// ボタンの処理
let eventBtn = document.getElementById("dealBtn");
let phase = "START"
eventBtn.addEventListener('click', () => {
    switch (phase) {
        case "START":
            dealDech();
            phase = "PLAYING";
            cpuDiscard();
            break;
        case "PLAYING":
            switchTurn();
            break;
        case "END":
            deck = [];
            playerHand = [];
            cpuHand = [];
            firstPick = null;
            isDraw = false;
            turn = "Player";
            matchNum = 0;
            playFirst = "cpu";
            phase = "START";
            break;
    }
});

// カードを削除
function discard(card) {
    var cardDiv = document.getElementById("cardId" + card.id);
    var parentDiv = cardDiv.parentElement.className;
    if (parentDiv == "cpu") {
        cpuHand.splice(cpuHand.indexOf(card), 1);
    } else if (parentDiv == "player1") {
        playerHand.splice(playerHand.indexOf(card), 1);
    }
    cardDiv.remove();
}
//カードを選ぶ
function selectCard(e, hand) {
    // バブリング回避のためcurrrentTargetを使用
    let target = e.currentTarget;
    // div.id="cardId"(<=6文字) + id からidを抽出
    let id = parseInt(target.id.substr(6));
    // 手札からidをもったカードのインデックスを探す
    var index = hand.findIndex(card => card.id == id);
    // pickクラスを付与
    // target.classList.add("picked");
    return hand[index];
}

//カードを比べる
function compareCard(aCard, bCard) {
    if (aCard.num == bCard.num && aCard.id != bCard.id) {
        discard(aCard);
        discard(bCard);
        matchNum++;
        document.getElementById("matchNum").innerHTML = matchNum;
    } else {
        // 違ったのでピッククラスを消す
        document.getElementById("cardId" + aCard.id).classList.remove("picked");
        document.getElementById("cardId" + bCard.id).classList.remove("picked");
    }
}

// ターンの切り替え
function switchTurn() {
    if (turn == "Player") {
        turn = "Enemy";
        document.getElementById("turn").style.color = "pink"
        document.getElementById("turn").textContent = turn;
        document.getElementById("text").textContent = "Wait..";
        cpuTurn();
    } else {
        turn = "Player"
        isDraw = false;
        document.getElementById("turn").style.color = "skyblue"
        document.getElementById("turn").textContent = turn;
        document.getElementById("text").textContent = "Pick one card from enemy's hand";
    }
}

// // cpuがプレイヤー手札を引く
function cpuDraw() {
    let randomNum = Math.floor(Math.random() * playerHand.length);
    playerHand[randomNum].addToHand(cpuHand);
    playerHand[randomNum].deprint();
    playerHand[randomNum].click();
    playerHand.splice(playerHand.indexOf(playerHand[randomNum]), 1);
    gameResult();
}

function cpuDiscard() {
    let i = 0;
    let j = 1;
    let handLength = cpuHand.length;
    while (i < handLength - 1) {
        handLength = cpuHand.length;
        if (cpuHand[i].num == cpuHand[j].num && cpuHand[i].id != cpuHand[j].id) {
            // cpuHand.splice(index, 1);
            compareCard(cpuHand[i], cpuHand[j]);
            i = 0;
            j = 1;
            gameResult();
        } else if (j >= handLength - 1) {
            i++;
            j = i + 1;
        } else {
            j++;
        }
    }
}

// 相手ターンを待機で処理
async function cpuTurn() {
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve(cpuDraw()), 1000)
    });
    await promise; // promise が解決するまで待ちます (*)
    let promise2 = new Promise((resolve, reject) => {
        setTimeout(() => resolve(cpuDiscard()), 2000)
    });
    await promise2;
    switchTurn();
    alert(turn);
}

// 勝利宣言
function gameResult() {
    if (playerHand.length == 0) {
        alert("player win!!");
        phase = "END";
    } else if (cpuHand.length == 0) {
        alert("computer win!!");
        phase = "END";
    }

}