import { Platform } from "../../interface/common";
import { userRepositories } from "../../service/user";

export const upsertUser = async (
  id: string,
  email: string,
  name: string,
  platform: Platform
) => {
  try {
    const user = await userRepositories.getUserInfoById(id);

    if (!user) {
      const response = await userRepositories.postUser(
        id,
        email,
        name,
        platform
      );
    }
    return true;
  } catch (e) {
    return e;
  }
};

export const issueRefreshToken = () => {};
