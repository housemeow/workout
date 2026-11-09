# 架構


> 2026-11-09 最新確認：運動順序為蛙跳 → 交互蹲跳 → 波比跳 → 伏地挺身 → 深蹲。第五組每輪後30秒繼續蹲著（靜態深蹲）。已更新畫面、語音及測試；下文歷史上的名稱／順序缺口已由使用者本次確認補齊，原程式碼仍未完整取回。

無框架、無後端、無第三方執行期依賴。

`src/core.js → src/app.js → DOM / SpeechSynthesis / AudioContext / WakeLock`

build.py 將 body.html、style.css、core.js、app.js 合為 HIIT_20min_rebuilt.html。來源是唯一編輯入口。

## 計時模型

Timer 儲存 elapsed（已累計毫秒）、anchor（本次開始的 performance.now 值）、running。執行時以 elapsed + now - anchor 計算；100ms interval 僅更新畫面，不以回呼次數累加秒數，減少前景排程延遲造成的漂移。

每階段 30000ms。segment=floor(elapsed/30000)，exercise=floor(segment/8)，round=floor(segment/2)%4，phase=segment%2。到 1200000ms 完成。顯示秒數採 ceil，暫停保存毫秒精度。

狀態：未開始 → 執行 → 暫停 → 執行 → 完成；重置回未開始。seek 改課表位置但不改 running；完成後可 seek 再開始。

## 瀏覽器功能

- 語音：每次提示先 cancel，避免舊提示排隊；zh-TW，速率 1.05。關閉語音／暫停／重置取消。
- 音訊：使用者按開始時建立／resume AudioContext；振盪器與增益包絡合成打擊節奏。128 BPM 為目標；100ms 排程造成節奏抖動，非音樂級精準。停止後短音最多殘留約 0.1 秒。
- 常亮：能力與安全環境檢查，獨立非阻塞請求；以 epoch 避免暫停後才收到的授權留下鎖。監聽 release 顯示真實狀態，不無限強制重試。
- 背景：隱藏時暫停、取消語音、釋放常亮。返回需點繼續，重新啟用音訊與常亮。
- 動作：names 陣列；深蹲位於 index=4，其休息特例也綁 index=4。恢復原順序時必須同步調整，後續宜改穩定 ID。
- 安全輸出：名稱以 textContent 寫入，不插入 HTML。無儲存與網路呼叫。

測試用 Node VM 與模擬 DOM 驗證事件流程；未使用或操作個人瀏覽器。

## Pages 部署

build.py 同時產生 public/hiit.html 與導向它的 public/index.html。GitHub Actions 在 main 推送時測試、建置，再上傳 public/ 為 Pages 產物；來源文件與對話證據不包含於網站產物。public/ 為忽略的建置輸出。
