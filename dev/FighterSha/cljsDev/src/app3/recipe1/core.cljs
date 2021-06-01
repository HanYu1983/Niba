(ns app3.recipe1.core
  (:require [clojure.set :as cset]))

(defn expand [the-vector distance length]
  (let [end (count the-vector)
        start (- end distance)
        pattern (subvec the-vector start end)]
    (into [] (take length (cycle pattern)))))

(defn un-LZ77 [bytes]
  (loop [result []
         remaining bytes]
    (if (seq remaining)
      (let [[current & the-rest] remaining]
        (if-not (vector? current)
          (recur (conj result current) the-rest)
          (recur (into result (expand result (current 0) (current 1))) the-rest)))
      result)))

(defn all-subvecs-from-beginning [v]
  (set (map #(subvec v 0 %) (range 1 (inc (count v))))))

(defn all-subvecs [v]
  (loop [result #{}
         remaining v]
    (if (seq remaining)
      (recur (into result (all-subvecs-from-beginning remaining)) (into [] (rest remaining)))
      result)))

(defn longest-match-w-beginning [left-array right-array]
  (let [all-left-chunks (all-subvecs left-array)
        all-right-chunks-from-beginning (all-subvecs-from-beginning right-array)
        all-matches (cset/intersection all-right-chunks-from-beginning all-left-chunks)]
    (->> all-matches
         (sort-by count >)
         first)))

(defn pos-of-subvec [sv v]
  {:pre [(<= (count sv) (count v))]}
  (loop [cursor 0]
    (if (or (empty? v)
            ;;=> if on of the vectors is empty
            (empty? sv)
            (= cursor (count v)))
            ;; or the cursor ended-up exiting v
      nil
      ;; we return nil
      (if (= (subvec v cursor
                     ;;-> if we found that the v sub-vector
                     (+ (count sv)
                        ;; beginning with cursor up to sv count
                        cursor)) sv)
        ;; is equal to sv 
        cursor
        ;; we return cursor, this is where the match is.
        (recur (inc cursor))
        ;;=> we recur incrementing the cursor
        ))))

(defn LZ77-STEP [window look-ahead]
  (let [longest (longest-match-w-beginning window look-ahead)]
    ;;=> we find the longest match,
    (if-let [pos-subv-w (pos-of-subvec longest window)]
      ;;=> if there is a match we find its position in window.
      (let [distance (- (count window) pos-subv-w)
            ;;=> the distance, 
            pos-subv-l (pos-of-subvec longest look-ahead)
            ;;=> the position of the match in look-ahead
            the-char (first (subvec look-ahead (+ pos-subv-l (count longest))))]
        ;;=> the first element occuring after the match
        {:distance distance :length (count longest) :char the-char})
      ;;=> and we return information about match
      {:distance 0 :length 0 :char (first look-ahead)})))

(defn LZ77 [bytes-array window-size]
  (->> (loop [result []
              cursor 0
              window []
              look-ahead bytes-array]
         (println cursor window look-ahead)
         ;;=> we begin with position 0; and everything as look-ahead.
         (if (empty? look-ahead)
           result
           ;;=> end of recursion, i emit result.
           (let [this-step-output (LZ77-STEP window look-ahead)
                 distance (:distance this-step-output)
                 length (:length this-step-output)
                 literal (:char this-step-output)
                 ;;=> we grab inforamtion about this step output
                 raw-new-cursor (+ cursor length 1)
                 new-cursor (min raw-new-cursor (count bytes-array))
                 ;;=> we compute the new-cursor, that is, where to go in the next
                 ;; step which is capped by count of bytes-array
                 new-window (subvec bytes-array (max 0 (inc (- new-cursor window-size))) new-cursor)
                 ;;=> new window is window-size elements back from new cursor.
                 new-look-ahead (subvec bytes-array new-cursor)]
             ;;=> new look-ahead is evrything from new cursor on.
             (recur (conj result [distance length] literal) new-cursor new-window new-look-ahead))))
             ;; and we recur with the new elements.
       (filter (partial not= [0 0]))
       ;;=> we eliminate the entries related to non-matches
       (filter (comp not nil?))
       ;;=> and any nils
       (into [])))
;;=> and make a vector out of the output.


(println (all-subvecs (into [] "abcabc")))
(println (all-subvecs-from-beginning (into [] "11bc")))
(println (longest-match-w-beginning (into [] "abcabc") (into [] "11bc")))
(println (pos-of-subvec (into [] "bc") (into [] "abc")))
(println (LZ77-STEP (into [] "abcabc") (into [] "bcd")))
(println (un-LZ77 ["a" "b" "c" "f" [4 3] "d"]))

(println "====")
(println (LZ77 (into [] "abcfabcdabcd") 6))
(println "====")
(println (un-LZ77 (LZ77 (into [] "abcfabcdabcd") 6)))
