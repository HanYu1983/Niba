(ns game.component.current-effect
  (:require [clojure.spec.alpha :as s]
            [game.define.effect]))

(s/def ::current-effect :game.define.effect/value)
(s/def ::spec (s/keys :req-un [::current-effect]))

(defn set-current-effect
  "設定將要處理的效果
   1. 出牌和出指令等效果直接放入這裡, 不放入堆疊
   2. 堆疊中的效果要處理前先放入這裡"
  [ctx]
  (s/assert ::spec ctx)
  ctx)

(defn get-current-effect [ctx]
  (s/assert ::spec ctx)
  (::current-effect ctx))