(ns game.model.flags-player-status-component
  (:require [tool.component.flags-component :refer [set-flags has-flag remove-flags]]))

(defn get-player-has-play-g-flag [player-id] [player-id :has-play-g])

(defn tests []
  (let [player-a :A
        ctx tool.component.flags-component/flags-component
        has-play-g-flag (get-player-has-play-g-flag player-a)
        ctx (-> ctx (set-flags #{has-play-g-flag}))
        _ (-> ctx (has-flag has-play-g-flag) (or (throw (ex-info "must has-play-g" {}))))
        ctx (-> ctx (remove-flags #{has-play-g-flag}))
        _ (-> ctx (has-flag has-play-g-flag) not (or (throw (ex-info "must no has-play-g" {}))))
        ;_ (println ctx)
        ]))