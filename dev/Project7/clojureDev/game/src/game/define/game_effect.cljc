(ns game.define.game-effect
  (:require [clojure.spec.alpha :as s]
            [clojure.core.match :refer [match]]
            [game.define.card-text]
            [game.define.battle-point]))

(s/def ::id any?)
(s/def ::card-ids (s/coll-of any?))
(s/def ::card-text :game.define.card-text/value)
(s/def ::battle-point :game.define.battle-point/spec)
(s/def ::info (s/keys :opt-un [::from-card-id ::from-card-text-id]))
(s/def ::keyword-effect-1 (s/tuple #{"敵軍効果では破壊されずダメージを受けない"} ::card-ids ::info))
(s/def ::keyword-effect-2 (s/tuple #{"合計国力+Nしてプレイできる"} ::card-ids int? ::info))
(s/def ::keyword-effect-3 (s/tuple #{"add text"} ::card-ids :game.define.card-text/value))

(s/def ::spec (s/or :keyword-effect-1 ::keyword-effect-1
                    :keyword-effect-2 ::keyword-effect-2
                    :keyword-effect-3 ::keyword-effect-3))

(defn get-description [ctx]
  (s/assert ::spec ctx)
  (match ctx
    [keyword & args]
    (str keyword " for " args)))

