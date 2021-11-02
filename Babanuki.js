// スペード   -->0
// ハート     -->1
// クローバー  -->2
// ダイヤ     -->3



var deck = [];
var cpuHand = [];
var playerHand = [];
var matchNum = 0;
var isFirstPick = true;
var firstPick;
var turn = "Player";
var phase = "START";



document.getElementById("matchNum").innerHTML = matchNum;
document.getElementById("turn").innerHTML = turn;

// cardオブジェクト
function Card(num, mark) {
    this.id = num + mark * 13;
    this.num = num;
    this.mark = mark;
}
// デッキ生成
function createDech() {
    for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 14; j++) {
            deck.push(new Card(j, i));
        }
    }
    deck.push(new Card(14, 4)); //JOKER{NUM=14,MARK=4}
}
createDech();

// スタートボタン
const dealBtn = document.getElementById("dealBtn");
dealBtn.addEventListener('click', () => {
    switch (phase) {
        case "START":
            document.getElementById("text").textContent = "Find a pair click them";
            // デッキを配る
            dealDech();
            dealBtn.textContent = 'To switch turn';
            phase = "NEXT";
            break;
        case "NEXT":
            document.getElementById("text").textContent = "Pick one card from enemy's hand";
            switchTurn();
            alert("Now, turn is " + turn);
            break;
    }


});

function dealDech() {
    while (deck.length > 1) {
        let card = document.createElement("div");
        let cpu = document.getElementById("cpu");
        let player1 = document.getElementById("player1");
        // デッキからランダムに一枚選んでcpuHandに追加
        var x = Math.floor(Math.random() * deck.length);
        cpuHand.push(deck[x]);
        // HTML内のdiv.cpuにdiv.cardを追加
        cpu.appendChild(card);
        card.classList.add("card");
        // div.cardにid=idNumで追加
        card.setAttribute("id", "cardId" + deck[x].id);

        card.addEventListener('click', e => {
            if (turn == 'Player') {
                switchTurn();
                drawCard(selectCard(e, cpuHand));
            }
            if (cpuHand.length == 0) {
                alert(" CPU win");
            }
        });

        // 選んだカードをデッキから消す
        deck.splice(x, 1);

        // デッキからランダムに一枚選んでplayerHandに追加
        card = document.createElement("div");
        x = Math.floor(Math.random() * deck.length);
        playerHand.push(deck[x]);
        // HTML内のdiv.player1にdiv.cardを追加
        player1.appendChild(card);
        card.classList.add("card");
        // div.cardにid=idNumで追加
        card.setAttribute("id", "cardId" + deck[x].id);

        card.addEventListener('click', e => {
            if (turn == 'Player') {
                if (isFirstPick && turn) {
                    firstPick = selectCard(e, playerHand);
                    isFirstPick = false;
                } else {
                    let secondPick = selectCard(e, playerHand);
                    compareCard(secondPick);
                }
            }
        });

        // カードの表面をプリント
        printCardFront(deck[x]);
        // 選んだカードをデッキから消す
        deck.splice(x, 1);
    }
    // 残りの一枚をCPUに追加
    let card = document.createElement("div");
    let cpu = document.getElementById("cpu");
    cpuHand.push(deck[0]);
    cpu.appendChild(card);
    card.classList.add("card");
    // div.cardにid=idNumで追加
    card.setAttribute("id", "cardId" + deck[0].id);
    card.addEventListener('click', e => {
        if (turn == 'Player') {
            switchTurn();
            drawCard(selectCard(e, cpuHand));
        }
        if (cpuHand.length == 0) {
            alert(" CPU win");
        }
    });
    deck.splice(0, 1);
}

function printCardFront(cardObject) {
    let number = document.createElement("p");
    let mark = document.createElement("span");
    let cardNum = cardObject.num;
    let cardMark;
    let card = document.getElementById("cardId" + cardObject.id);
    // カードのプロパティの　mark（1〜4）を使ってマークを指定
    switch (cardObject.mark) {
        case 0:
            cardMark = '♠'
            break;
        case 1:
            cardMark = '♥'
                // numberとmarkの色を赤にする
            number.style.color = "red";
            mark.style.color = "red";
            break;
        case 2:
            cardMark = '♣'
            break;
        case 3:
            cardMark = '♦'
            number.style.color = "red";
            mark.style.color = "red";
            break;
        case 4:
            cardMark = "JOKER"
            cardNum = "💀"
            break;
    }
    // <p class="number">cardNum</p>
    number.textContent = cardNum;
    number.classList.add("number");
    // <span class="mark">cardMark</span>
    mark.textContent = cardMark;
    mark.classList.add("mark");
    // <div class="card">に 子要素<p class="number">cardNum</p>と
    // 子要素<span class="mark">cardMark</span>を追加
    card.appendChild(number);
    card.appendChild(mark);
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
    target.classList.add("picked");
    return hand[index];

}

//カードを比べる
function compareCard(c) {
    if (c.num == firstPick.num && c.id != firstPick.id) {
        //同じだったので一枚目と二枚目をhtmlから削除
        document.getElementById("cardId" + firstPick.id).remove();
        document.getElementById("cardId" + c.id).remove();
        //同じだったので一枚目と二枚目をplayer手札から削除
        playerHand.splice(playerHand.indexOf(firstPick), 1);
        playerHand.splice(playerHand.indexOf(c), 1);
        matchNum++;
        document.getElementById("matchNum").innerHTML = matchNum;
    } else {
        // 違ったのでピッククラスを消す
        document.getElementById("cardId" + c.id).classList.remove("picked");
        document.getElementById("cardId" + firstPick.id).classList.remove("picked");
        firstPick = null;
    }
    // フラグを一枚目にする
    isFirstPick = true;
}
//
function switchTurn() {
    if (turn == "Player") {
        turn = "Enemy";
        document.getElementById("turn").style.color = "pink"
        document.getElementById("turn").textContent = turn;
        document.getElementById("text").textContent = "Wait..";

    } else {
        turn = "Player"
        document.getElementById("turn").style.color = "skyblue"
        document.getElementById("turn").textContent = turn;
        document.getElementById("text").textContent = "Pick one card from enemy's hand";
    }
}

function drawCard(drawedCard) {
    playerHand.push(drawedCard);
    let card = document.createElement("div");
    let player1 = document.getElementById("player1");
    document.getElementById("cardId" + drawedCard.id).remove();
    player1.appendChild(card);
    card.classList.add("card");
    card.setAttribute("id", "cardId" + drawedCard.id);
    cpuHand.splice(cpuHand.indexOf(drawedCard), 1);
    printCardFront(playerHand[playerHand.length - 1]);
    card.addEventListener('click', e => {
        if (turn == "Player") {
            if (isFirstPick && turn) {
                firstPick = selectCard(e, playerHand);
                isFirstPick = false;
            } else {
                let secondPick = selectCard(e, playerHand);
                compareCard(secondPick);
            }
        }
    });
}