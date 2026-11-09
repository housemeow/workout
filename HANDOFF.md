# 新session交接

目前以使用者2026-11-09提供並確認的 `HIIT_運動計時器_修復版.html` 為準。先讀README.md與docs/CURRENT_VERSION.md。

- 現行來源src/hiit.html；build.py直接複製成public/hiit.html。
- original/保留不修改的使用者檔案；本次發布與原檔逐位元組一致。
- archive/rebuilt/僅為歷史，不能當成現行網站來源或現行需求缺口。
- 原檔五組順序：蛙跳、分腿跳、波比跳、伏地挺身、深蹲。深蹲休息維持蹲姿。
- 原版背景繼續計時，返回前景重新嘗試常亮；不要沿用重建版自動暫停說明。
- 網站https://housemeow.github.io/workout/hiit.html，儲存庫housemeow/workout，main推送自動部署。
- Node測試6項通過；手機實機常亮未驗證。
- 使用者只允許開啟網頁，不讀取或操作個人瀏覽器UI，不重請Accessibility權限。
- CNAME尚未提供完整網域與DNS業者；預設保持目前網址。

下一步：使用者在手機驗證原版。如果要修改，保持原檔快照並清楚標示衍生版本，不混回重建版。
