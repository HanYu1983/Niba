# Fluentd 測試環境

這個專案用於測試 Fluentd 監控檔案新增內容並輸出到 console。

## 使用方式

1. 啟動 Fluentd 服務：
```bash
docker-compose up -d
```

2. 查看 Fluentd 輸出：
```bash
docker-compose logs -f fluentd
```

3. 新增內容到測試檔案：
```bash
echo "新的日誌內容 $(date)" >> /var/log/app/test.log
```

4. 停止服務：
```bash
docker-compose down
```

## 配置說明

- `fluent.conf`: Fluentd 配置文件
  - 使用 `tail` 插件監控 `/var/log/app/test.log` 檔案
  - 使用 `stdout` 輸出到 console
  
- `logs/test.log`: 被監控的測試日誌檔案

## 注意事項

- 確保 `logs` 目錄有適當的權限
- Fluentd 會從檔案末尾開始讀取新內容
- 使用 `pos_file` 記錄讀取位置，避免重複讀取


## output
    fluentd -c /fluentd/etc/fluent.conf
    2026-01-05 04:48:02 +0000 [info]: init supervisor logger path=nil rotate_age=nil rotate_size=nil
    2026-01-05 04:48:02 +0000 [info]: parsing config file is succeeded path="/fluentd/etc/fluent.conf"
    2026-01-05 04:48:02 +0000 [info]: gem 'fluentd' version '1.17.1'
    2026-01-05 04:48:02 +0000 [info]: using configuration file: <ROOT>
      <source>
        @type tail
        path "/var/log/app/test.log"
        pos_file "/var/log/app/test.log.pos"
        tag "test.log"
        format none
        read_from_head false
        <parse>
          @type none
          unmatched_lines 
        </parse>
      </source>
      <match test.log>
        @type stdout
      </match>
    </ROOT>
    2026-01-05 04:48:02 +0000 [info]: starting fluentd-1.17.1 pid=7 ruby="3.2.5"
    2026-01-05 04:48:02 +0000 [info]: spawn command to main:  cmdline=["/usr/local/bin/ruby", "-Eascii-8bit:ascii-8bit", "/usr/local/bundle/bin/fluentd", "-c", "/fluentd/etc/fluent.conf", "--plugin", "/fluentd/plugins", "--under-supervisor"]
    2026-01-05 04:48:02 +0000 [info]: #0 init worker0 logger path=nil rotate_age=nil rotate_size=nil
    2026-01-05 04:48:02 +0000 [info]: adding match pattern="test.log" type="stdout"
    2026-01-05 04:48:02 +0000 [info]: adding source type="tail"
    2026-01-05 04:48:02 +0000 [info]: #0 starting fluentd worker pid=16 ppid=7 worker=0
    2026-01-05 04:48:02 +0000 [info]: #0 following tail of /var/log/app/test.log
    2026-01-05 04:48:02 +0000 [info]: #0 fluentd worker is now running worker=0
    2026-01-05 04:50:25.397874954 +0000 test.log: {"message":"新的測試內容 Mon Jan  5 04:50:25 UTC 2026"}
    2026-01-05 04:51:46.215522618 +0000 test.log: {"message":"新的日誌內容2 Mon Jan  5 04:51:46 UTC 2026"}