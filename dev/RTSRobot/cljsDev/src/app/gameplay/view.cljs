(ns app.gameplay.view
  (:require ["p5" :as p5]))


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
                 ;(js/console.log @atom-gameplay)

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

                 (let [fixtures (.-fixtures @atom-gameplay)]
                   (.background p 0)
                   (.fill p 100)
                   (.stroke p 255)
                   (.forEach fixtures
                             (fn [fix]
                               (let [meta (.-meta fix)]
                                 (.stroke p 255)
                                 (condp = (.-type fix)
                                   "circle"
                                   (.ellipse p
                                             (-> fix .-point .-x)
                                             (-> fix .-point .-y)
                                             (-> fix .-radius)
                                             (-> fix .-radius))

                                   "polygon"
                                   (do
                                     (when meta
                                       (let [v (aget fix "vertices" 0)]
                                         (.text p (.-id meta) (.-x v) (.-y v)))
                                       (when (aget meta "selected?")
                                         (.stroke p 0 255 0)))

                                     (.beginShape p)
                                     (.forEach (-> fix .-vertices)
                                               (fn [v]
                                                 (.vertex p (.-x v) (.-y v))))
                                     (.endShape p (.-CLOSE p)))
                                   0)))))

                 (let [select-box (aget @atom-gameplay "select-box")]
                   (when select-box
                     (.fill p 0 255 0 100)
                     (.rect p
                            (aget select-box 0 0)
                            (aget select-box 0 1)
                            (- (aget select-box 1 0) (aget select-box 0 0))
                            (- (aget select-box 1 1) (aget select-box 0 1))))))))
       "canvas"))