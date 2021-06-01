(ns app3.recipe2.core
  (:require ["p5" :as p5]))


;; maybe do a version without the yield stuff first, and explain why we did then with odd/even yield after...
(defn pascal-row-step
  [yield pascal-row]
  {:pre [(not= pascal-row [0])]}
  (let [cnt-elts (count pascal-row)
        half-row (subvec pascal-row 0 (inc (double (/ cnt-elts 2))))
        padded-half-row (into [0] half-row)
        half-step (vec  (map (comp (partial apply yield)
                                   vec)
                             (partition 2 1 padded-half-row)))
        other-half-step (vec  (if (even? cnt-elts)
                                ;; If even, I reverse without the central element
                                (-> half-step
                                    butlast
                                    reverse)
                                (-> half-step
                                    reverse)))]
    (into half-step other-half-step)))


(defn pascal-rows
  [yield row-number]
  (loop [nb 0
         result []
         latest-result [1]]
    (if (<= nb row-number)
      (recur (inc nb)
             (conj result latest-result)
             (pascal-row-step yield latest-result))
      result)))


(defn even-odd-yield
  [n1 n2]
  (mod (+ n1 n2) 2))

(def sum-yield +)

(def classic-pascal-triangles (partial pascal-rows sum-yield))

(def gr-triangles (partial pascal-rows even-odd-yield))

(def model (atom nil))

(defn draw [size]
  (let [plot-rows (gr-triangles size)
        plots (for [x (range 0 size)
                    y (range 0 (inc x))
                    ;=> 所有像素(x,y), y到x代表只畫一半的三角型區域
                    :when (= 1 (get
                                (get plot-rows x)
                                y))]
                [x y])]
    (println plot-rows)
    (println (classic-pascal-triangles size))
    (reset! model {:size size :plots plots})))

(defn sketch [^js p]
  (set! (.-setup p)
        (fn []
          (.createCanvas p 300 300)))
  (set! (.-draw p)
        (fn []
          (.background p 0)
          (let [{:keys [size plots]} @model
                zoom 10]
            (when size
              (.fill p ((.-color p) "white"))
              (.strokeWeight p 0)
              (.rect p 0 0 (* zoom size) (* zoom size)))
            (when plots
              (.stroke p ((.-color p) "red"))
              (.strokeWeight p 6)
              (doseq [[x y] (filter (comp not nil?)  plots)]
                (.point p (* zoom x) (* zoom y))))))))

(p5. sketch "canvas")
(draw 15)