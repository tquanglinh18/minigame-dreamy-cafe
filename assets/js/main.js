const gameBoard = document.querySelector(".game-board");
const resetButton = document.querySelector(".reset-button");
const playAudioButton = document.getElementById("btn-play-audio");

// Thêm sự kiện click cho nút "Play Audio" để phát nhạc nền
if (playAudioButton != null) {
  playAudioButton.addEventListener("click", () => {
    playAudioButton.classList.toggle("audio--pause");
    var bgAudio = document.getElementById("bg-audio");
    if (bgAudio.duration > 0 && !bgAudio.paused) {
      bgAudio.pause();
    } else {
      bgAudio.play();
    }
  });
}

// Danh sách 12 giá trị ẩn cho các ô. Sử dụng true cho mèo (giờ là Jojo), false cho chúc may mắn.
// Điều này giúp tránh người dùng đọc trực tiếp nội dung nhạy cảm qua DevTools.
const cardValues = [
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  true,
  true, // true đại diện cho 'Jojo'
];

let flippedCards = []; // Mảng lưu trữ các thẻ đang được lật trong lượt hiện tại
let lockBoard = false; // Biến cờ để khóa bảng
let hasWon = false; // Biến cờ để kiểm tra trạng thái thắng
let gameStarted = false; // Trạng thái trò chơi đã bắt đầu hay chưa

// Hàm xáo trộn mảng (Fisher-Yates Shuffle Algorithm)
function shuffle(array) {
  const shuffledArray = [...array]; // Tạo bản sao
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

// Hàm tạo và hiển thị bảng trò chơi ở trạng thái ban đầu (dấu ?)
function createBoard() {
  gameBoard.innerHTML = ""; // Xóa bảng cũ
  flippedCards = [];
  lockBoard = false;
  hasWon = false; // Reset trạng thái thắng
  gameStarted = false; // Đặt lại trạng thái game chưa bắt đầu

  // Xáo trộn các giá trị ẩn cho mặt trước của thẻ (true/false)
  const shuffledValues = shuffle(cardValues);

  // Tạo và xáo trộn mảng số từ 1 đến 12 cho mặt sau của thẻ (số vẫn random)
  const numbers = Array.from({ length: 12 }, (_, i) => i + 1); // Mảng [1, 2, ..., 12]
  const shuffledNumbers = shuffle(numbers); // Mảng số đã xáo trộn

  // Định nghĩa các chỉ số (vị trí 0-11) sẽ có màu nền đặc biệt
  const specialIndices = [1, 3, 4, 6, 9, 11];

  shuffledValues.forEach((value, index) => {
    const card = document.createElement("div");
    card.classList.add("card-flip");
    // Lưu giá trị ẩn (true/false) vào data attribute
    card.dataset.value = value;
    // Lưu số ngẫu nhiên vào data attribute
    card.dataset.number = shuffledNumbers[index];

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-face", "card-front");
    // Hiển thị nội dung thực tế trên mặt trước dựa vào giá trị ẩn
    if (value === true) {
      cardFront.innerHTML = `<div class="default-front-card card-jojo">
      <div style="width: 58%; position: absolute">
      <div style="width: 100%; padding-top: 145.55%; position: relative">
        <!-- Chân trái -->
        <div
          class="jojo-leg-left"
          style="width: 19.58%; position: absolute; top: 86%; right: 28%"
        >
          <img
            style="width: 100%; max-width: 100%"
            src="./assets/images/jojo_1.png"
            alt="Chân trái"
          />
        </div>

        <!-- Chân phải -->
        <div
          class="jojo-leg-right"
          style="width: 19.58%; position: absolute; top: 83%; right: 15%"
        >
          <img
            style="width: 100%; max-width: 100%"
            src="./assets/images/jojo_2.png"
            alt="Chân phải"
          />
        </div>

        <!-- Tay phải -->
        <div
          class="jojo-arm-right"
          style="width: 18.69%; position: absolute; top: 71%; right: 11%"
        >
          <img
            style="width: 100%; max-width: 100%"
            src="./assets/images/jojo_5.png"
            alt="Tay phải"
          />
        </div>

        <!-- Thân nhân vật -->
        <div
          class="jojo-body"
          style="width: 29.98%; position: absolute; top: 69%; right: 19%"
        >
          <img
            style="width: 100%; max-width: 100%"
            src="./assets/images/jojo_4.png"
            alt="Thân nhân vật"
          />
        </div>

        <!-- Tay trái -->
        <div
          class="jojo-arm-left"
          style="width: 20.36%; position: absolute; top: 73%; right: 38%"
        >
          <img
            style="width: 100%; max-width: 100%"
            src="./assets/images/jojo_3.png"
            alt="Tay trái"
          />
        </div>

        <!-- Nhóm phần đầu -->
        <div class="jojo-head-wrapper">
          <!-- Tóc búi đỉnh đầu -->
          <div
            class="jojo-hair"
            style="width: 51.78%; position: absolute; top: 0; left: 0"
          >
            <img
              style="width: 100%; max-width: 100%"
              src="./assets/images/jojo_6.png"
              alt="Tóc búi"
            />
          </div>

          <!-- Đầu nhân vật -->
          <div style="width: 95.38%; position: absolute; top: 12%; right: 0%">
            <img
              style="width: 100%; max-width: 100%"
              src="./assets/images/jojo_7.png"
              alt="Đầu nhân vật"
            />
          </div>

          <!-- Mắt trái -->
          <div
            class="jojo-eye"
            style="width: 23.36%; position: absolute; top: 58%; right: 37%"
          >
            <img
              style="width: 100%; max-width: 100%"
              src="./assets/images/jojo_9.png"
              alt="Mắt trái"
            />
          </div>

          <!-- Mắt phải -->
          <div
            class="jojo-eye"
            style="width: 15.85%; position: absolute; top: 54%; right: 9%"
          >
            <img
              style="width: 100%; max-width: 100%"
              src="./assets/images/jojo_10.png"
              alt="Mắt phải"
            />
          </div>

          <!-- Tóc mái -->
          <div
            class="jojo-hair"
            style="width: 63.85%; position: absolute; top: 34%; right: 4%"
          >
            <img
              style="width: 100%; max-width: 100%"
              src="./assets/images/jojo_8.png"
              alt="Tóc mái"
            />
          </div>
        </div>
      </div>
    </div>
        </div>`;
      cardFront.classList.add("isJojo"); // Giữ class 'isJojo' cho styling màu vàng
    } else {
      cardFront.innerHTML =
        '<div class="default-front-card"><img src="./assets/images/img_ice_cream.png"/></div>'; // Hiển
    }

    if (specialIndices.includes(index)) {
      cardFront.classList.add("special-color"); // Sử dụng màu đặc biệt cho mặt trước
    } else {
      cardFront.classList.add("default-color"); // Sử dụng màu mặc định cho mặt trước
    }

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-face", "card-back", "initial"); // Thêm class 'initial' và hiển thị "?"
    cardBack.textContent = "?"; // Hiển thị dấu "?" ban đầu
    cardBack.setAttribute("target-node", ".card-flip"); // Lưu số ngẫu nhiên vào data attribute
    cardBack.setAttribute("font-percents", "0.7"); // Lưu số ngẫu nhiên vào data attribute
    // Áp dụng màu nền dựa trên CHỈ SỐ (vị trí) của ô vào cardBack
    if (specialIndices.includes(index)) {
      // Check the current index (0-11)
      cardBack.classList.add("special-color"); // Sử dụng màu đặc biệt
    } else {
      cardBack.classList.add("default-color"); // Sử dụng màu mặc định
    }

    const allCards = gameBoard.querySelectorAll(".card-flip");
    allCards.forEach((card) => {
      card.classList.remove("hidden-during-win-animation");
    });
    card.appendChild(cardFront);
    card.appendChild(cardBack);

    // Thêm lắng nghe sự kiện click ngay khi tạo, nhưng logic flipCard sẽ kiểm tra gameStarted
    card.addEventListener("click", flipCard);

    gameBoard.appendChild(card);
  });
  getFontSizeTarget(); // Gọi hàm để thiết lập kích thước font cho các thẻ
  startGame();
}

// Hàm bắt đầu trò chơi (được gọi khi nhấn nút Bắt đầu)
function startGame() {
  if (gameStarted) return; // Tránh bắt đầu lại nếu game đã chạy

  gameStarted = true; // Đặt trạng thái game đã bắt đầu

  // Lật tất cả thẻ về mặt sau hiển thị số
  const allCards = gameBoard.querySelectorAll(".card-flip");
  for (const [index, card] of allCards.entries()) {
    const cardBack = card.querySelector(".card-back");
    cardBack.textContent = index + 1; // Hiển thị số ngẫu nhiên
    cardBack.classList.remove("initial"); // Xóa class 'initial' để áp dụng styling số
    // Đảm bảo thẻ đang úp (không có class is-flipped)
    card.classList.remove("is-flipped");
  }

  lockBoard = false; // Mở khóa bảng để cho phép lật thẻ
  flippedCards = []; // Reset danh sách thẻ lật
  hasWon = false; // Reset trạng thái thắng
}

// Hàm xử lý sự kiện khi một thẻ được click
function flipCard() {
  // Chỉ cho phép lật thẻ khi game đã bắt đầu
  if (
    !gameStarted ||
    lockBoard ||
    hasWon ||
    this.classList.contains("is-flipped")
  )
    return;

  this.classList.add("is-flipped"); // Lật thẻ lên
  flippedCards.push(this); // Thêm thẻ vào danh sách đã lật trong lượt này

  // Kiểm tra xem đã lật đủ 2 thẻ chưa
  if (flippedCards.length === 2) {
    lockBoard = true; // Khóa bảng để không lật thêm khi đang kiểm tra
    setTimeout(checkMatch, 300); // Chờ 1 giây rồi kiểm tra cặp
  }
}

// Hàm kiểm tra xem 2 thẻ đã lật có phải là cặp mèo (Jojo) không
function checkMatch() {
  const [card1, card2] = flippedCards;
  // Lấy giá trị ẩn (true/false) từ data attribute để so sánh
  const value1 = card1.dataset.value === "true"; // Chuyển string 'true'/'false' thành boolean
  const value2 = card2.dataset.value === "true"; // Chuyển string 'true'/'false' thành boolean

  // Kiểm tra điều kiện thắng: cả hai đều là 'Jojo' (true)
  if (value1 === true && value2 === true) {
    hasWon = true; // Đặt cờ thắng
    lockBoard = true; // Khóa bảng ngay lập tức khi biết thắng

    setTimeout(() => {
      animateJojoWin(card1, card2); // Gọi hàm animation
    }, 500);
    // Chờ 2 giây để người dùng nhìn thấy thông báo trúng thưởng
    setTimeout(() => {
      revealAllCards(); // Lật TẤT CẢ các thẻ lên để xem kết quả cuối cùng
    }, 500); // Hiển thị thông báo trúng thưởng trong 2 giây
  } else {
    // Trường hợp không trúng thưởng (không phải 2 Jojo)

    // Úp lại tất cả thẻ đang lật sau 1 giây
    setTimeout(() => {
      unflipCards(); // Úp lại tất cả thẻ đang lật (bao gồm 2 thẻ vừa click)
      lockBoard = false; // Mở khóa bảng để người chơi tiếp tục lật
    }, 500); // Hiển thị kết quả thua trong 1 giây
  }

  // Xóa danh sách các thẻ đã lật cho lượt tiếp theo
  flippedCards = [];
  // lockBoard được điều khiển trong các setTimeout và unflipCards
}

// *** Hàm mới: Xử lý animation khi thắng Jojo ***
function animateJojoWin(card1, card2) {
  // 1. Hiệu ứng sáng lên
  card1.classList.add("lighting-up");
  card2.classList.add("lighting-up");

  // *** Ẩn các thẻ không phải Jojo khi hiệu ứng bắt đầu ***
  const allCards = gameBoard.querySelectorAll(".card-flip");
  allCards.forEach((card) => {
    // Kiểm tra nếu thẻ không phải là card1 hoặc card2
    if (card !== card1 && card !== card2) {
      card.classList.add("hidden-during-win-animation");
    }
  });

  // Lấy vị trí hiện tại của 2 thẻ Jojo
  const rect1 = card1.getBoundingClientRect();
  const rect2 = card2.getBoundingClientRect();
  const gameBoardRect = gameBoard.getBoundingClientRect();

  // Tính toán vị trí trung tâm của game board
  const centerX = gameBoardRect.width / 2 - rect1.width / 2; // Tâm ngang
  const centerY = gameBoardRect.height / 2 - rect1.height / 2; // Tâm dọc

  // Chuyển sang absolute positioning và đặt vị trí ban đầu
  // Vị trí ban đầu cần tính toán dựa trên offset so với gameBoard
  const initialTop1 = rect1.top - gameBoardRect.top;
  const initialLeft1 = rect1.left - gameBoardRect.left;
  const initialTop2 = rect2.top - gameBoardRect.top;
  const initialLeft2 = rect2.left - gameBoardRect.left;

  card1.style.position = "absolute";
  card1.style.top = initialTop1 + "px";
  card1.style.left = initialLeft1 + "px";

  card2.style.position = "absolute";
  card2.style.top = initialTop2 + "px";
  card2.style.left = initialLeft2 + "px";

  // 2. Di chuyển và hợp nhất (di chuyển về tâm)
  // Sử dụng setTimeout để cho hiệu ứng sáng lên có thời gian hiển thị
  setTimeout(() => {
    card1.classList.remove("lighting-up");
    card2.classList.remove("lighting-up");

    card1.classList.add("moving-to-center");
    card2.classList.add("moving-to-center");

    // Đặt vị trí đích là tâm game board
    card1.style.top = 50 + "%";
    card1.style.left = 50 + "%";
    card2.style.top = 50 + "%";
    card2.style.left = 50 + "%";

    // Lắng nghe sự kiện kết thúc transition của một trong hai thẻ
    card1.addEventListener("transitionend", handleMoveEnd);
    // Lưu trữ thẻ thứ hai để ẩn sau khi di chuyển
    card1.dataset.secondCardId = card2.id || "card2"; // Gán ID tạm nếu chưa có
    card2.id = card1.dataset.secondCardId; // Đảm bảo thẻ thứ 2 có ID để tìm
  }, 500); // Chờ 0.5 giây sau khi sáng lên

  // Hàm xử lý sau khi di chuyển về tâm kết thúc
  function handleMoveEnd() {
    card1.removeEventListener("transitionend", handleMoveEnd); // Gỡ bỏ listener
    const card2 = document.getElementById(card1.dataset.secondCardId);

    // Ẩn thẻ thứ hai
    if (card2) {
      card2.classList.add("hidden");
    }
    card1.classList.add("is-flipped");

    // 3. Lắc lư và phóng to trên thẻ còn lại
    card1.classList.remove("moving-to-center");
    card1.classList.add("win-animation");

    card1.addEventListener("animationend", handleWinAnimationEnd);
  }

  // Hàm xử lý sau khi animation lắc lư/phóng to kết thúc
  function handleWinAnimationEnd() {
    card1.removeEventListener("animationend", handleWinAnimationEnd); // Gỡ bỏ listener
  }
}

// Hàm úp lại TẤT CẢ các thẻ đang lật (có class 'is-flipped')
// Sử dụng khi không trúng thưởng
function unflipCards() {
  const allFlipped = gameBoard.querySelectorAll(".card-flip.is-flipped");
  allFlipped.forEach((card) => {
    card.classList.remove("is-flipped");
  });
  // Sau khi úp thẻ (khi không thắng), cần đảm bảo có thể click tiếp
  if (!hasWon) {
    lockBoard = false; // Đảm bảo bảng được mở khóa sau khi úp thẻ (trong trường hợp thua)
  }
}

// Hàm lật TẤT CẢ 12 thẻ lên (khi thắng)
function revealAllCards() {
  const allCards = gameBoard.querySelectorAll(".card-flip");
  allCards.forEach((card) => {
    card.classList.add("is-flipped");
    // Loại bỏ listener click để không thể lật lại sau khi đã lật hết
    card.removeEventListener("click", flipCard);
  });
  lockBoard = true; // Đảm bảo bảng vẫn khóa sau khi lật hết thẻ
}

// Hàm thiết lập sự kiện cho các nút điều khiển
function setupControls() {
  // Gán sự kiện click cho nút Chơi lại (luôn hiển thị)
  resetButton.removeEventListener("click", createBoard); // Xóa listener cũ nếu có
  resetButton.addEventListener("click", createBoard);
}

// Bắt đầu: Tạo bảng ở trạng thái ban đầu và thiết lập các nút
createBoard();
setupControls(); // Thiết lập sự kiện cho cả nút Bắt đầu và Chơi lại

function getFontSizeTarget() {
  const elements = document.querySelectorAll("[target-node][font-percents]");

  elements.forEach((el) => {
    const targetId = el.getAttribute("target-node");
    const percent = parseFloat(el.getAttribute("font-percents"));

    const target = document.querySelector(targetId);

    if (target && !isNaN(percent)) {
      const parentHeight = target.clientHeight;
      const fontSize = parentHeight * percent;

      el.style.fontSize = `${fontSize}px`;
    }
  });
}

new spine.SpinePlayer("right-character", {
  alpha: true,
  showControls: false,
  backgroundColor: "#00000000",
  skeleton: "assets/spine/Waiter_417Down.json",
  atlas: "assets/spine/Waiter_417Down.atlas",
  success: function (player) {
    player;
    player.setAnimation("idle_Down", true);
  },
});

new spine.SpinePlayer("left-character", {
  alpha: true,
  showControls: false,
  backgroundColor: "#00000000",
  skeleton: "assets/spine/Waiter_428Down.json",
  atlas: "assets/spine/Waiter_428Down.atlas",
  success: function (player) {
    player.setAnimation("idle_Down", true);
  },
});

function getFontSizeTarget() {
  const elements = document.querySelectorAll("[target-node][font-percents]");

  elements.forEach((el) => {
    const targetId = el.getAttribute("target-node");
    const percent = parseFloat(el.getAttribute("font-percents"));

    const target = document.querySelector(targetId);

    if (target && !isNaN(percent)) {
      const parentHeight = target.clientHeight;
      const fontSize = parentHeight * percent;

      el.style.fontSize = `${fontSize}px`;
    }
  });
}

window.addEventListener("resize", getFontSizeTarget);
