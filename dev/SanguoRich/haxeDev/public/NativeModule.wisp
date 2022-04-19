
(let [; js lib
      spec (get window "js.spec")
      assertGameContext (fn [ctx]
                          (spec.assert window.GameContext ctx))
      assertNegoPreview (fn [ctx]
                          (spec.assert window.NegoPreview ctx))
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
      ; vars
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
      ; binding
      nativeModule {:installPackage installPackage
                    :gameInfo (fn [] context)
                    :gameStart
                    (fn [cb]
                      (let [context (assoc context
                                           :players [{:id 0
                                                      :name "vic"
                                                      :money 100
                                                      :army 0
                                                      :strategy 0
                                                      :people (repeatedly 2 genPeople)
                                                      :atGridId 0}
                                                     {:id 1
                                                      :name "vic"
                                                      :money 100
                                                      :army 0
                                                      :strategy 0
                                                      :people (repeatedly 2 genPeople)
                                                      :atGridId 0}
                                                     {:id 2
                                                      :name "vic"
                                                      :money 100
                                                      :army 0
                                                      :strategy 0
                                                      :people (repeatedly 2 genPeople)
                                                      :atGridId 0}
                                                     {:id 3
                                                      :name "vic"
                                                      :money 100
                                                      :army 0
                                                      :strategy 0
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
                      (let [gridBefore (R.path ["grids" gridId] context)
                            gridAfter (assoc gridBefore
                                             :army (- gridBefore.army 1)
                                             :money (- gridBefore.money 1)
                                             :food (- gridBefore.food 1))
                            previewLeft {:player (R.path ["players" playerId] context)
                                         :fightPeople gridBefore.people
                                         :armyBefore gridBefore.army
                                         :armyAfter [gridAfter.army 2]
                                         :moneyBefore gridBefore.money
                                         :moneyAfter [gridAfter.money 2]
                                         :foodBefore gridBefore.food
                                         :foodAfter [gridAfter.food 2]
                                         :successRate 0.2}
                            _ (console.log previewLeft)
                            _ (assertNegoPreview previewLeft)
                            previewRight previewLeft
                            _ (console.log previewRight)
                            _ (assertNegoPreview previewRight)]
                        [previewLeft previewRight]))
                    :takeNegoOn
                    (fn [playerId gridId cb]
                      (let [context (assoc context
                                           :actions []
                                           :events [{:id "NEGOTIATE_RESULT"
                                                     :value {:success true
                                                             :armyBefore 200
                                                             :armyAfter 300
                                                             :moneyBefore 200
                                                             :moneyAfter 300
                                                             :foodBefore 100
                                                             :foodAfter 200}}])
                            _ (setContext! context)
                            _ (cb context)]))}
      _ (set! window.getNativeModule (fn [] nativeModule))])