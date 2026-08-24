const callbacks: Record<number, (response: any) => void> = {};

let callbackId = 0

function callWeb(type: string, data: any, callbackFunc?: (response: any) => void ): void {
    console.log("Calling web function via postMessage", { type, data });

    if (callbackFunc) {
        callbacks[callbackId] = callbackFunc
        data['callbackId'] = callbackId
        callbackId += 1
    }

    if (window['html']) {
        window['html'].callParent({ type: type, data: data });
    }
}

function solveCallback(callbackId: number, response: any): void {
    const callbackFunc = callbacks[callbackId]
    if (callbackFunc) {
        callbackFunc(response)
        delete callbacks[callbackId]
    }
}

function callWebPromise(type: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
        callWeb(type, data, (response: any) => {
            resolve(response)
        })
    })
}   

export { callWeb, callbacks, solveCallback, callWebPromise };