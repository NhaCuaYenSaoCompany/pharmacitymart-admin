export interface ResFolderTreeDto {
  id: number;

  name: string;

  parentId: number | null;

  ownerId: number;

  createdAt: Date;

  updatedAt: Date;

  children: ResFolderTreeDto[];
}
