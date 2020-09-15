(ns tool.p5collide
  (:require ["./p5hook.js"]
            ["p5.collide2d"]))

(def p5 js/p5)

(js/console.log p5)

(defn collidePointCircle [a1 a2 a3 a4 a5]
  (.collidePointCircle p5 a1 a2 a3 a4 a5))

(defn test1 []
  (println (collidePointCircle 50 50 200 200 100)))