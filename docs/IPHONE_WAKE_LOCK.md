# iPhone ChatGPT 內螢幕常亮限制

## 已知現象與證據邊界

原對話使用者回報：HTML 預覽按開始無反應；改成內嵌互動內容後螢幕仍關閉。沒有 iOS／ChatGPT 版本、執行環境資訊、權限政策、錯誤紀錄或原始碼，因此根因未定。

不能沿用原助理「由此就能確定是 ChatGPT 限制」的結論。可能涉及預覽未執行 JavaScript、API 缺失、非安全環境、iframe 權限政策、系統釋放或程式錯誤；需逐一驗證。

## 網頁能做什麼

Screen Wake Lock 需要安全環境、文件保持可見並獲准。權限政策、瀏覽器與系統可拒絕或釋放請求；跨來源 iframe 需宿主允許。網頁不能自行提高宿主權限、修改 iPhone 自動鎖定設定，或保證鎖屏後 JavaScript／音訊繼續。

本版開始時嘗試請求，顯示支援／成功／拒絕／釋放狀態。暫停、完成、重置或隱藏時停止常亮。再次按繼續會重新請求。取得鎖不等於永久保持亮屏。

參考：[W3C Screen Wake Lock 規格草案](https://www.w3.org/TR/screen-wake-lock/)、[MDN Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API)。查閱日期 2026-11-06。

## ChatGPT 宿主

OpenAI 的 Plugins 文件說明元件在隔離 iframe 與 CSP 限制下執行；這能證明宿主限制存在，**不能證明舊對話互動畫布使用相同機制，也不能證明 iPhone ChatGPT 必然不支援常亮**。未取得此特定執行環境的官方支援保證。

參考：[OpenAI Security & Privacy](https://developers.openai.com/plugins/guides/security-privacy)。不應為了讓此單檔運作而假設已建立或部署 OpenAI Plugin。

## 不部署 GitHub 的使用者端處理

Apple 提供引導使用模式的獨立螢幕自動鎖定設定。使用者可到「設定 → 輔助使用 → 引導使用模式 → 螢幕自動鎖定」查看選項，若有「永不」可自行選擇；先設定並確認結束模式的方法，再於 ChatGPT 啟動，保留觸碰操作。實際選項及側邊按鈕操作依 iOS 版本而異，不保證所有裝置相同。

參考：[Apple：透過引導使用模式將 iPhone 鎖定在單一 App](https://support.apple.com/zh-tw/guide/iphone/iph7fad0d10/27/ios/27)。這是系統設定方案，不是本程式已修好常亮的證據。

## 實機驗證紀錄模板

- 機型、iOS、ChatGPT 版本：
- 開啟方式：檔案預覽／真正互動內容／其他
- 按開始是否倒數、語音及節奏是否正常：
- 常亮狀態完整文字：
- 平常自動鎖定時間、低耗電狀態：
- 超過自動鎖定時間後是否亮屏：
- 暫停後／完成後是否回復系統鎖定：
- 切背景再回來是否暫停、手動繼續是否成功：

由使用者操作與回報；本次沒有讀取或控制個人瀏覽器 UI。
