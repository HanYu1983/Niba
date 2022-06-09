(let [onCreate (rxjs.Subject.)
      _ (onCreate.subscribe (fn [& args]
                              (console.log args))
                            (fn [& args]
                              (console.log args))
                            (fn [& args]
                              (console.log args)))]  
  (set! window.eventCenter {:onCreate onCreate}))


(let []
  (set! window.pepole {:empty [0 0]
                       :walk (fn [p dir len]
                               p)}))

(defn createPeople []
  (let [people (window.people.empty)
        onWalk (fn []
                 (set! people (window.people.walk people))
                 (window.eventCenter.onUpdate.next [:people people]))
        _ (window.onHoldKey.subscribe onWalk)]
    (console.log "abc2"))
  (window.eventCenter.onCreate.next [:people]))


(let []
  (set! window.people {}))


(let [enemyA (createEnemy {:id "a" :pos [10 10]})
      enemyB (createEnemy {:id "b" :pos [20 20]})
      objA (createPlayer {:id "player" :pos [0 0]})
      _ (ai enemyA)
      _ (ai enemyB)
      _ (disableAI enemyA)
      _ (player objA)])




(defn createViewer []
  #_(let [peoples (rxjs.operators.)]))


(let []
  (createPeople)
  (console.log "abc"))