(ns module.v1.core
  (:require [clojure.string]))

(defmacro defwait [name [varCtx args] & body]
  `(defn ~name [~varCtx ~'args ~'inputCh ~'outputCh]
     (let [~'key (str (gensym ~(str name)))
           ~args ~'args]
       (a/go
         (a/>! ~'outputCh [~(str name) [~'key ~'args]])
         (loop [~varCtx ~varCtx]
           (when-let [[~'cmd ~'evt] (a/<! ~'inputCh)]
             (cond
               (= "ok" ~'cmd)
               (let [[~'resKey ~'resArgs] ~'evt
                     ~'isMatch (= ~'key ~'resKey)]
                 (if ~'isMatch
                   (do
                     [~varCtx ~'resArgs])
                   (recur ~varCtx)))

               ~@body

               :else
               (recur ~varCtx))))))))


(defmacro defstate [name args {ctx :nameCtx init :initCtx initState :initState fsm :nameFsm state :nameState update :updateCtx} & body]
  `(defn ~name [~ctx ~args ~'inputCh ~'outputCh]
     (a/go
       (let [~ctx (let [~'fsm (-> (:fsm ~ctx)
                                  (tool.fsm/pushState (keyword ~(str name))))
                        ~ctx (assoc ~ctx :fsm ~'fsm)
                        ~ctx ~(or init ctx)]
                    ~ctx)
             [~ctx ~'ret] (loop [~ctx ~ctx]
                            (let [~'_fsm (:fsm ~ctx)
                                  ~'_state (or (tool.fsm/load ~'_fsm) ~initState)
                                  ~'_fsm (tool.fsm/save ~'_fsm ~'_state)
                                  ~ctx (assoc ~ctx :fsm ~'_fsm)
                                  ~fsm ~'_fsm
                                  ~state ~'_state
                                  ~ctx ~(or update ctx)]
                              ~@body))
             ~'_ (common/explainValid? (comp not nil?) ~ctx)
             ~ctx (assoc ~ctx :fsm (tool.fsm/popState (:fsm ~ctx)))]
         [~ctx ~'ret]))))