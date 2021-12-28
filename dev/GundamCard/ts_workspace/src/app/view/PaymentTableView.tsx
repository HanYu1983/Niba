import React, { useContext, useMemo, HTMLAttributes } from "react";
import { AppContext } from "../context";

export const PaymentTableView = (props: {}) => {
  const appContext = useContext(AppContext);
  const render = useMemo(() => {
    if (appContext.viewModel.model.gameState.paymentTable.action == null) {
      return <></>;
    }
    return (
      <div>
        {JSON.stringify(appContext.viewModel.model.gameState.paymentTable)}
      </div>
    );
  }, [appContext.viewModel.model.gameState.paymentTable]);
  return <>{render}</>;
};
