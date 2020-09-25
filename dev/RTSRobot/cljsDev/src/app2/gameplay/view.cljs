(ns app2.gameplay.view
  (:require [clojure.core.match :refer [match]]
            [clojure.spec.alpha :as s]
            [clojure.core.matrix :as m]
            ["p5" :as p5])
  (:require [tool.math]
            [tool.keycode]
            [tool.sat]
            [app2.gameplay.spec]))


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
                                                             "space" "," "."])
                         :when (.keyIsDown p key)]
                   (.next input-signal [:keyIsDown (tool.keycode/keycode key)]))

                 (.background p 0)
                 (.fill p 100)
                 (.stroke p 255)
                 #_(let [vers (cons [0 0] (tool.math/circle-to-polygon 30 0 3.14 3))
                         camera [0 0 0.8]
                         [x y] [100 100]
                         poly1 (tool.sat/polygon [x y] vers)
                         _ (.beginShape p)
                         _ (doseq [v vers]
                             (let [v (m/add v [x y])
                                   v (tool.math/get-camera-point [800 640] camera v)
                                   [vx vy] v]
                               (.vertex p vx vy)
                               (.text p (str vx "," vy) vx vy)))
                         _ (.endShape p (.-CLOSE p))

                         [mx my] [(.-mouseX p) (.-mouseY p)]
                         _ (.text p (str mx "," my) mx my)

                         radius 30
                         poly2 (tool.sat/circle [mx my] radius)
                         [collide?] (tool.sat/testObjectObject poly1 poly2)
                         _ (if collide?
                             (.fill p 255 0 0)
                             (.fill p 0 255 0))

                         [mx my] (tool.math/get-camera-point [800 640] camera [mx my])

                         _ (.ellipse p mx my
                                     (* (* 2 radius) (tool.math/world-camera-factor camera))
                                     (* (* 2 radius) (tool.math/world-camera-factor camera)))
                         _ (.text p (str mx "," my) mx my)])


                 (when-let [gameplay @atom-gameplay]
                   (let [{:keys [camera viewport]} (:state gameplay)]
                     (doseq [[id entity] (get-in gameplay [:state :entities])]
                       (let [_ (when (every? #(% entity) [:position :collision-state])
                                 (let [[x y] (tool.math/get-camera-point viewport camera (:position entity))
                                       shape (s/conform ::app2.gameplay.spec/shape (-> entity :collision-state :shape))
                                       _ (match shape
                                           [_ [:circle radius]]
                                           (let [radius (* 2 radius (tool.math/world-camera-factor camera))]
                                             (.ellipse p x y radius radius))

                                           [_ [:arc radius start end]]
                                           (let [radius (* 2 radius (tool.math/world-camera-factor camera))]
                                             (.arc p x y radius radius start end))

                                           [_ [:polygon verties]]
                                           (let [_ (.beginShape p)
                                                 _ (doseq [v verties]
                                                     (let [[vx vy] (->> v
                                                                        (m/add (:position entity))
                                                                        (tool.math/get-camera-point viewport camera))]
                                                       (.vertex p vx vy)))
                                                 _ (.endShape p (.-CLOSE p))]))

                                       _ (.text p id x y)
                                       _ (when (:robot-state entity)
                                           (let [{heading :heading} (:robot-state entity)
                                                 head (m/add [x y] (m/mul [50 50] heading))]
                                             (.line p x y (get head 0) (get head 1))))]))])))))))
       "canvas"))