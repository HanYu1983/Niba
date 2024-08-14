(ns game.component.flags-player-status-component
  (:require [tool.component.flags-component :as flags-component]))

(defn get-player-has-play-g-flag [player-id] [player-id :has-play-g])

(defn tests []
  (let [player-a :A
        ctx flags-component/flags-component
        has-play-g-flag (get-player-has-play-g-flag player-a)
        ctx (-> ctx (flags-component/set-flags #{has-play-g-flag}))
        _ (-> ctx (flags-component/has-flag has-play-g-flag) (or (throw (ex-info "must has-play-g" {}))))
        ctx (-> ctx (flags-component/remove-flags #{has-play-g-flag}))
        _ (-> ctx (flags-component/has-flag has-play-g-flag) not (or (throw (ex-info "must no has-play-g" {}))))
        _ (println ctx)]))