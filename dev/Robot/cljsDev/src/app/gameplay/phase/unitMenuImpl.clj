(ns app.gameplay.phase.unitMenuImpl)

(defmacro impl []
  '(defn unitMenu [gameplayCtx args inputCh outputCh]
     (app.module/gameplayOnUnitMenu app.module/*module
                                gameplayCtx
                                args
                                inputCh
                                outputCh)))