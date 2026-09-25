interface IUpdateListByIdRequestDTO {
  name: string;
}

interface IUpdateListByIdDTO {
  userId?: string;
  listId?: string;
  name: string;
}

export { IUpdateListByIdRequestDTO, IUpdateListByIdDTO };
