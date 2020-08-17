
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

(app.gameplay.macros/defasync
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

(app.gameplay.macros/defasync
  attack (s/tuple ::app.gameplay.spec/gameplay ::app.gameplay.spec/error)
  {gameplayCtx ::app.gameplay.spec/gameplay
   player ::app.gameplay.spec/player
   card ::app.gameplay.spec/card}
  [gameplayCtx err]
  [(let [player-hand-id (keyword (str (:player-id player) "_hand"))
         player-hand (s/assert
                      ::app.gameplay.spec/card-stack
                      (-> gameplayCtx :card-stacks player-hand-id))
         gravyard (s/assert
                   ::app.gameplay.spec/card-stack
                   (-> gameplayCtx :card-stacks :gravyard))
         [player-hand, gravyard, err] (a/<! (move-card player-hand gravyard card))
         _ (when err (throw err))
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
     (let [card {:card-id :0 :card-proto-id :0 :card-state {}}
           card2 {:card-id :1 :card-proto-id :0 :card-state {}}
           [cs1 cs2 err] (a/<! (move-card {:cards [card] :player-id :0} {:cards [] :player-id :0} card2))
           _ (when err (throw err))
           _ (println cs1 cs2 err)

           [cs1 cs2 err] (a/<! (move-card {:cards [card] :player-id :0} {:cards [] :player-id :0} card))
           _ (when err (throw err))]
       nil)
     (catch js/Error err
       (js/console.log err)
       err))))
