
(let [; js lib
      spec (get window "js.spec")
      assertGameContext (fn [ctx]
                          (spec.assert window.GameContext ctx))
      assertNegoPreview (fn [ctx]
                          (spec.assert window.NegoPreview ctx))
      assertPreResultOnNego (fn [ctx]
                              (spec.assert window.PreResultOnNego ctx))
      ; haxe package
      haxePackage nil
      assertPackage (fn []
                      (when (nil? haxePackage)
                        (throw (Error. "you must call installPackage first"))))
      installPackage (fn [package]
                       (set! haxePackage package))
      gen100Grids (fn []
                    (assertPackage)
                    (haxePackage.gridGenerator.getGrids 100))
      genPeople (fn []
                  (assertPackage)
                  (haxePackage.peopleGenerator.generate))
      ; context
      context {:players []
               :grids []
               :currentPlayer 0
               :actions []
               :events []}
      setContext! (fn [ctx]
                    (console.log ctx)
                    (assertGameContext ctx)
                    (set! context ctx))
      _ (setContext! context)
      ; helper
      doNego (fn [ctx p1 p2]
               ctx)
      ; binding
      nativeModule {:installPackage installPackage
                    :gameInfo (fn [] context)
                    :gameStart
                    (fn [cb]
                      (let [context (assoc context
                                           :players [{:id 0
                                                      :name "vic"
                                                      :money 100
                                                      :army 100
                                                      :food 100
                                                      :strategy 100
                                                      :people (repeatedly 2 genPeople)
                                                      :atGridId 0}
                                                     {:id 1
                                                      :name "vic"
                                                      :money 100
                                                      :army 100
                                                      :food 100
                                                      :strategy 100
                                                      :people (repeatedly 2 genPeople)
                                                      :atGridId 0}
                                                     {:id 2
                                                      :name "vic"
                                                      :money 100
                                                      :army 100
                                                      :food 100
                                                      :strategy 100
                                                      :people (repeatedly 2 genPeople)
                                                      :atGridId 0}
                                                     {:id 3
                                                      :name "vic"
                                                      :money 100
                                                      :army 100
                                                      :food 100
                                                      :strategy 100
                                                      :people (repeatedly 2 genPeople)
                                                      :atGridId 0}]
                                           :grids (gen100Grids))
                            _ (setContext! context)
                            _ (cb)]))
                    :playerDice
                    (fn [cb]
                      (let [currentPlayer context.currentPlayer
                            atGridId (R.path ["players" currentPlayer "atGridId"] context)
                            moveStep (inc (mod (Math.floor (* (Math.random) 10)) 6))
                            nextGridId (mod (+ atGridId moveStep) 100)
                            nextGrid (R.path ["grids" nextGridId] context)
                            context (R.modifyPath ["players" currentPlayer]
                                                  (fn [player]
                                                    (assoc player :atGridId nextGridId))
                                                  context)
                            context (assoc context
                                           :actions [{:id "MOVE"
                                                      :value {:playerId currentPlayer
                                                              :fromGridId atGridId
                                                              :toGridId nextGridId}
                                                      :gameInfo (assoc context :actions [])}]
                                           :events [{:id "WALK_STOP"
                                                     :value {:grid nextGrid
                                                             :commands []}}])
                            _ (setContext! context)
                            _ (cb)]))
                    :playerEnd
                    (fn [cb]
                      (let [context (R.modify "currentPlayer"
                                              #(mod (inc %) 4)
                                              context)
                            context (R.modify "grids"
                                              (fn [grids]
                                                (map (fn [grid]
                                                       (let [{:strs [money moneyGrow food foodGrow army armyGrow]} grid]
                                                         (assoc grid
                                                                :money (+ money (* money moneyGrow))
                                                                :food (+ food (* food foodGrow))
                                                                :army (+ army (* army armyGrow)))))
                                                     grids))
                                              context)
                            context (assoc context
                                           :actions []
                                           :events [])
                            _ (setContext! context)
                            _ (cb)]))
                    :getTakeNegoPreview
                    (fn [playerId gridId]
                      (let [grid (R.path ["grids" gridId] context)
                            player (R.path ["players" playerId] context)
                            preview {:p1ValidPeople player.people
                                     :p2ValidPeople grid.people}
                            _ (console.log preview)
                            _ (assertNegoPreview preview)]
                        preview))
                    :getPreResultOfNego
                    (fn [playerId gridId p1 p2]
                      (let [_ (console.log playerId gridId p1 p2)
                            view {}
                            _ (assertPreResultOnNego view)]
                        view))
                    :takeNegoOn
                    (fn [playerId gridId p1SelectId p2SelectId cb]
                      (let [context (assoc context
                                           :actions []
                                           :events [{:id "NEGOTIATE_RESULT"
                                                     :value {:success true
                                                             :people People
                                                             :energyBefore 100
                                                             :energyAfter 100
                                                             :armyBefore 200
                                                             :armyAfter 300
                                                             :moneyBefore 200
                                                             :moneyAfter 300
                                                             :foodBefore 100
                                                             :foodAfter 200}}])
                            _ (setContext! context)
                            _ (cb context)]))}
      _ (set! window.getNativeModule (fn [] nativeModule))])