export enum NodeType {
  FOLDER = "folder",
  FILE = "file",
}

export interface FolderNode {
  name: string;
}

export interface MediaNode {
  name: string;
  src: string
}