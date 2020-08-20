(ns app.core
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :as a])
  (:require [app.gameplay.core]
            [app.gameplay.spec]
            [app.spec]))


(defn main []
  (let [_ (s/check-asserts true)
        input (a/chan)
        _ (set! js/Model (js-obj "StartGameplay"
                                 (fn []
                                   (a/go
                                     (a/>! input :StartGameplay)))))
        player (s/assert
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

        ctx (s/assert
             ::app.spec/app
             {:gameplay gameplayCtx})]
    
    (a/go
      (let [err (a/<! (a/go
                        (loop [ctx ctx]
                          (let [evt (a/<! input)
                                [ctx err] (s/assert
                                           (s/tuple ::app.spec/app ::app.spec/error)
                                           (cond
                                             (= evt :StartGameplay)
                                             (let [gameplayCtx (:gameplay ctx)
                                                   [gameplayCtx err] (a/<! (app.gameplay.core/start gameplayCtx))]
                                               [(assoc ctx :gameplay gameplayCtx) err])

                                             :else
                                             [ctx nil]))]
                            (if err
                              err
                              (recur ctx))))))]
        (js/console.log err)))))


(main)