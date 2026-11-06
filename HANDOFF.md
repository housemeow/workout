# 新 session 開發交接

## 現在狀態

使用者要延續「HIIT計時器設計」：`6ae14895-2c28-83e8-b0f2-a549d5930631`。目標仍是 iPhone ChatGPT 內使用，已於 2026-11-06 授權推送 https://github.com/housemeow/workout；已要求啟用 GitHub Pages。

本包提供完整可執行的需求重建程式碼。最後互動版本沒有取回原碼；工具只回傳文字與 `chatgpt-content-reference` 占位。已取得的五個對話回合見 docs/conversation-export.json，沒有下一頁游標。不可宣稱完整原碼還原。

使用者回覆「程式碼內有」：原五組動作資料應優先從原碼找，勿再次要求使用者憑記憶列舉。此回覆不代表本次工具已取得原碼。若日後有原 HTML／互動畫布匯出，先比對取回，再取代占位。

## 不可丟失的需求

5 組各 4 輪，30 秒運動／30 秒休息，含最後休息共 20 分鐘；深蹲休息改靜態深蹲；動作與輪次切換；語音；合成背景節奏；暫停與重置。後續已授權推送儲存庫並啟用 GitHub Pages。

舊版截圖可證實第一組蛙跳、128 BPM、預設音量 35%、上一輪／下一輪。深蹲暫列第二組；3～5 組待取回，非原版資料。

## 開始工作順序

1. 讀 README、PROVENANCE、REQUIREMENTS、KNOWN_ISSUES。
2. `node --test tests/*.test.cjs`；目前七項測試通過（模擬 DOM，非實機）。
3. 有原始檔時先恢復動作清單及原版差異；沒有時保留缺口標示。
4. 在使用者可用的 ChatGPT 互動環境驗證「開始」與音訊，再記錄常亮結果。僅有 HTML 下載／預覽不能宣稱內嵌成功。
5. 改 src 後執行 `python3 build.py`，更新測試與文件。

## 操作邊界

使用者只允許開啟網頁；不得讀取或操作 Arc 或其他個人瀏覽器 UI，不得透過其他工具繞過限制自動點擊、輸入或提交。使用者自行操作瀏覽器。不要重新要求 Computer Use Accessibility 權限。

## 已採用的重建決策

- 每個動作連做四輪，才換下一組。
- 切換位置從所選階段完整 30 秒開始；保留執行／暫停狀態。
- 顯示的是課表剩餘時間，不是累計運動時數；跳轉會重算。
- 離開前景自動暫停；返回後手動繼續。這是重建策略，不是已確認原版行為。
- 無背景播放／鎖屏繼續保證。常亮成功請求也可能被系統釋放。

下一個工程重點見 docs/TODO.md；不要把無法控制的宿主限制當成已修復。

## 儲存庫交接更新（2026-11-06）

使用者後續明確要求推送至 https://github.com/housemeow/workout。先前「不部署 GitHub」限制已就程式碼推送更新；已依最新指示啟用 GitHub Pages。歷史對話與來源證據保留原文。

## GitHub Pages（2026-11-06）

網站入口：https://housemeow.github.io/workout/hiit.html

使用者已明確授權架設 GitHub Pages，取代先前不部署的限制。main 推送後，`.github/workflows/pages.yml` 先測試，再執行 `python3 build.py`，只發布 `public/`。根目錄會導向相對路徑 `./hiit.html`；專案網址包含 `/workout/`。請勿把 `/hiit.html` 誤寫成網域根路徑。
