let view: 'PlayerA' | 'PlayerB' = 'PlayerA';

function setView(newView: 'PlayerA' | 'PlayerB') {
    view = newView;
}

function getView() {
    return view;
}

export { setView, getView };