
(let [; js lib
      spec (get window "js.spec")
      assertGameContext (fn [ctx]
                          (spec.assert window.GameContext ctx))
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
      ; define
      defaultGameInfo {:players [{:id 0
                                  :name "vic"
                                  :money 100
                                  :army 0
                                  :strategy 0
                                  :people []
                                  :atGridId 0}]
                       :grids (repeat 100 {:id 0
                                           :landType 0
                                           :buildtype 0
                                           :height 0
                                           :attachs []})
                       :isPlayerTurn false
                       :currentPlayer {:id 0
                                       :name ""
                                       :money 0
                                       :army 0
                                       :strategy 0
                                       :people []
                                       :atGridId 0}
                       :isPlaying false
                       :events []
                       :actions []}
      ; vars
      context {:players []
               :grids []
               :currentPlayer 0}
      setContext! (fn [ctx]
                    (assertGameContext ctx)
                    (set! context ctx))
      ; binding
      nativeModule {:installPackage installPackage
                    :gameInfo (fn [] context)
                    :gameStart (fn [cb]
                                 (assertPackage)
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
                    :playerDice (fn [cb]
                                  (cb))}
      _ (set! window.getNativeModule (fn [] nativeModule))])