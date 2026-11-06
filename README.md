# HIIT 20 分鐘計時器｜開發交接包

版本：1.0.0-rebuilt · 整理日期：2026-11-06（Asia/Taipei）

**這是需求重建版，不是原始碼完整復原。** 最後一版 ChatGPT 內嵌互動內容只取得參照，無法取得其程式碼。原使用者確認動作名稱在原碼內；不可把本包缺漏視為原碼沒有設定。

## 立即使用與繼續開發

1. 解壓縮，先讀 `HANDOFF.md` 與 `docs/PROVENANCE.md`。
2. 桌面瀏覽器可自行開啟 `HIIT_20min_rebuilt.html`。它是單一完整 HTML，含 CSS 與 JavaScript，不依賴 CDN、帳號、API key 或套件安裝。
3. 若本機檔案環境限制功能，在解壓縮目錄執行 `python3 -m http.server 8000 --bind 127.0.0.1`，自行開啟 `http://localhost:8000/HIIT_20min_rebuilt.html`。Ctrl+C 停止。只供本機開發，不對外部署；手機的 localhost 不是電腦。
4. 按開始，允許前景音訊。可暫停、繼續、重置、切換動作／輪次／階段，或按上一輪／下一輪。
5. 新 session 上傳整包 ZIP，請先閱讀 `HANDOFF.md`。若平台不能讀 ZIP，解壓縮後附上 HTML、HANDOFF 與 docs。

**下載 HTML 不代表能在 ChatGPT 檔案預覽執行。** 新 session 若有可執行的互動畫布，需把完整 HTML 載入該環境；是否允許 JavaScript、音訊與常亮，由宿主決定。本包未建立新的 ChatGPT 內嵌產物，已依後續指示推送 GitHub 儲存庫，但未啟用 GitHub Pages。

## 已保留

- 5 組，每組連續 4 輪，每輪運動 30 秒＋休息 30 秒，共 1200 秒，含最後休息。
- 深蹲的休息改為靜態深蹲，仍為 30 秒。
- 自由切換動作、輪次、運動／休息；上一輪、下一輪。
- 中文階段語音、最後 3 秒倒數、完成提示。
- Web Audio 合成背景節奏：128 BPM，音量預設 35%，可關閉。
- 暫停、繼續、重置；常亮請求失敗不影響計時。

## 原始設定缺口

舊版截圖確認第一組蛙跳。深蹲由本次需求確認，但原位置未知，重建暫列第二組。第 3～5 組用「待取回」占位，可改名稱。**課表結構完整；原五組名稱／順序尚未完整還原。** UI、合成音色、提示文案與背景暫停策略均為本次重建，不宣稱與原版相同。

## 檔案

| 檔案 | 用途 |
|---|---|
| HIIT_20min_rebuilt.html | 可攜單檔執行版 |
| src/core.js | 純計時與課表位置邏輯 |
| src/app.js | UI、語音、節奏、常亮、生命週期 |
| src/body.html、src/style.css | 畫面與樣式 |
| build.py | 從 src 重建單檔 HTML |
| tests/ | Node 內建測試，無外部依賴 |
| docs/REQUIREMENTS.md | 需求與驗收條件 |
| docs/ARCHITECTURE.md | 狀態與設計決策 |
| docs/KNOWN_ISSUES.md | 限制與實機測試清單 |
| docs/IPHONE_WAKE_LOCK.md | iPhone ChatGPT 常亮限制與官方參考 |
| docs/PROVENANCE.md | 擷取範圍、原碼缺失、重建差異 |
| docs/TODO.md | 後續開發待辦 |
| docs/TEST_REPORT.md | 測試結果與證據邊界 |
| docs/conversation-export.json | 工具可取得的文字對話，不是完整原對話匯出 |
| docs/evidence/original-preview.png | 使用者提供的舊版檔案預覽截圖 |
| HANDOFF.md | 新 session 起點 |

## 開發指令

需求：Python 3（建置／本機伺服器）、Node.js 20+（測試）。直接開 HTML 不需要這兩者。

```sh
python3 build.py
node --check src/core.js
node --check src/app.js
node --test tests/*.test.cjs
```

只修改 src，再執行 build.py；不要只改生成 HTML，否則下次建置會覆蓋。應用不送出網路請求、不持久保存訓練資料；系統語音服務的實作由裝置決定。

## 儲存庫交接更新（2026-11-06）

使用者後續明確要求推送至 https://github.com/housemeow/workout。先前「不部署 GitHub」限制已就程式碼推送更新；未啟用 GitHub Pages。歷史對話與來源證據保留原文。
