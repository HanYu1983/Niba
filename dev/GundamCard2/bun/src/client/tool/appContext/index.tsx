import { createContext, PropsWithChildren, useState, useEffect } from "react";
import { OnEvent } from "./eventCenter";
import { ViewModel, DEFAULT_VIEW_MODEL, OnViewModel } from "./OnViewModel";
import { logCategory } from "../../../tool/logger";


export type AppContextType = {
  viewModel: ViewModel;
};

export const AppContext = createContext<AppContextType>({
  viewModel: DEFAULT_VIEW_MODEL,
});

export const AppContextProvider = (props: PropsWithChildren<any>) => {
  const [viewModel, setViewModel] = useState<ViewModel>(DEFAULT_VIEW_MODEL);
  useEffect(() => {
    const subscriber = OnViewModel.subscribe((model) => {
      logCategory("AppContextProvider", "OnViewModel", model);
      setViewModel(model);
    });
    return () => {
      subscriber.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // todo websocket
    // return firebase.addListener((err, data) => {
      
    //   OnEvent.next({ id: "OnModelFromFirebase", model: data });
    // });
  }, []);

  return (
    <AppContext.Provider
      value={{
        viewModel,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
