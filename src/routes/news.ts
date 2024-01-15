import express, { Request, Response } from "express";
import {
  addNewsData,
  getNewsById,
  getNewsByIdWithVote,
  getNewsByKeyword,
  getNewsComment,
  getNewsIds,
  getNewsPreviewList,
  setKeywordsById,
  updateKeywordsById,
  updateNewsData,
} from "../controller/newsController";
import { News } from "../schemas/news";

const app = express();
const router = express.Router();

router.route("/test").get(async (req: Request, res: Response) => {
  const response = await News.findOne({
    "journals.press": "조선",
  }).select("journals.press");
  res.send(response);
});

router.route("/id").get(getNewsIds);

router
  .route("/keyword")
  .get(getNewsByKeyword)
  .post(setKeywordsById)
  .patch(updateKeywordsById);

// 기사 상세 (deprecate)
router.route("/detail").get(getNewsByIdWithVote).patch();

// 기사 등록
router.route("/").get().post(addNewsData).patch(updateNewsData);

// 기사 목록
router.route("/preview").get(getNewsPreviewList);

// 기사 상세
router.route("/:id").get(getNewsById);

// 기사 comment
router.route("/:id/comment").get(getNewsComment);

export const newsRoute = router;
