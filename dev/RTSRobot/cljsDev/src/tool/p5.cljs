(ns tool.p5
  (:require ["p5" :as p5])
  (:require [tool.keycode]))

(defn view [dom-id atom-gameplay input-signal listen-keys render-f]
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
                 (.next input-signal [:mouseMoved])))

         (set! (.-mouseDragged p)
               (fn []
                 (.next input-signal [:mouseDragged [(.-mouseX p) (.-mouseY p)]])))

         (set! (.-setup p)
               (let [_ 0]
                 (fn []
                   (.frameRate p 1)
                   (.createCanvas p 800 640))))

         (set! (.-draw p)
               (fn []
                 (.next input-signal [:tick])
                 (doseq [key (map #(tool.keycode/keycode %) listen-keys)
                         :when (.keyIsDown p key)]
                   (.next input-signal [:keyIsDown (tool.keycode/keycode key)]))

                 (.background p 0)
                 (.fill p 100)
                 (.stroke p 255)
                 (when-let [gameplay @atom-gameplay]
                   (render-f p gameplay)))))
       dom-id))