let clickCount = 0;

const img = document.getElementById("mainImage");
const sudokuContainer = document.getElementById("sudokuContainer");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");

const counterText = document.getElementById("clickCounter");
const hintText = document.getElementById("hintText");

// 請換成你的圖片檔名
let wrongCount = 0; // 計算答錯次數
const IMG_F = "F.jpg"; // 新增照片 F
const IMG_A = "A.jpg";  // 初始
const IMG_B = "B.jpg";  // 按住
const IMG_C = "C.jpg";  // 第 10 下
const IMG_D = "D.jpg";  // 3 秒後
const IMG_E = "E.jpg";  // 答對後

// 產生有題目的 3×3（每列不重複）
let sudokuSolution = [];

/* 洗牌工具 */
function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

/* 產生 3×3 合法答案（橫直都不重複） */
function generateSolution() {
    const base = [
        [1, 2, 3],
        [2, 3, 1],
        [3, 1, 2]
    ];

    const nums = shuffle([1, 2, 3]);
    sudokuSolution = base.map(row =>
        row.map(n => nums[n - 1])
    );
}

/* 產生有題目的數獨 */
function generateSudoku() {
    generateSolution();

    const grid = document.getElementById("sudokuGrid");
    grid.innerHTML = "";

    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            const cell = document.createElement("input");
            cell.type = "number";
            cell.min = 1;
            cell.max = 3;
            cell.dataset.row = r;
            cell.dataset.col = c;

            if (Math.random() < 0.5) {
                cell.value = sudokuSolution[r][c];
                cell.disabled = true;
                cell.style.background = "#ddd";
            }

            grid.appendChild(cell);
        }
    }
}

// 滑鼠按下 → B
img.addEventListener("mousedown", () => {
    // 10 下後就不能再觸發 B
    if (clickCount >= 10) return;
    img.src = IMG_B;
});

// 滑鼠放開 → 回到 A，並記錄次數
img.addEventListener("mouseup", () => {

    // 超過 10 下就不能再點
    if (clickCount >= 10) return;

    img.src = IMG_A;
    clickCount++;

    // 更新計數文字
    counterText.textContent = "你已經點了 " + clickCount + " 下";

    // 達到第十下 → 執行特效流程
    if (clickCount === 10) {

        // 隱藏提示文字與計數
        counterText.classList.add("hidden");
        hintText.classList.add("hidden");

        triggerSequence();
    }
});

// 點滿 10 下後的流程
function triggerSequence() {
    img.src = IMG_C;

    // 3 秒後換 D
    setTimeout(() => {
        img.src = IMG_D;

        // 再 3 秒後出現數獨
        setTimeout(() => {
            showSudoku();
        }, 3000);

    }, 3000);
}

// 顯示數獨
function showSudoku() {
    generateSudoku();
    sudokuContainer.classList.remove("hidden");
}

// 清空
function clearSudoku() {
    document.querySelectorAll("#sudokuGrid input").forEach(input => {
        if (!input.disabled) {
            input.value = "";
        }
    });
    message.textContent = "";
}

// 送出答案
function submitSudoku() {
    message.textContent = "";

    const inputs = document.querySelectorAll("#sudokuGrid input");
    let ok = true;

    inputs.forEach(input => {
        let r = input.dataset.row;
        let c = input.dataset.col;

        if (parseInt(input.value) !== sudokuSolution[r][c]) {
            ok = false;
        }
    });

    if (ok) {
    // 答對 → E 照片
    img.src = IMG_E;
    sudokuContainer.classList.add("hidden");
    restartBtn.classList.remove("hidden");
} else {
    wrongCount++;

    if (wrongCount >= 3) {
        // 失敗三次 → F 照片
        img.src = IMG_F;
        sudokuContainer.classList.add("hidden");

        // 顯示重新開始按鈕
        restartBtn.classList.remove("hidden");

        message.textContent = ""; // 清除警告文字
    } else {
        message.textContent = "喔不!!! 外奇要窒息了!!!（第 " + wrongCount + " 次）";
    }
}

// 重新開始
function restart() {
    clickCount = 0;
    wrongCount = 0;  // ← 加這行
    img.src = IMG_A;

    sudokuContainer.classList.add("hidden");
    restartBtn.classList.add("hidden");
    message.textContent = "";

    counterText.classList.remove("hidden");
    hintText.classList.remove("hidden");

    counterText.textContent = "你已經點了 0 下";
}

