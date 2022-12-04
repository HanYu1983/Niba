(ns my.group.myapp
  (:gen-class))

(defn -main
  "I don't do a whole lot ... yet."
  [& args]
  (apply println "Hello," args))

(defn init [ns-name]
  (require (symbol ns-name))
  (let [bar (find-ns (symbol ns-name))]
    ((ns-resolve bar 'hello-world))))

(init "tool.lib1")