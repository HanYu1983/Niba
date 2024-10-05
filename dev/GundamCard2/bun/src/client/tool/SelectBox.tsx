import { CSSProperties, useState, useEffect, useMemo } from "react"
import { fromEvent, map, Observable, switchMap, takeUntil } from "rxjs"

export type SelectBoxInfo = {
  isDragging: boolean,
  width: number,
  height: number,
  left: number,
  top: number
}

export function useSelectBoxInfo(): SelectBoxInfo {
  // write by cursor
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [endX, setEndX] = useState(0);
  const [endY, setEndY] = useState(0);

  useEffect(() => {
    const mouseDown$ = fromEvent(document, 'mousedown') as Observable<MouseEvent>;
    const mouseMove$ = fromEvent(document, 'mousemove') as Observable<MouseEvent>;;
    const mouseUp$ = fromEvent(document, 'mouseup');
    const selectRect$ = mouseDown$.pipe(
      map((event: MouseEvent) => ({ x: event.clientX, y: event.clientY })),
      switchMap(({ x: sx, y: sy }) => mouseMove$.pipe(
        map((event: MouseEvent) => ({ x: event.clientX, y: event.clientY })),
        map(({ x: ex, y: ey }) => ({ startX: sx, startY: sy, endX: ex, endY: ey })),
        takeUntil(mouseUp$),
      ))
    );
    const sub1 = mouseUp$.subscribe(() => {
      setIsDragging(false);
    })
    const sub2 = selectRect$.subscribe(({ startX, startY, endX, endY }) => {
      setIsDragging(true);
      setStartX(startX);
      setStartY(startY);
      setEndX(endX);
      setEndY(endY);
    })
    return () => {
      sub1.unsubscribe()
      sub2.unsubscribe()
    }
  }, []);

  return useMemo(() => ({
    isDragging,
    width: Math.abs(endX - startX),
    height: Math.abs(endY - startY),
    left: Math.min(startX, endX),
    top: Math.min(startY, endY),
  }), [isDragging, startX, startY, endX, endY]);
}

export function createSelectBoxStyle(selectBoxInfo: SelectBoxInfo): CSSProperties {
  return {
    position: 'absolute',
    border: '1px solid blue',
    width: selectBoxInfo.width,
    height: selectBoxInfo.height,
    left: selectBoxInfo.left,
    top: selectBoxInfo.top,
    display: selectBoxInfo.isDragging ? 'block' : 'none',
    opacity: 0.5,
    backgroundColor: "purple"
  }
}