(ns app.gameplay.phase.unitMenuImpl)

(defmacro impl []
  '(defn unitMenu [gameplayCtx args inputCh outputCh]
     (app.module/waitUnitOnMenu app.module/*module
                                gameplayCtx
                                args
                                inputCh
                                outputCh)))