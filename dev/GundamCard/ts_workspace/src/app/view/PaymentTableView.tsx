import React, { useContext, useMemo, HTMLAttributes } from "react";
import { AppContext } from "../context";

export const PaymentTableView = (props: {}) => {
  const appContext = useContext(AppContext);
  const render = useMemo(() => {
    const paymentTable = appContext.viewModel.model.gameState.paymentTable;
    if (paymentTable.action == null) {
      return <></>;
    }
    return (
      <div>
        <table style={{ border: "1px solid black" }}>
          <thead>
            <tr>
              <td>action</td>
              <td>is lock</td>
              <td>requires</td>
              <td>currents</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{paymentTable.action.id}</td>
              <td>{paymentTable.isLock ? "true" : "false"}</td>
              <td>
                {paymentTable.requires.map((payment) => {
                  switch (payment.id) {
                    case "ColorPayment":
                      return (
                        <div key={payment.id}>
                          {payment.id}:{payment.color}
                        </div>
                      );
                    case "GCountPayment":
                      return (
                        <div key={payment.id}>
                          {payment.id}:{payment.gCount}
                        </div>
                      );
                    case "TapPayment":
                      return (
                        <div key={payment.id}>
                          {payment.id}:{payment.cardID}
                        </div>
                      );
                    case "Target1Payment":
                      return (
                        <div key={payment.id}>
                          {payment.id}:{payment.cardID}
                        </div>
                      );
                    default:
                      return <div>{JSON.stringify(payment)}</div>;
                  }
                })}
              </td>
              <td>
                {paymentTable.currents.map((payment) => {
                  return <div key={payment.id}>{payment.id}</div>;
                })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }, [appContext.viewModel.model.gameState.paymentTable]);
  return <>{render}</>;
};
