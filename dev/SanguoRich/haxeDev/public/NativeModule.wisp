
(let [spec (get window "js.spec")
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
      nativeModule {:gameInfo (fn []
                                (spec.assert window.GameInfo defaultGameInfo)
                                defaultGameInfo)
                    :gameStart (fn [cb]
                                 (cb))}
      _ (set! window.getNativeModule (fn [] nativeModule))])