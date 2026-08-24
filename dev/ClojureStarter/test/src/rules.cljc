(ns rules
  (:require [clara.rules :refer [defrule insert! fire-rules query defquery mk-session]]
            [clara.rules.accumulators :as acc]))

;; --- Fact 定義 (AI 可以擴充) ---
(defrecord Ad [id status area price])
(defrecord Temperature [area value])

;; --- 規則定義 (這是 AI 的主戰場) ---
(defrule cold-weather-sale
  "如果溫度低於 15 度，且有 pending 廣告，則將其啟動並降價"
  [Temperature (< value 15) (= ?a area)]
  [?ad <- Ad (= area ?a) (= status :pending)]
  =>
  (insert! (assoc ?ad :status :active :price (* (:price ?ad) 0.8))))

;; --- 查詢定義 (AI 用來拿結果) ---
(defquery get-all-ads [] [?ad <- Ad])

;; --- 持久化 Session (使用 defonce 保護數據) ---
(defonce engine-session (atom (mk-session 'rules)))