(ns app2.data
  (:require ["./data.js" :as dataJson]))

(def data (js->clj dataJson :keywordize-keys true))