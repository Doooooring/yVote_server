import mongoose from "mongoose";
import { NewsInf } from "../../interface/news";
import { News } from "../../schemas/news";
const ObjectId = mongoose.Types.ObjectId;

class NewsRepositories {
  getNewsIds = async () => {
    return News.find({}).select("_id");
  };

  getNewsCount = async () => {
    return News.estimatedDocumentCount();
  };

  getOrderMaximum = async () => {
    const response = await News.find({})
      .sort({ order: -1 })
      .select("order")
      .limit(1);
    const maxOrderObj = response[0];
    return maxOrderObj?.order ?? 0;
  };

  getNewsInShortByIdList = async (
    page: number,
    news: string[],
    limit: number
  ) => {
    try {
      const newsIdList = news.map((id) => {
        const idParsed = id.replace(/"/g, "");
        try {
          const _id = new ObjectId(idParsed);
          return _id;
        } catch (e) {
          return "";
        }
      });
      return News.aggregate([
        {
          $match: {
            _id: { $in: newsIdList },
          },
        },
        {
          $addFields: {
            lastTimelineDate: {
              $let: {
                vars: {
                  lastTimelineEntry: {
                    $cond: {
                      if: { $gt: [{ $size: "$timeline" }, 0] },
                      then: { $arrayElemAt: ["$timeline", -1] },
                      else: null,
                    },
                  },
                },
                in: { $ifNull: ["$$lastTimelineEntry.date", "0000.00"] },
              },
            },
          },
        },
        {
          $sort: { state: -1, lastTimelineDate: -1 },
        },
        {
          $project: {
            order: 1,
            title: 1,
            summary: 1,
            keywords: 1,
            state: 1,
          },
        },
        {
          $skip: page,
        },
        {
          $limit: limit,
        },
      ]);
    } catch (e) {
      return [];
    }
  };
  // getNewsInShortByIdList = async (
  //   page: number,
  //   news: string[],
  //   limit: number
  // ) => {
  //   const newsIdList = news.map((id) => {
  //     const _id = new ObjectId(id);
  //     return _id;
  //   });
  //   return News.find({
  //     _id: { $in: newsIdList },
  //   })
  //     .sort({ state: -1, order: -1 })
  //     .select("order title summary keywords state")
  //     .skip(page)
  //     .limit(limit);
  // };

  getNewsInShort = async (page: number, limit: number) => {
    return News.aggregate([
      {
        $addFields: {
          lastTimelineDate: {
            $let: {
              vars: {
                lastTimelineEntry: {
                  $cond: {
                    if: { $gt: [{ $size: "$timeline" }, 0] },
                    then: { $arrayElemAt: ["$timeline", -1] },
                    else: null,
                  },
                },
              },
              in: { $ifNull: ["$$lastTimelineEntry.date", "0000.00"] },
            },
          },
        },
      },
      {
        $sort: { state: -1, lastTimelineDate: -1 },
      },
      {
        $project: {
          order: 1,
          title: 1,
          summary: 1,
          keywords: 1,
          state: 1,
        },
      },
      {
        $skip: page,
      },
      {
        $limit: limit,
      },
    ]);
  };

  getNewsByIdList = async (news: Array<string>) => {
    return News.find({ _id: { $in: news } });
  };

  getNewsById = async (id: string) => {
    const idParsed = id.replace(/"/g, "");
    const _id = new ObjectId(idParsed);
    return News.findOne({
      _id: _id,
    });
  };

  getNewsByIdAndState = async (news: string[], state: boolean) => {
    const newsIdList = news.map((id) => {
      const idParsed = id.replace(/"/g, "");
      const _id = new ObjectId(idParsed);
      return _id;
    });
    return News.find({
      _id: {
        $in: newsIdList,
      },
      state: state,
    });
  };

  getNewsByIdWithoutVote = async (id: string) => {
    const idParsed = id.replace(/"/g, "");
    const _id = new ObjectId(idParsed);
    return News.findOne({
      _id: _id,
    }).select("title summary timeline comments state opinions keywords");
  };

  getNewsTitle = async (title: string) => {
    const query =
      title === ""
        ? {}
        : {
            title: {
              $regex: `${title}`,
            },
          };
    return News.find(query).select("order title");
  };

  getCommentsById = async (id: string) => {
    const idParsed = id.replace(/"/g, "");
    const _id = new ObjectId(idParsed);
    return News.findOne({
      _id: _id,
    }).select("comments");
  };

  getKeywordsById = async (id: string) => {
    const idParsed = id.replace(/"/g, "");
    const _id = new ObjectId(idParsed);
    return News.findOne({ _id: _id }).select("keywords");
  };
  postNews = async (news: NewsInf) => {
    return News.create(news);
  };

  updateKeywordsById = async (id: string, keywords: string[]) => {
    const idParsed = id.replace(/"/g, "");
    const _id = new ObjectId(idParsed);
    return News.findOneAndUpdate({ _id: _id }, { keywords: keywords });
  };

  updateNewsById = async (id: string, news: NewsInf) => {
    const idParsed = id.replace(/"/g, "");
    const _id = new ObjectId(idParsed);
    return News.updateOne(
      {
        _id: _id,
      },
      news
    );
  };

  postVoteToNews = async (
    user: string,
    news: string,
    response: "left" | "right" | "none" | null
  ) => {};

  pushKeywordToNews = async (news: string[], keyword: string) => {
    const newsIdList = news.map((id) => {
      const idParsed = id.replace(/"/g, "");
      const _id = new ObjectId(idParsed);
      return _id;
    });
    return News.updateMany(
      { _id: { $in: newsIdList } },
      {
        $push: {
          keywords: keyword,
        },
      }
    );
  };

  pullKeywordFromNews = async (news: string[], keyword: string) => {
    const newsIdList = news.map((id) => {
      const idParsed = id.replace(/"/g, "");
      const _id = new ObjectId(idParsed);
      return _id;
    });
    return News.updateMany(
      { _id: { $in: newsIdList } },
      {
        $pull: {
          keywords: keyword,
        },
      }
    );
  };

  deleteNewsById = async (id: string) => {
    const _id = new ObjectId(id);
    return News.deleteOne({
      _id: _id,
    });
  };
}

export const newsRepositories = new NewsRepositories();
