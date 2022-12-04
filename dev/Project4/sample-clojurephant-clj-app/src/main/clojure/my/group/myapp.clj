(ns my.group.myapp
  (:gen-class))

(defn init [ns-name]
  (require (symbol ns-name))
  (let [bar (find-ns (symbol ns-name))]
    ((ns-resolve bar (symbol "hello-world")))))

(defn -main
  [& args]
  (init "tool.lib1"))