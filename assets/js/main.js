const gameBoard = document.querySelector(".game-board");
const startButton = document.querySelector(".start-button"); // Thêm tham chiếu đến nút Bắt đầu
const resetButton = document.querySelector(".reset-button");
const modelBox = document.getElementById("model-congratulations");

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

  // Đảm bảo nút Bắt đầu được bật khi tạo bảng mới
  startButton.disabled = false;

  // Xáo trộn các giá trị ẩn cho mặt trước của thẻ (true/false)
  const shuffledValues = shuffle(cardValues);

  // Tạo và xáo trộn mảng số từ 1 đến 12 cho mặt sau của thẻ (số vẫn random)
  const numbers = Array.from({ length: 12 }, (_, i) => i + 1); // Mảng [1, 2, ..., 12]
  const shuffledNumbers = shuffle(numbers); // Mảng số đã xáo trộn

  // Định nghĩa các chỉ số (vị trí 0-11) sẽ có màu nền đặc biệt
  const specialIndices = [1, 3, 4, 6, 9, 11];

  shuffledValues.forEach((value, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    // Lưu giá trị ẩn (true/false) vào data attribute
    card.dataset.value = value;
    // Lưu số ngẫu nhiên vào data attribute
    card.dataset.number = shuffledNumbers[index];

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-face", "card-front");
    // Hiển thị nội dung thực tế trên mặt trước dựa vào giá trị ẩn
    if (value === true) {
      cardFront.innerHTML =
        '<div class="default-front-card card-jojo"><img src="./assets/images/img_jojo.png"/></div>';
      cardFront.classList.add("isJojo"); // Giữ class 'isJojo' cho styling màu vàng
    } else {
      cardFront.innerHTML =
        '<div class="default-front-card"><img src="./assets/images/img_ice_cream.png"/></div>'; // Hiển
    }

    // *** Thêm logic áp dụng màu nền dựa trên CHỈ SỐ (vị trí) của ô vào cardFront ***
    if (specialIndices.includes(index)) {
      cardFront.classList.add("special-color"); // Sử dụng màu đặc biệt cho mặt trước
    } else {
      cardFront.classList.add("default-color"); // Sử dụng màu mặc định cho mặt trước
    }
    // ******************************************************************************

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-face", "card-back", "initial"); // Thêm class 'initial' và hiển thị "?"
    cardBack.textContent = "?"; // Hiển thị dấu "?" ban đầu
    cardBack.setAttribute("target-node", ".card"); // Lưu số ngẫu nhiên vào data attribute
    cardBack.setAttribute("font-percents", "0.7"); // Lưu số ngẫu nhiên vào data attribute
    // Áp dụng màu nền dựa trên CHỈ SỐ (vị trí) của ô vào cardBack
    if (specialIndices.includes(index)) {
      // Check the current index (0-11)
      cardBack.classList.add("special-color"); // Sử dụng màu đặc biệt
    } else {
      cardBack.classList.add("default-color"); // Sử dụng màu mặc định
    }

    card.appendChild(cardFront);
    card.appendChild(cardBack);

    // Thêm lắng nghe sự kiện click ngay khi tạo, nhưng logic flipCard sẽ kiểm tra gameStarted
    card.addEventListener("click", flipCard);

    gameBoard.appendChild(card);
  });

  // Hiển thị nút Bắt đầu khi bảng được tạo mới
  startButton.style.display = "block";
  getFontSizeTarget(); // Gọi hàm để thiết lập kích thước font cho các thẻ
}

// Hàm bắt đầu trò chơi (được gọi khi nhấn nút Bắt đầu)
function startGame() {
  if (gameStarted) return; // Tránh bắt đầu lại nếu game đã chạy

  gameStarted = true; // Đặt trạng thái game đã bắt đầu
  startButton.disabled = true; // Vô hiệu hóa nút Bắt đầu sau khi nhấn

  // Lật tất cả thẻ về mặt sau hiển thị số
  const allCards = gameBoard.querySelectorAll(".card");
  allCards.forEach((card) => {
    const cardBack = card.querySelector(".card-back");
    cardBack.textContent = card.dataset.number; // Hiển thị số ngẫu nhiên
    cardBack.classList.remove("initial"); // Xóa class 'initial' để áp dụng styling số
    // Đảm bảo thẻ đang úp (không có class is-flipped)
    card.classList.remove("is-flipped");
  });

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
    setTimeout(checkMatch, 1000); // Chờ 1 giây rồi kiểm tra cặp
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
    console.log("Chúc mừng! Bạn đã trúng thưởng!");
    hasWon = true; // Đặt cờ thắng
    lockBoard = true; // Khóa bảng ngay lập tức khi biết thắng
    modelBox.showPopover();

    // Chờ 2 giây để người dùng nhìn thấy thông báo trúng thưởng
    setTimeout(() => {
      revealAllCards(); // Lật TẤT CẢ các thẻ lên để xem kết quả cuối cùng
      console.log(" Toàn bộ kết quả - Game kết thúc"); // Thêm thông báo
    }, 2000); // Hiển thị thông báo trúng thưởng trong 2 giây
  } else {
    // Trường hợp không trúng thưởng (không phải 2 Jojo)
    console.log("Rất tiếc, không trúng thưởng. Hãy thử lại!");

    // Úp lại tất cả thẻ đang lật sau 1 giây
    setTimeout(() => {
      unflipCards(); // Úp lại tất cả thẻ đang lật (bao gồm 2 thẻ vừa click)
      lockBoard = false; // Mở khóa bảng để người chơi tiếp tục lật
    }, 1000); // Hiển thị kết quả thua trong 1 giây
  }

  // Xóa danh sách các thẻ đã lật cho lượt tiếp theo
  flippedCards = [];
  // lockBoard được điều khiển trong các setTimeout và unflipCards
}

// Hàm úp lại TẤT CẢ các thẻ đang lật (có class 'is-flipped')
// Sử dụng khi không trúng thưởng
function unflipCards() {
  const allFlipped = gameBoard.querySelectorAll(".card.is-flipped");
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
  const allCards = gameBoard.querySelectorAll(".card");
  allCards.forEach((card) => {
    card.classList.add("is-flipped");
    // Loại bỏ listener click để không thể lật lại sau khi đã lật hết
    card.removeEventListener("click", flipCard);
  });
  lockBoard = true; // Đảm bảo bảng vẫn khóa sau khi lật hết thẻ
}

// Hàm thiết lập sự kiện cho các nút điều khiển
function setupControls() {
  // Gán sự kiện click cho nút Bắt đầu
  startButton.removeEventListener("click", startGame); // Xóa listener cũ nếu có
  startButton.addEventListener("click", startGame);

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
    console.debug(el);
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
    console.debug(el);
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
