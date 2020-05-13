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


(defmacro defstate [name args {ctx :nameCtx initState :initState init :initCtx} & body]
  `(defn ~name [~ctx ~args ~'inputCh ~'outputCh]
     (a/go
       (let [~ctx (let [~'fsm (-> (:fsm ~ctx)
                                  (tool.fsm/pushState (keyword ~(str name))))
                        ~'state (or (tool.fsm/load ~'fsm) ~initState)
                        ~'fsm (tool.fsm/save ~'fsm ~'state)
                        ~ctx (assoc ~ctx :fsm ~'fsm)
                        ~ctx ~(or init ctx)]
                    ~ctx)
             [~ctx ~'ret] (do
                            ~@body)
             ~'_ (common/explainValid? (comp not nil?) ~ctx)
             ~ctx (assoc ~ctx :fsm (tool.fsm/popState (:fsm ~ctx)))]
         [~ctx ~'ret]))))