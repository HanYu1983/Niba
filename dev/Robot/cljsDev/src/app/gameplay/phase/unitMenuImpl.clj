(ns app.gameplay.phase.unitMenuImpl)

(defmacro impl []
  '(defn unitMenu [gameplayCtx args inputCh outputCh]
     (app.gameplay.module/waitUnitOnMenu app.gameplay.module/*module
                                         gameplayCtx
                                         args
                                         inputCh
                                         outputCh)))