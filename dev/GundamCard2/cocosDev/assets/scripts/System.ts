let view: 'PlayerA' | 'PlayerB' = 'PlayerA';

function setView(newView: 'PlayerA' | 'PlayerB') {
    view = newView;
    console.log("View set to:", view);
}

function getView() {
    return view;
}

export { setView, getView };