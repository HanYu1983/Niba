# container
    create_container.bat
    enter_container.bat

# lein
## create project
    lein new game

## run project
    lein run

## run test
    lein test
    
## run repl
    lein repl
    (use 'game.core :reload)
    (macroexpand-1 '(code))

# edn
## run project
    clj -X game.core/-main


# cljs

https://clojurescript.org/guides/quick-start

## compile (docker -p 9000:9000)

    cd frontend
    clj -M --main cljs.main --repl-opts "{:launch-browser false}" --compile frontend.core --repl

## compile to node

    cd frontend
    clj -M -m cljs.main --target node --output-to main.js -c frontend.core