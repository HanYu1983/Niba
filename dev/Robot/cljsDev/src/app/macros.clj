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
                            `(let [~'fsm (-> (app.gameplay/getFsm ~varCtx)
                                             (app.fsm/pushState (keyword ~(str name))))]
                               (app.gameplay/setFsm ~varCtx ~'fsm)))]
           (loop [~varCtx ~varCtx]
             (let [~varCtx ~(or (first (rest body))
                                varCtx)
                   ~'fsm (app.gameplay/getFsm ~varCtx)
                   ~'state (app.fsm/load ~'fsm)]
              (when-let [[~'cmd ~'args] (a/<! ~'inputCh)]
                (cond
                  ~@(rest (rest body))

                  :else
                  (recur ~varCtx))))))))))


(defmacro basicNotify [state & body]
  `(let [~'fsm (app.gameplay/getFsm ~'gameplayCtx)
         ~'state (or (app.fsm/load ~'fsm) ~state)]
     (a/<! (~'updateMap nil (app.gameplay/getLocalMap ~'gameplayCtx nil) ~'inputCh ~'outputCh))
     (a/<! (~'updateCursor nil (app.gameplay/getLocalCursor ~'gameplayCtx nil) ~'inputCh ~'outputCh))
     (a/<! (~'updateUnits nil (app.gameplay/getLocalUnits ~'gameplayCtx nil nil) ~'inputCh ~'outputCh))
     (a/<! (~'updateMoveRange nil (app.gameplay/getLocalMoveRange ~'gameplayCtx nil) ~'inputCh ~'outputCh))
     (a/<! (~'updateAttackRange nil (app.gameplay/getLocalAttackRange ~'gameplayCtx nil) ~'inputCh ~'outputCh))
     ~@body
     (app.gameplay/setFsm ~'gameplayCtx (app.fsm/save ~'fsm ~'state))))

(defmacro handleKeyDown [getter setter & body]
  `(let [~'keycode ~getter
         ~setter (get ~'actions ~'keycode)]
     (cond
       ~@body

       :else
       (recur ~'gameplayCtx))))

(defmacro handleCursor [setter & body]
  `(let [temp# (->> (app.gameplay/getCursor ~'gameplayCtx)
                    (map + (~'action {:up [0 -1]
                                      :down [0 1]
                                      :left [-1 0]
                                      :right [1 0]}))
                    (app.gameplay/boundCursor ~'gameplayCtx))
         ~'gameplayCtx (app.gameplay/setCursor ~'gameplayCtx temp#)
         ~setter temp#]
     ~@body))

(defmacro handleCamera [setter & body]
  ; 加上~'修改namespace為local
  ; 使用#隨機命名變量
  `(let [temp# (->> (app.gameplay/getCamera ~'gameplayCtx)
                    (map + (~'action {:rup [0 -1]
                                      :rdown [0 1]
                                      :rleft [-1 0]
                                      :rright [1 0]}))
                    (app.gameplay/boundCamera ~'gameplayCtx))
         ~'gameplayCtx (app.gameplay/setCamera ~'gameplayCtx temp#)
         ~setter temp#]
     ~@body))