(ns my.group.myapp
  (:gen-class))

(defn require2 [ns-name]
  (require (symbol ns-name))
  (let [bar (find-ns (symbol ns-name))]
    ((ns-resolve bar (symbol "hello-world")))))

(defn test-require
  [& args]
  (require2 "tool.lib1"))

(defn -main []
  (test-require))