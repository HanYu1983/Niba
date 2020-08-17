
(ns app.gameplay.core
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :as a])
  (:require [app.data.spec]
            [app.gameplay.spec])
  (:require-macros [app.gameplay.macros :as m]))

(defn move-card2 [from to card]
  (s/assert ::app.gameplay.spec/card-stack from)
  (s/assert ::app.gameplay.spec/card-stack to)
  (s/assert ::app.gameplay.spec/card card)
  (a/go
    (s/assert
     (s/tuple ::app.gameplay.spec/card-stack ::app.gameplay.spec/card-stack ::app.gameplay.spec/error)
     (try
       (when (not (some #{card} (:cards from)))
         (js/Error. "card not found"))
       [(assoc from :cards (remove #{card} (:cards from)))
        (assoc to :cards (cons card (:cards to)))
        nil]
       (catch js/Error err
         [from to err])))))

(m/defasync
  move-card (s/tuple ::app.gameplay.spec/card-stack ::app.gameplay.spec/card-stack ::app.gameplay.spec/error)
  {from ::app.gameplay.spec/card-stack
   to ::app.gameplay.spec/card-stack
   card ::app.gameplay.spec/card}
  [from to err]
  (when (not (some #{card} (:cards from)))
    (js/Error. "card not found"))
  [(assoc from :cards (remove #{card} (:cards from)))
   (assoc to :cards (cons card (:cards to)))
   nil])

(m/defasync
  attack (s/tuple ::app.gameplay.spec/gameplay ::app.gameplay.spec/error)
  {gameplayCtx ::app.gameplay.spec/gameplay
   player ::app.gameplay.spec/player
   card ::app.gameplay.spec/card}
  [gameplayCtx err]
  [(let [player-hand-id (keyword (str (clj->js (:player-id player)) "-hand"))
         player-hand (s/assert
                      ::app.gameplay.spec/card-stack
                      (-> gameplayCtx :card-stacks player-hand-id))
         gravyard (s/assert
                   ::app.gameplay.spec/card-stack
                   (-> gameplayCtx :card-stacks :gravyard))
         _ (when (not (some #{card} player-hand))
             (throw (js/Error. (str card " not found in " player-hand))))
         player-hand (remove #{card} player-hand)
         card (assoc card :card-face :up)
         gravyard (cons card gravyard)
         gameplayCtx (update gameplayCtx :card-stacks (fn [cs]
                                                        (assoc cs
                                                               player-hand-id player-hand
                                                               :gravyard gravyard)))]
     gameplayCtx)
   nil])

(a/go
  (s/assert
   ::app.gameplay.spec/error
   (try
     (let [player (s/assert
                   ::app.gameplay.spec/player
                   {:player-id :0})
           
           card (s/assert
                 ::app.gameplay.spec/card
                 {:card-id :0 :card-proto-id :0 :card-state {} :card-face :down :player-id :0})
           
           gameplayCtx (s/assert
                        ::app.gameplay.spec/gameplay
                        {:card-stacks {:0-hand [card]
                                       :gravyard []}
                         :players {:0 player}})
           
           gameplayCtx (m/async-> gameplayCtx
                                  (attack player card))
           
           _ (println gameplayCtx)]
       nil)
     (catch js/Error err
       (js/console.log err)
       err))))