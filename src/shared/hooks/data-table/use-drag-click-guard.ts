import * as React from "react";

const DRAG_THRESHOLD_PX = 5;

export function useDragClickGuard() {
  const mouseDownPos = React.useRef<{ x: number; y: number } | null>(null);

  const onMouseDown = React.useCallback((e: React.MouseEvent) => {
    mouseDownPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const isDrag = React.useCallback((e: React.MouseEvent): boolean => {
    if (!mouseDownPos.current) return false;
    const dx = Math.abs(e.clientX - mouseDownPos.current.x);
    const dy = Math.abs(e.clientY - mouseDownPos.current.y);
    return dx > DRAG_THRESHOLD_PX || dy > DRAG_THRESHOLD_PX;
  }, []);

  return { onMouseDown, isDrag };
}
