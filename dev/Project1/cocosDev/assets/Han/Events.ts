const rxjs = (window as any).rxjs

const Events = {
    onEvent: new rxjs.ReplaySubject()
}

export default Events