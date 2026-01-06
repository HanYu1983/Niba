class Injector {
    updateListeners = [];
    mouseUpListeners = [];
    mouseDownListeners = [];
    mouseDBClickListeners = [];
    mouseMoveListeners = [];
    renderListeners= [];
    removeListener(listener) {
        this.updateListeners = this.updateListeners.filter((l) => l !== listener);
        this.mouseUpListeners = this.mouseUpListeners.filter((l) => l !== listener);
        this.mouseDownListeners = this.mouseDownListeners.filter(
            (l) => l !== listener
        );
        this.mouseDBClickListeners = this.mouseDBClickListeners.filter(
            (l) => l !== listener
        );
        this.mouseMoveListeners = this.mouseMoveListeners.filter(
            (l) => l !== listener
        );
        this.renderListeners = this.renderListeners.filter(
            (l) => l !== listener
        );
    }
    addUpdateListener(listener) {
        if (typeof listener === "function") {
            this.updateListeners.push(listener);
        } else {
            console.error("Listener must be a function");
        }
    }
    notifyUpdateListeners(delta) {
        this.updateListeners.forEach((listener) => {
            if (typeof listener === "function") {
                listener(delta);
            }
        });
    }
    addMouseUpListener(listener) {
        if (typeof listener === "function") {
            this.mouseUpListeners.push(listener);
        } else {
            console.error("Listener must be a function");
        }
    }
    notifyMouseUpListeners([x, y]) {
        this.mouseUpListeners.forEach((listener) => {
            if (typeof listener === "function") {
                listener([x, y]);
            }
        });
    }
    addMouseDownListener(listener) {
        if (typeof listener === "function") {
            this.mouseDownListeners.push(listener);
        } else {
            console.error("Listener must be a function");
        }
    }
    notifyMouseDownListeners([x, y]) {
        this.mouseDownListeners.forEach((listener) => {
            if (typeof listener === "function") {
                listener([x, y]);
            }
        });
    }
    addMouseDBClickListener(listener) {
        if (typeof listener === "function") {
            this.mouseDBClickListeners.push(listener);
        } else {
            console.error("Listener must be a function");
        }
    }
    notifyMouseDBClickListeners([x, y]) {
        this.mouseDBClickListeners.forEach((listener) => {
            if (typeof listener === "function") {
                listener([x, y]);
            }
        });
    }
    addMouseMoveListener(listener) {
        if (typeof listener === "function") {
            this.mouseMoveListeners.push(listener);
        } else {
            console.error("Listener must be a function");
        }
    }
    notifyMouseMoveListeners([x, y]) {
        this.mouseMoveListeners.forEach((listener) => {
            if (typeof listener === "function") {
                listener([x, y]);
            }
        });
    }
    addRenderListener(listener) {
        if (typeof listener === "function") {
            this.renderListeners.push(listener);
        } else {
            console.error("Listener must be a function");
        }
    }
    notifyRenderListeners(ctx) {
        this.renderListeners.forEach((listener) => {
            if (typeof listener === "function") {
                listener(ctx);
            }
        });
    }
}
