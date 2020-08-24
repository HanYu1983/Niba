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

        cards (s/assert
               ::app.gameplay.spec/card-stack
               (->> (range 60)
                    (map (comp keyword str))
                    (map (fn [id] 
                           {:card-id id :card-state :attack-card :card-face :down}))))

        gameplayCtx (s/assert
                     ::app.gameplay.spec/gameplay
                     {:card-stacks {:0-hand []
                                    :home cards
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