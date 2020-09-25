(ns app2.gameplay.view
  (:require [clojure.spec.alpha :as s]
            [clojure.core.matrix :as m]
            ["p5" :as p5])
  (:require [tool.math]
            [tool.keycode]))


(defn view [atom-gameplay input-signal]
  (p5. (fn [p]
         (js/console.log p)
         (set! (.-keyPressed p)
               (fn []
                 (.next input-signal [:keyPressed (tool.keycode/keycode (.-keyCode p))])))

         (set! (.-keyReleased p)
               (fn []
                 (.next input-signal [:keyReleased (tool.keycode/keycode (.-keyCode p))])))

         (set! (.-mousePressed p)
               (fn []
                 (.next input-signal [:mousePressed [(.-mouseX p) (.-mouseY p) (.-mouseButton p)]])))

         (set! (.-mouseReleased p)
               (fn []
                 (.next input-signal [:mouseReleased [(.-mouseX p) (.-mouseY p) (.-mouseButton p)]])))

         (set! (.-mouseMoved p)
               (fn []
                 #_(.next input-signal [:mouseMoved])))

         (set! (.-mouseDragged p)
               (fn []
                 #_(.next input-signal [:mouseDragged [(.-mouseX p) (.-mouseY p)]])))

         (set! (.-setup p)
               (let [_ 0]
                 (fn []
                   (.frameRate p 12)
                   (.createCanvas p 800 640))))

         (set! (.-draw p)
               (fn []
                 (.next input-signal [:tick])
                 (doseq [key (map #(tool.keycode/keycode %) ["up" "down" "left" "right"
                                                             "w" "d" "a" "s" "=" "-"
                                                             "space"])
                         :when (.keyIsDown p key)]
                   (.next input-signal [:keyIsDown (tool.keycode/keycode key)]))
                 
                 


                 (when-let [gameplay @atom-gameplay]
                   (let [{:keys [camera viewport]} (:state gameplay)]
                     (.background p 0)
                     (.fill p 100)
                     (.stroke p 255)
                     (doseq [[id entity] (get-in gameplay [:state :entities])]
                       (let [_ (when (every? #(% entity) [:position :radius])
                                 (let [[x y] (tool.math/get-camera-point viewport camera (:position entity))
                                       radius (* (:radius entity) (tool.math/world-camera-factor camera))
                                       _ (.ellipse p x y radius radius)
                                       _ (.text p id x y)
                                       _ (when (:robot-state entity)
                                           (let [{heading :heading} (:robot-state entity)
                                                 head (m/add [x y] (m/mul [50 50] heading))]
                                             (.line p x y (get head 0) (get head 1))))]))])))))))
       "canvas"))