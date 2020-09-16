(ns app2.gameplay.view
  (:require [clojure.spec.alpha :as s]
            [clojure.core.matrix :as m]
            ["p5" :as p5])
  (:require [tool.math]))


(defn view [atom-gameplay input-signal]
  (p5. (fn [p]
         (set! (.-keyPressed p)
               (fn []
                 ;(println ".-keyPressed" (.-key p) (.-keyCode p))
                 (.next input-signal [:keyPressed (.-keyCode p)])))

         (set! (.-keyReleased p)
               (fn []
                 ;(println ".-keyReleased" (.-key p) (.-keyCode p))
                 (.next input-signal [:keyReleased (.-keyCode p)])))

         (set! (.-mousePressed p)
               (fn []
                 ;(println ".-mousePressed" (.-mouseButton p))
                 (.next input-signal [:mousePressed [(.-mouseX p) (.-mouseY p) (.-mouseButton p)]])))

         (set! (.-mouseReleased p)
               (fn []
                 ;(println ".-mouseReleased" (.-mouseButton p))
                 (.next input-signal [:mouseReleased [(.-mouseX p) (.-mouseY p) (.-mouseButton p)]])))

         (set! (.-mouseMoved p)
               (fn []
                 ;(println ".-mouseMoved")
                 (.next input-signal [:mouseMoved])))

         (set! (.-mouseDragged p)
               (fn []
                 (.next input-signal [:mouseDragged [(.-mouseX p) (.-mouseY p)]])))

         (set! (.-setup p)
               (let [_ 0]
                 (fn []
                   (.createCanvas p 800 640))))

         (set! (.-draw p)
               (fn []
                 (doseq [key [(.-UP_ARROW p)
                              (.-LEFT_ARROW p)
                              (.-DOWN_ARROW p)
                              (.-RIGHT_ARROW p)
                              32
                              187
                              189
                              87 68 83 65]
                         :when (.keyIsDown p key)]
                   (.next input-signal [:keyIsDown key]))


                 (when-let [gameplay @atom-gameplay]
                   (let [{:keys [camera viewport]} (:state gameplay)]
                     (.background p 0)
                     (.fill p 100)
                     (.stroke p 255)
                     (doseq [[id entity] (get-in gameplay [:state :entities])]
                       (let [[x y] (tool.math/get-camera-point viewport camera (:position entity))
                             radius (* (:radius entity) (tool.math/world-camera-factor camera))]
                         (.ellipse p
                                   x
                                   y
                                   radius
                                   radius)
                         (.text p id x y))))))))
         "canvas"))