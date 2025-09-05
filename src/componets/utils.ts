export const getChatId = (uid1: string, uid2: string) => {
  return [uid1, uid2].sort().join("_"); // Tạo ID duy nhất không phân biệt thứ tự
};
