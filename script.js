let clickCount = 0;

const img = document.getElementById("mainImage");
const sudokuContainer = document.getElementById("sudokuContainer");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");

// 假定你之後會提供圖片名稱請修改
const IMG_A = "A.jpg";
const IMG_B = "B.jpg";
const IMG_C = "C.jpg";
const IMG_D = "D.jpg";
const IMG_E = "E.jpg";

// 3×3 數獨答案（每列不能重複）
let sudokuSolution = [];

// 產生簡易 3×3 數獨（每列 1～3 不重複）
function generateSudoku() {
    sudokuSolution = [];

    for (let i = 0; i < 3; i++) {
        let arr = [1, 2, 3];
        arr.sort(() => Math.random() - 0.5); // 打亂
        sudokuSolution.push(arr);
    }

    // 顯示格子
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
            grid.appendChild(cell);
        }
    }
}

// 滑鼠按下 → B
img.addEventListener("mousedown", () => {
    img.src = IMG_B;
});

// 滑鼠放開 → A
img.addEventListener("mouseup", () => {
    // 如果已經到 10 下，就不能再點，直接忽略
    if (clickCount >= 10) return;

    img.src = IMG_A;
    clickCount++;

    // 更新計數
    document.getElementById("clickCounter").textContent =
        "你已經點了 " + clickCount + " 下";

    // 點滿 10 下 → 立刻啟動下一階段
    if (clickCount === 10) {
        // 隱藏「你已經點了 X 下」與提示文字
        document.getElementById("clickCounter").classList.add("hidden");
        document.getElementById("hintText").classList.add("hidden");

        triggerSequence();  // 立刻換成第三張
    }
});

// 點滿 10 下的流程
function triggerSequence() {
    img.src = IMG_C;

    setTimeout(() => {
        img.src = IMG_D;

        setTimeout(() => {
            showSudoku();
        }, 3000);

    }, 3000);
}

// 顯示數獨
function generateSudoku() {
    sudokuSolution = [];

    // 1. 產生正確解答（每列都 1,2,3 打亂）
    for (let i = 0; i < 3; i++) {
        let arr = [1, 2, 3];
        arr.sort(() => Math.random() - 0.5);
        sudokuSolution.push(arr);
    }

    // 2. 顯示格子
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

            // 3. 隨機決定是否要給提示（1/2 機率）
            if (Math.random() < 0.5) {
                cell.value = sudokuSolution[r][c];
                cell.disabled = true;   // 題目不能改
                cell.style.background = "#ddd"; // 顯示灰底是題目
            }

            grid.appendChild(cell);
        }
    }
}

// 清空
function clearSudoku() {
    document.querySelectorAll("#sudokuGrid input").forEach(input => {
        input.value = "";
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
        img.src = IMG_E;
        sudokuContainer.classList.add("hidden");
        restartBtn.classList.remove("hidden");
    } else {
        message.textContent = "喔不!!! 外奇要窒息了!!!";
    }
}

// 重新開始
function restart() {
    clickCount = 0;
    img.src = IMG_A;
    sudokuContainer.classList.add("hidden");
    message.textContent = "";
    restartBtn.classList.add("hidden");
}




