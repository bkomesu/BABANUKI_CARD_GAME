var deck = [];
var playerHand = [];
var cpuHand = [];
var firstPick = null;
var isDraw = false;
var turn = "Player";
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
    };
    // 引数で指定した手札にカードを追加
    Card.prototype.addToHand = function(hand) {   
        
        hand.push(this);
            let cardDiv = document.createElement("div");
            cardDiv.classList.add("card");
            if (hand == playerHand) {
                let handDiv = document.getElementById("player1");
                handDiv.appendChild(cardDiv);
                cardDiv.setAttribute("id", "cardId" + this.id);
            } else {
                let handDiv = document.getElementById("cpu");
                handDiv.appendChild(cardDiv);
                cardDiv.setAttribute("id", "cardId" + this.id);
            }

        }
        // カードをクリックした時の処理
    Card.prototype.click = function() {
        let cardDiv = document.getElementById('cardId' + this.id);
        cardDiv.addEventListener('click', (e) => {
            // if clicked cpu hand
            if (e.currentTarget.parentNode.className == 'cpu' && !isDraw) {
                // alert('draw');
                // 引いたカードを手札に加える
                selectCard(e, cpuHand).addToHand(playerHand);
                // // 引いたカードをCPU手札から消す
                e.currentTarget.remove();
                // 引いたカードを表面にする
                selectCard(e, cpuHand).print();
                // 引いたカードをクリックできるようにする
                selectCard(e, cpuHand).click();
                cpuHand.splice(cpuHand.indexOf(selectCard(e, cpuHand)), 1);
                isDraw = true;
            }
            // if clicked player hand
            else if (e.currentTarget.parentNode.className == 'player1' && turn == "Player") {
                // alert('pick a pard');
                if (firstPick == null) {
                    firstPick = selectCard(e, playerHand);
                } else {
                    let secondPick = selectCard(e, playerHand);
                    compareCard(secondPick);
                    firstPick = null;
                }
            }
            gameResult();
        });
    }
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
// ランダムに両者の手札に配る
function dealDech() {
    let randomNum;
    let hand = 'cpu';
    // デッキから無くなるまでカードを配る
    while (deck.length != 0) {
        randomNum = Math.floor(Math.random() * deck.length);
        // Cpuに配る
        if (hand == 'cpu') {
            hand = 'player'
            deck[randomNum].addToHand(cpuHand);
            deck[randomNum].click();
        }
        // プレイヤーに配る
        else {
            hand = 'cpu'
            deck[randomNum].addToHand(playerHand);
            deck[randomNum].print();
            deck[randomNum].click();
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
            phase = "PLAYING"
            sortHandAndDOM(playerHand)
            checkMatch()
            gameResult()
            break;
        case "PLAYING":
            gameResult();
            switchTurn();
            break;
    }
});


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
    }
}

// カードを削除
function deleteCard(card) {
    document.getElementById("cardId" + card.id).remove();
    playerHand.splice(playerHand.indexOf(firstPick), 1);

}
// 勝利宣言
function gameResult() {
    if (playerHand.length == 0) {
        alert("player win!!");

    } else if (cpuHand.length == 0) {
        alert("computer win!!");
    }

}
// ターンの切り替え
function switchTurn() {
    if (turn == "Player") {
        turn = "Enemy";
        document.getElementById("turn").style.color = "pink"
        document.getElementById("turn").textContent = turn;
        document.getElementById("text").textContent = "Wait..";
        sortHandAndDOM(playerHand)
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
async function cpuDraw() {
    let randomNum = Math.floor(Math.random() * playerHand.length);
    document.getElementById("cardId" + playerHand[randomNum].id).remove();
    playerHand[randomNum].addToHand(cpuHand);
    playerHand.splice(playerHand.indexOf(playerHand[randomNum]), 1);
    return;
}

async function TimeOut() {
    return;
}


// 相手ターンを待機で処理
async function cpuTurn() {
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve(cpuDraw()), 3000)
    });
    let result = await promise; // promise が解決するまで待ちます (*)
    let promise2 = new Promise((resolve, reject) => {
        setTimeout(() => resolve(TimeOut()), 3000)
    });
    let result2 = await promise2;
    switchTurn();
    alert(turn);
}

function sortHand(arr){
    arr = arr.sort((a,b)=>(a.num > b.num) ? 1 :-1)
     };
     console.log(playerHand);

function sortHandAndDOM(arr){
    player1Element = document.getElementById('player1')
    player1Element.innerHTML ="";
    sortHand(arr);
    console.log(arr[0].id)
    for(let i = 0; i < arr.length; i++){
        var newDiv1 = document.createElement('div');
        newDiv1.id = `cardId${arr[i].id}`
        newDiv1.className = 'card'
        player1Element.appendChild(newDiv1)
            var newP2 = document.createElement('p');
            var newSpan2 = document.createElement('span');
            switch (arr[i].mark) {
                case 0:
                    mark = '♠'
                    break;
                case 1:
                    mark = '♥'
                    //     // numberとmarkの色を赤にする
                    newP2.style.color = "red";
                    newSpan2.style.color = "red";
                    break;
                case 2:
                    mark = '♣'
                    break;
                case 3:
                    mark = '♦'
                    newP2.style.color = "red";
                    newSpan2.style.color = "red";
                    break;
                case 4:
                    mark = "JOKER"
                    this.num = "💀"
                    break;
            }
            newP2.className = 'number';
            newP2.innerHTML = `${arr[i].num}`
            newSpan2.className = 'mark';
            newSpan2.innerHTML = mark
            newDiv1.appendChild(newP2)
            newDiv1.appendChild(newSpan2)
        }
    }


function checkMatch(){
    for(let i = 0; i < playerHand.length; i++){
    let cardDiv = document.getElementById('cardId' + playerHand[i].id);
    cardDiv.addEventListener('click', (a) => {
        // if clicked player hand
        if (a.currentTarget.parentNode.className == 'player1' && turn == "Player") {
            // alert('pick a card');
            if (firstPick == null) {
                firstPick = selectCard(a, playerHand);
            } else {
                let secondPick = selectCard(a, playerHand);
                compareCard(secondPick);
                firstPick = null;
            }
        }
    }
    )}
}