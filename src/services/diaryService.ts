import { DiaryModel } from "../models/diaryModel";

export const createDiaryLogic = (title: string, content: string, userId: string) => {
  return DiaryModel.create({ title, content, userId });
};

export const getDiaryLogic = (id: string) => {
  return DiaryModel.findById(id);
};

export const getUserDiariesLogic = (userId: string) => {
  return DiaryModel.findAllByUser(userId);
};

export const updateDiaryLogic = (id: string, data: Partial<{ title: string; content: string }>) => {
  return DiaryModel.update(id, data);
};

export const deleteDiaryLogic = (id: string) => {
  return DiaryModel.delete(id);
};
