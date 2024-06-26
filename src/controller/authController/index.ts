import { Request, Response } from "express";

import { Platform } from "../../interface/common";
import { googleRepositories } from "../../service/auth/google";
import { kakaoRepositories } from "../../service/auth/kakao";
import { userRepositories } from "../../service/user";
import {
  TokenPayload,
  issueRefreshToken,
  issueYVoteToken,
  verifyYVoteToken,
  veriyRefreshToken,
} from "../../tools/auth";
import { bearerParse } from "../../utils/common";
import { upsertUser } from "./auth.tools";

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    const admin = {
      email,
      name,
      platform: Platform.ADMIN,
    };

    const yVoteToken = issueYVoteToken(admin.email, Platform.ADMIN);
    const refreshToken = issueRefreshToken(admin.email, Platform.ADMIN);

    await upsertUser("admin", email, name, Platform.ADMIN);

    res.send({
      success: true,
      result: {
        access: yVoteToken,
        refresh: refreshToken,
        name: admin.email,
        email: admin.name,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(401).send({
      success: false,
      result: e,
    });
  }
};

export const kakaoLogin = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;

    if (!auth) {
      throw new Error("User token is not defined");
    }

    const properties = [
      "kakao_account.name",
      "kakao_account.email",
      "kakao_account.profile",
    ];

    const token = bearerParse(auth);
    console.log("=======================================================");
    console.log(token);
    console.log("=======================================================");

    const data = await kakaoRepositories.getUserInfoByToken(token, properties);

    const { id, name = "", email = "" } = data;
    console.log("try kakao login controller !!!!!!!!");

    console.log(`email  : ${email},  name : ${name}, id : ${id}`);

    if (id === undefined) throw new Error("kakao login id undefined");

    await upsertUser(id, email, name, Platform.KAKAO);

    const yVoteToken = issueYVoteToken(id, Platform.KAKAO);
    const refreshToken = issueRefreshToken(id, Platform.KAKAO);

    console.log("issue login token !!!!!!!!");
    console.log(`acceess : ${yVoteToken},  refresh : ${refreshToken}`);

    console.log("end logging kakao _______________________________________");

    res.send({
      success: true,
      result: {
        yVoteToken: yVoteToken,
        refresh: refreshToken,
        name,
        email,
      },
    });
  } catch (e) {
    console.log("kakao login error", e);

    res.status(401).send({
      success: false,
      result: e,
    });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;

    if (!auth) {
      throw new Error("User token is not defined");
    }

    const token = bearerParse(auth);

    const data = await googleRepositories.getUserInfoByToken(token);

    const { id, name = "", email = "" } = data;
    console.log("try google login controller !!!!!!!!");
    console.log(`id : ${id}, email  : ${email},  name : ${name}`);

    await upsertUser(id, email, name, Platform.GOOGLE);

    const yVoteToken = issueYVoteToken(id, Platform.GOOGLE);
    const refreshToken = issueRefreshToken(id, Platform.GOOGLE);

    console.log("issue login token !!!!!!!!");
    console.log(`acceess : ${yVoteToken},  refresh : ${refreshToken}`);

    console.log("end logging google _______________________________________");

    res.send({
      success: true,
      result: {
        yVoteToken: yVoteToken,
        refresh: refreshToken,
        name,
        email,
      },
    });
  } catch (e) {
    console.log("google login error", e);
    res.status(401).send({
      success: false,
      result: e,
    });
  }
};

export const appleLogin = async (req: Request, res: Response) => {
  try {
    const {
      id,
      email = "",
      name = "",
    }: { id: string; email?: string; name?: string } = req.body;

    if (!auth) {
      throw new Error("User token is not defined");
    }

    await upsertUser(id, email, name, Platform.APPLE);

    const yVoteToken = issueYVoteToken(id, Platform.APPLE);
    const refreshToken = issueRefreshToken(id, Platform.APPLE);

    console.log("issue login token !!!!!!!!");
    console.log(`acceess : ${yVoteToken},  refresh : ${refreshToken}`);

    console.log("end logging google _______________________________________");

    res.send({
      success: true,
      result: {
        yVoteToken: yVoteToken,
        refresh: refreshToken,
        name,
        email,
      },
    });
  } catch (e) {
    console.log("google login error", e);
    res.status(401).send({
      success: false,
      result: e,
    });
  }
};

export const withdrawal = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;

    console.log("withdrawl try!!");

    const token = bearerParse(auth!);
    const val = verifyYVoteToken(token) as {
      state: boolean;
      payload: TokenPayload;
    };

    const { state, payload } = val;

    if (!state) throw Error("invalidToken");

    const { id: userId } = payload;
    const response = await userRepositories.deleteUser(userId);
    res.send({
      success: true,
      result: {},
    });
  } catch (e) {
    res.status(401).send({
      success: false,
      result: {},
    });
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    const { access, refresh } = req.body;
    if (!access) {
      Error("User access token is not defined");
      return;
    }

    if (!refresh) {
      Error("User refresh token is not defined");
      return;
    }
    /**
     * add token to the blacklist (redis)
     */
    res.send({
      success: true,
      result: {},
    });
  } catch (e) {
    console.log("logout error", e);
    res.send({
      success: false,
      result: {
        error: e,
      },
    });
  }
};

export const tokenRefresh = (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      Error("User token is not defined");
      return;
    }

    const token = bearerParse(auth);
    const response = veriyRefreshToken(token as string);
    if (!response.state) {
      Error("Refresh Expired");
      return;
    }

    const { id, platform } = response.payload as {
      id: string;
      platform: Platform;
    };

    const accessToken = issueYVoteToken(id, platform);
    res.send({
      state: true,
      result: {
        access: accessToken,
      },
    });
  } catch (e) {
    res.status(401).send({
      state: false,
      result: e,
    });
  }
};

export const auth = (req: Request, res: Response, next: any) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      Error("TokenExpiredError");
      return;
    }

    const token = bearerParse(auth);
    const { state, payload } = verifyYVoteToken(token);

    if (!state) {
      throw new Error("JsonWebTokenError");
    }
    next();
  } catch (e: any) {
    if (e.message === "TokenExpiredError") {
      res.status(419).send({
        success: false,
        result: {
          message: "토큰이 만료되었습니다.",
        },
      });
    }
    // 토큰의 비밀키가 일치하지 않는 경우
    if (e.message === "JsonWebTokenError") {
      res.status(401).send({
        success: false,
        result: {
          message: "유효하지 않은 토큰입니다.",
        },
      });
    }

    res.status(401).send({
      success: false,
      result: e,
    });
  }
};
