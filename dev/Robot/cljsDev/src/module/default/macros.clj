(ns module.default.macros)

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
                            `(let [~'fsm (-> (module.default.data/getFsm ~varCtx)
                                             (tool.fsm/pushState (keyword ~(str name))))]
                               (module.default.data/setFsm ~varCtx ~'fsm)))]
           (loop [~varCtx ~varCtx]
             (let [~varCtx ~(or (first (rest body))
                                varCtx)
                   ~'fsm (module.default.data/getFsm ~varCtx)
                   ~'state (tool.fsm/load ~'fsm)]
               (let [~inputVar ~input]
                 (cond
                   ~@(rest (rest body))

                   :else
                   (recur ~varCtx))))))))))

(defmacro defstate [name args & body]
  `(defbasic ~name ~args ~'([cmd args] (a/<! inputCh)) ~@body))





(defmacro basicNotify [state & body]
  `(let [~'fsm (module.default.data/getFsm ~'gameplayCtx)
         ~'state (or (tool.fsm/load ~'fsm) ~state)
         ~'gameplayCtx (module.default.data/setFsm ~'gameplayCtx (tool.fsm/save ~'fsm ~'state))
         ~'gameplayCtx ~(if body
                          `(let [] ~@body)
                          'gameplayCtx)]
     (a/<! (module.default.phase.common/paint nil (module.default.tmp/gameplayFormatToDraw ~'app.module/*module ~'gameplayCtx) ~'inputCh ~'outputCh))
     ~'gameplayCtx))

(defmacro handleKeyDown [getter setter & body]
  `(let [~'keycode ~getter
         ~setter (get module.default.phase.common/actions ~'keycode)]
     (cond
       ~@body

       :else
       (recur ~'gameplayCtx))))

(defmacro handleCursor [setter & body]
  `(let [temp# (->> (module.default.data/getCursor ~'gameplayCtx)
                    (map + (~'action {:up [0 -1]
                                      :down [0 1]
                                      :left [-1 0]
                                      :right [1 0]}))
                    (module.default.data/boundCursor ~'gameplayCtx))
         ~'gameplayCtx (module.default.data/setCursor ~'gameplayCtx temp#)
         ~setter temp#]
     ~@body))

(defmacro handleCamera [setter & body]
  ; 加上~'修改namespace為local
  ; 使用#隨機命名變量
  `(let [temp# (->> (module.default.data/getCamera ~'gameplayCtx)
                    (map + (~'action {:rup [0 -1]
                                      :rdown [0 1]
                                      :rleft [-1 0]
                                      :rright [1 0]}))
                    (module.default.data/boundCamera ~'gameplayCtx))
         ~'gameplayCtx (module.default.data/setCamera ~'gameplayCtx temp#)
         ~setter temp#]
     ~@body))

(defmacro handleMenuCursorUpDown [& body]
  `(let [~'state (update ~'state :menuCursor (fn [~'ctx]
                                               (tool.menuCursor/mapCursor1 ~'ctx
                                                                           (~'action {:up dec :down inc}))))
         ~'fsm (tool.fsm/save ~'fsm ~'state)
         ~'gameplayCtx (-> ~'gameplayCtx
                           (module.default.data/setFsm ~'fsm))]
     ~@body))

(defmacro handleMenuCursorLeftRight [& body]
  `(let [~'state (update ~'state :menuCursor (fn [~'ctx]
                                               (tool.menuCursor/mapCursor2 ~'ctx nil
                                                                           (~'action {:left dec :right inc}))))
         ~'fsm (tool.fsm/save ~'fsm ~'state)
         ~'gameplayCtx (-> ~'gameplayCtx
                           (module.default.data/setFsm  ~'fsm))]
     ~@body))

(defmacro returnPopCtx []
  `(-> ~'gameplayCtx
       (module.default.data/updateTemp (fn [~'temp]
                                        (dissoc ~'temp :checkHitRate)))
       (module.default.data/setAttackRange [])
       (module.default.data/setFsm (tool.fsm/popState ~'fsm))))

(defmacro returnPop [v]
  `[(returnPopCtx)
    ~v])