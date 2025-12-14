document.addEventListener("DOMContentLoaded", () => {

    /* ======================
       基本狀態
    ====================== */
    let clickCount = 0;
    let wrongCount = 0;

    let timeLeft = 20;
    let timerId = null;

    const img = document.getElementById("mainImage");
    const sudokuContainer = document.getElementById("sudokuContainer");
    const message = document.getElementById("message");
    const restartBtn = document.getElementById("restartBtn");
    const counterText = document.getElementById("clickCounter");
    const hintText = document.getElementById("hintText");
    const timerText = document.getElementById("timerText");

    /* ======================
       圖片設定
    ====================== */
    const IMG_A = "A.jpg";
    const IMG_B = "B.jpg";
    const IMG_C = "C.jpg";
    const IMG_D = "D.jpg";
    const IMG_E = "E.jpg";
    const IMG_F = "F.jpg";

    /* ======================
       數獨資料
    ====================== */
    let sudokuSolution = [];

    function shuffle(arr) {
        return arr.sort(() => Math.random() - 0.5);
    }

    // 產生合法 3×3（橫直都不重複）
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

                // 提示格（題目）→ 機率降低，變難
                if (Math.random() < 0.33) {
                    cell.value = sudokuSolution[r][c];
                    cell.disabled = true;
                    cell.style.background = "#ddd";
                }

                grid.appendChild(cell);
            }
        }
    }

    /* ======================
       倒數計時
    ====================== */
    function startTimer() {
        timeLeft = 20;
        timerText.textContent = `在 ${timeLeft} 秒內解開數獨，拯救外奇！！`;

        timerId = setInterval(() => {
            timeLeft--;
            timerText.textContent = `在 ${timeLeft} 秒內解開數獨，拯救外奇！！`;

            if (timeLeft <= 0) {
                clearInterval(timerId);
                timerId = null;

                img.src = IMG_F;
                sudokuContainer.classList.add("hidden");
                restartBtn.classList.remove("hidden");
                message.textContent = "";
            }
        }, 1000);
    }

    function stopTimer() {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
    }

    /* ======================
       圖片點擊流程
    ====================== */
    img.addEventListener("mousedown", () => {
        if (clickCount >= 10) return;
        img.src = IMG_B;
    });

    img.addEventListener("mouseup", () => {
        if (clickCount >= 10) return;

        img.src = IMG_A;
        clickCount++;
        counterText.textContent = `你已經點了 ${clickCount} 下`;

        if (clickCount === 10) {
            counterText.classList.add("hidden");
            hintText.classList.add("hidden");
            triggerSequence();
        }
    });

    function triggerSequence() {
        img.src = IMG_C;

        setTimeout(() => {
            img.src = IMG_D;

            setTimeout(() => {
                showSudoku();
            }, 3000);

        }, 3000);
    }

    function showSudoku() {
        generateSudoku();
        sudokuContainer.classList.remove("hidden");
        startTimer();
    }

    /* ======================
       數獨按鈕（HTML onclick 用）
    ====================== */
    window.clearSudoku = function () {
        document.querySelectorAll("#sudokuGrid input").forEach(input => {
            if (!input.disabled) input.value = "";
        });
        message.textContent = "";
    };

    window.submitSudoku = function () {
        message.textContent = "";
        let ok = true;

        document.querySelectorAll("#sudokuGrid input").forEach(input => {
            const r = input.dataset.row;
            const c = input.dataset.col;
            if (parseInt(input.value) !== sudokuSolution[r][c]) {
                ok = false;
            }
        });

        if (ok) {
            stopTimer();
            img.src = IMG_E;
            sudokuContainer.classList.add("hidden");
            restartBtn.classList.remove("hidden");
        } else {
            wrongCount++;

            if (wrongCount >= 3) {
                stopTimer();
                img.src = IMG_F;
                sudokuContainer.classList.add("hidden");
                restartBtn.classList.remove("hidden");
                message.textContent = "";
            } else {
                message.textContent = `喔不!!! 外奇要窒息了!!!（第 ${wrongCount} 次）`;
            }
        }
    };

    /* ======================
       重新開始
    ====================== */
    window.restart = function () {
        stopTimer();

        clickCount = 0;
        wrongCount = 0;

        img.src = IMG_A;
        sudokuContainer.classList.add("hidden");
        restartBtn.classList.add("hidden");
        message.textContent = "";

        counterText.classList.remove("hidden");
        hintText.classList.remove("hidden");
        counterText.textContent = "你已經點了 0 下";
    };

});
