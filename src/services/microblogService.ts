import MicroblogModel, { MicroPost } from "../models/microblogModel";

export async function createMicroPost(text: string, userId: string): Promise<MicroPost> {
  return MicroblogModel.create({ text, userId });
}

export async function listMicroPosts(params: { limit?: number; sinceId?: string } = {}) {
  return MicroblogModel.list(params);
}

export async function toggleMicroLike(postId: string, userId: string) {
  return MicroblogModel.toggleLike(postId, userId);
}

export async function countsForPost(postId: string) {
  return MicroblogModel.countsForPost(postId);
}
