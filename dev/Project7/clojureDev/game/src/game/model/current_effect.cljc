(ns game.model.current-effect
  (:require [clojure.spec.alpha :as s]
            [game.model-spec.core]
            [game.define.effect]))

(defn set-current-effect
  "設定將要處理的效果
   1. 出牌和出指令等效果直接放入這裡, 不放入堆疊
   2. 堆疊中的效果要處理前先放入這裡"
  [ctx]
  (s/assert :game.model-spec.core/has-current-effect ctx)
  ctx)

(defn get-current-effect [ctx]
  (s/assert :game.model-spec.core/has-current-effect ctx)
  (::current-effect ctx))