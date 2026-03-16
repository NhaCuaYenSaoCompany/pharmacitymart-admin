type ContextMenuType = "empty" | "folder" | "file";
export interface ContextMenuState<T = unknown> {
  x: number;
  y: number;
  type: ContextMenuType;
  data?: T;
}
