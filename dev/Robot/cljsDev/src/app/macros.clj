(ns app.macros)

(defmacro defwait [name [varCtx args] & body]
  `(defn ~name [~varCtx ~'args ~'inputCh ~'outputCh]
     (let [~'key (str (gensym ~(str name)))
           ~args ~'args]
       (a/go
         ;(println "[model][ask][question]" ~(str name) ~'args)
         (a/>! ~'outputCh [~(str name) [~'key ~'args]])
         (loop [~varCtx ~varCtx]
           (println "[model][ask][waitForAnswer]" ~'key)
           (when-let [[~'cmd ~'evt] (a/<! ~'inputCh)]
             (cond
               (= "ok" ~'cmd)
               (let [[~'resKey ~'resArgs] ~'evt
                     ~'isMatch (= ~'key ~'resKey)]
                 (if ~'isMatch
                   (do ;(println "[model][ask][answer]" ~'evt)
                     [~varCtx ~'resArgs])
                   (recur ~varCtx)))

               ~@body

               :else
               (recur ~varCtx))))))))

(defmacro defstate [name [varCtx args] & body]
  `(defn ~name [~varCtx ~'args ~'inputCh ~'outputCh]
     (let [~'key (str (gensym ~(str name)))
           ~args ~'args]
       (a/go
         (println "[model][state]" ~(str name) ~'args)
         (let [~varCtx ~(or (first body)
                            `(let [~'fsm (-> (gameplay/getFsm ~varCtx)
                                             (app.fsm/pushState (keyword ~(str name))))]
                               (gameplay/setFsm ~varCtx ~'fsm)))]
           (loop [~varCtx ~varCtx]
             (let [~varCtx ~(or (first (rest body))
                                varCtx)]
              (when-let [[~'cmd ~'args] (a/<! ~'inputCh)]
                (cond
                  ~@(rest (rest body))

                  :else
                  (recur ~varCtx))))))))))


(defmacro basicNotify [state & body]
  `(let [~'fsm (gameplay/getFsm ~'gameplayCtx)
         ~'state (or (app.fsm/load ~'fsm) ~state)]
     (a/<! (~'updateMap nil (gameplay/getLocalMap ~'gameplayCtx nil) ~'inputCh ~'outputCh))
     (a/<! (~'updateCursor nil (gameplay/getLocalCursor ~'gameplayCtx nil) ~'inputCh ~'outputCh))
     (a/<! (~'updateUnits nil (gameplay/getLocalUnits ~'gameplayCtx nil nil) ~'inputCh ~'outputCh))
     (a/<! (~'updateMoveRange nil (gameplay/getLocalMoveRange ~'gameplayCtx nil) ~'inputCh ~'outputCh))
      ~@body
     (gameplay/setFsm ~'gameplayCtx (app.fsm/save ~'fsm ~'state))))

(defmacro handleKeyDown [getter setter & body]
  `(let [~'keycode ~getter
         ~setter (get ~'actions ~'keycode)]
     (cond
       ~@body

       :else
       (recur ~'gameplayCtx))))

(defmacro fsmState [& body]
  `(let [~'fsm (gameplay/getFsm ~'gameplayCtx)
         ~'state (app.fsm/load ~'fsm)]
     ~@body))

(defmacro handleCursor [setter & body]
  `(let [temp# (->> (gameplay/getCursor ~'gameplayCtx)
                    (map + (~'action {:up [0 -1]
                                      :down [0 1]
                                      :left [-1 0]
                                      :right [1 0]}))
                    (gameplay/boundCursor ~'gameplayCtx))
         ~'gameplayCtx (gameplay/setCursor ~'gameplayCtx temp#)
         ~setter temp#]
     ~@body))

(defmacro handleCamera [setter & body]
  ; 加上~'修改namespace為local
  ; 使用#隨機命名變量
  `(let [temp# (->> (gameplay/getCamera ~'gameplayCtx)
                    (map + (~'action {:rup [0 -1]
                                      :rdown [0 1]
                                      :rleft [-1 0]
                                      :rright [1 0]}))
                    (gameplay/boundCamera ~'gameplayCtx))
         ~'gameplayCtx (gameplay/setCamera ~'gameplayCtx temp#)
         ~setter temp#]
     ~@body))
















(comment

  (defmacro handleL [& body]
    `(let [~'gameplayCtx (~'handleCursor ~'gameplayCtx (~'action {:up [0 -1]
                                                                  :down [0 1]
                                                                  :left [-1 0]
                                                                  :right [1 0]}))]
       ~@body))

  (defmacro handleR []
    '(recur (handleCamera gameplayCtx (action {:rup [0 -1]
                                               :rdown [0 1]
                                               :rleft [-1 0]
                                               :rright [1 0]}))))


  (defmacro handleKeyDown2 [& body]
    `(let [~'keycode ~'args
           ~'action (get ~'actions ~'keycode)
           ~'fsm (gameplay/getFsm ~'gameplayCtx)
           ~'state (app.fsm/load ~'fsm)]
       (cond
         ~@body

         :else
         (recur ~'gameplayCtx))))
  (defmacro answer [body]
    `(let [~'ans ~body]
       (a/>! ~'outputCh ["ok", [~'id ~'ans]])
       ~'ans))

  (defmacro defstate [name [varCtx args] & body]
    `(defn ~name [~varCtx ~'args ~'inputCh ~'outputCh]
       (let [~'key (str (gensym ~(str name)))
             ~args ~'args]
         (a/go
           (println "[model][ask][question]" ~(str name) ~'args)
           (a/>! ~'outputCh [~(str name) [~'key ~'args]])
           (loop [~varCtx ~varCtx]
             (println "[model][ask][waitForAnswer]" ~'key)
             (when-let [[~'cmd [~'resKey ~'resArgs :as ~'args] :as ~'evt] (a/<! ~'inputCh)]
               (cond
                 (= ["ok" ~'key] [~'cmd ~'resKey])
                 (do
                   (println "[model][ask][answer]" ~'evt)
                   [~varCtx ~'resArgs])

                 ~@body

                 :else
                 (recur ~varCtx))))))))

  (defmacro defstate2 [name notifyEnter & body]
    `(defn ~name [~'ctx ~'inputCh ~'outputCh]
       (a/go
         (a/>! ~'outputCh ~notifyEnter))
       (let [~'worker (a/chan)]
         (a/go-loop [~'ctx ~'ctx]
           (let [[~'cmd ~'args :as ~'evt] (a/<! ~'inputCh)]
             ~@body))
         ~'worker)))

  (defmacro handleCursor [ctx]
    `(let [~'cursor ~'args
           ~'camera (gameplay/getCamera ~ctx)
           ~'worldCursor (gameplay/local2world ~'camera ~'cursor)
           ~'units (gameplay/getUnits ~ctx ~'camera (aq/makeRectFromPoint ~'worldCursor [1 1]))
           ~'unitAtCursor (first (filter #(= ~'worldCursor (:position %))
                                         ~'units))
           ~ctx (gameplay/setCursor ~ctx ~'worldCursor)]
       (if ~'unitAtCursor
         (let [[~'mw ~'mh] gameplay/mapViewSize
               ~'shortestPathTree (map/findPath (:position ~'unitAtCursor)
                                                (fn [{:keys [~'totalCost]} ~'curr]
                                                  [(>= ~'totalCost 5) false])
                                                (fn [[~'x ~'y]]
                                                  [[~'x (min ~'mh (inc ~'y))]
                                                   [~'x (max 0 (dec ~'y))]
                                                   [(min ~'mw (inc ~'x)) ~'y]
                                                   [(max 0 (dec ~'x)) ~'y]])
                                                (constantly 1)
                                                (constantly 0))
               ~'moveRange (map first ~'shortestPathTree)
               ~ctx (update-in ~ctx [:temp :moveRange] (constantly ~'moveRange))]
           (a/>! ~'outputCh ["setMoveRange" (map #(gameplay/world2local (gameplay/getCamera ~ctx) %)
                                                 ~'moveRange)])
           (a/>! ~'outputCh ["setCursor" ~'cursor])
           (recur ~ctx))
         (let []
        ; (a/>! ~'outputCh ["setMoveRange" []])
           (a/>! ~'outputCh ["setCursor" ~'cursor])
           (recur ~ctx)))))


  (defmacro notifySetMap [ctx]
    `(a/>! ~'outputCh ["setMap" (gameplay/getLocalMap ~ctx nil)]))

  (defmacro notifySetCamera [ctx]
    `(a/>! ~'outputCh ["setCamera" (gameplay/getCamera ~ctx)]))

  (defmacro notifySetCursor [ctx]
    `(a/>! ~'outputCh ["setCursor" (gameplay/getLocalCursor ~ctx nil)])))


