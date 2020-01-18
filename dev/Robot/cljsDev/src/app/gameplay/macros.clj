(ns app.gameplay.macros)

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

(defmacro defbasic [name [varCtx args] [inputVar input] & body]
  `(defn ~name [~varCtx ~'args ~'inputCh ~'outputCh]
     (let [~'key (str (gensym ~(str name)))
           ~args ~'args]
       (a/go
         (println "[model][state]" ~(str name) ~'args)
         (let [~varCtx ~(or (first body)
                            `(let [~'fsm (-> (app.gameplay.model/getFsm ~varCtx)
                                             (tool.fsm/pushState (keyword ~(str name))))]
                               (app.gameplay.model/setFsm ~varCtx ~'fsm)))]
           (loop [~varCtx ~varCtx]
             (let [~varCtx ~(or (first (rest body))
                                varCtx)
                   ~'fsm (app.gameplay.model/getFsm ~varCtx)
                   ~'state (tool.fsm/load ~'fsm)]
               (let [~inputVar ~input]
                 (cond
                   ~@(rest (rest body))

                   :else
                   (recur ~varCtx))))))))))

(defmacro defstate [name args & body]
  `(defbasic ~name ~args ~'([cmd args] (a/<! inputCh)) ~@body))

(defmacro defstate2 [name [varCtx args] & body]
  `(defn ~name [~varCtx ~'args ~'inputCh ~'outputCh]
     (let [~'key (str (gensym ~(str name)))
           ~args ~'args]
       (a/go
         ; (println "[model][state]" ~(str name) ~'args)
         (let [~varCtx ~(or (first body)
                            `(let [~'fsm (-> (app.gameplay.model/getFsm ~varCtx)
                                             (tool.fsm/pushState (keyword ~(str name))))]
                               (app.gameplay.model/setFsm ~varCtx ~'fsm)))]
           (loop [~varCtx ~varCtx]
             (let [~varCtx ~(or (first (rest body))
                                varCtx)
                   ~'fsm (app.gameplay.model/getFsm ~varCtx)
                   ~'state (tool.fsm/load ~'fsm)]
              (let [[~'cmd ~'args] (a/<! ~'inputCh)]
                (cond
                  ~@(rest (rest body))

                  :else
                  (recur ~varCtx))))))))))



(defmacro basicNotify [state & body]
  `(let [~'fsm (app.gameplay.model/getFsm ~'gameplayCtx)
         ~'state (or (tool.fsm/load ~'fsm) ~state)
         ~'gameplayCtx (app.gameplay.model/setFsm ~'gameplayCtx (tool.fsm/save ~'fsm ~'state))]
     (a/<! (~'paint nil (app.gameplay.model/formatToDraw ~'gameplayCtx) ~'inputCh ~'outputCh))
     ~@body
     ~'gameplayCtx))

(defmacro handleKeyDown [getter setter & body]
  `(let [~'keycode ~getter
         ~setter (get ~'actions ~'keycode)]
     (cond
       ~@body

       :else
       (recur ~'gameplayCtx))))

(defmacro handleCursor [setter & body]
  `(let [temp# (->> (app.gameplay.model/getCursor ~'gameplayCtx)
                    (map + (~'action {:up [0 -1]
                                      :down [0 1]
                                      :left [-1 0]
                                      :right [1 0]}))
                    (app.gameplay.model/boundCursor ~'gameplayCtx))
         ~'gameplayCtx (app.gameplay.model/setCursor ~'gameplayCtx temp#)
         ~setter temp#]
     ~@body))

(defmacro handleCamera [setter & body]
  ; 加上~'修改namespace為local
  ; 使用#隨機命名變量
  `(let [temp# (->> (app.gameplay.model/getCamera ~'gameplayCtx)
                    (map + (~'action {:rup [0 -1]
                                      :rdown [0 1]
                                      :rleft [-1 0]
                                      :rright [1 0]}))
                    (app.gameplay.model/boundCamera ~'gameplayCtx))
         ~'gameplayCtx (app.gameplay.model/setCamera ~'gameplayCtx temp#)
         ~setter temp#]
     ~@body))

(defmacro handleMenuCursorUpDown [& body]
  `(let [~'state (update ~'state :menuCursor (fn [~'ctx]
                                               (tool.menuCursor/mapCursor1 ~'ctx
                                                                           (~'action {:up dec :down inc}))))
         ~'gameplayCtx (-> ~'gameplayCtx
                           (app.gameplay.model/setFsm (tool.fsm/save ~'fsm ~'state)))]
     ~@body))

(defmacro handleMenuCursorLeftRight [& body]
  `(let [~'state (update ~'state :menuCursor (fn [~'ctx]
                                               (tool.menuCursor/mapCursor2 ~'ctx
                                                                           (~'action {:left dec :right inc}))))
         ~'gameplayCtx (-> ~'gameplayCtx
                           (app.gameplay.model/setFsm (tool.fsm/save ~'fsm ~'state)))]
     ~@body))


(defmacro returnPop [v]
  `[(app.gameplay.model/setFsm ~'gameplayCtx (tool.fsm/popState ~'fsm)) ~v])

(comment (defmacro handleCursor1 [menuCnt setter & body]
  `(let [result# (-> (:cursor ~'state)
                     ((~'action {:up dec
                                 :down inc}))
                     (max 0)
                     (min (dec ~menuCnt)))
         ~'state (update ~'state :cursor (constantly result#))
         ~setter result#]
     ~@body)))