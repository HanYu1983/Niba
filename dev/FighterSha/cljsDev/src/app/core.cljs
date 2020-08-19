(ns app.core
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :as a])
  (:require [app.gameplay.core]
            [app.gameplay.spec]))

(s/check-asserts true)

(defn startGameplay []
  (a/go
    (let [player (s/assert
                  ::app.gameplay.spec/player
                  {:player-id :0})

          card (s/assert
                ::app.gameplay.spec/card
                {:card-id :abc :card-proto-id :0 :card-state {} :card-face :down :player-id :0})

          gameplayCtx (s/assert
                       ::app.gameplay.spec/gameplay
                       {:card-stacks {:0-hand [card]
                                      :gravyard []}
                        :players {:0 player}})
          [gameplayCtx err] (a/<! (app.gameplay.core/start gameplayCtx))
          _ (println gameplayCtx err)
          _ (when err (js/console.error err))
          _ (println "end")]
      gameplayCtx)))

(set! js/Model (js-obj "StartGameplay"
                       (fn []
                         (a/go
                           (a/<! (startGameplay))))))