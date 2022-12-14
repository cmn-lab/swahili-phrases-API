const prisma = require("../prisma/index");
const { validationResult } = require("express-validator");
const hashids = require("../hashes/hashIds");

exports.createPhrase = async (req, res, next) => {
  // Create a new phrase
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      let { text, author, tags } = req.body;
      const decodedId = hashids.decode(author);
      const decodedTagIds = [];
      tags.forEach((tag) => {
        const decodedTagId = hashids.decode(tag);
        decodedTagIds.push(decodedTagId[0]);
      });

      const result = await prisma.phrase.create({
        data: {
          text: text,
          author: decodedId[0],
        },
      });

      if (result) {
        const { id } = result;console.log(id)
        const dataArray = [];
        decodedTagIds.forEach((tagId) => {
          const recordObject = {
            phraseId: id,
            tagId: tagId,
          };
          dataArray.push(recordObject);
        });
        console.log(dataArray)
        console.log(typeof dataArray)
        const phraseTagsResult = await prisma.phraseTags.createMany({
          data: dataArray,
          skipDuplicates: true,
        });

        if (phraseTagsResult) {
          res
            .status(200)
            .json({
              message: "SUCCESS",
              resultCode: 0,
              result: phraseTagsResult,
            });
        } else {
          res.status(400).json({
            errorCode: 1008,
            message: "Unable to create phrase",
          });
        }
      } else {
        res
          .status(400)
          .json({ errorCode: 1008, message: "Unable to create phrase" });
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.getPhrases = async (req, res, next) => {
  try {
    // Check Filters in the request
    const params = req.query;

    if (Object.keys(params).length === 0 && params.constructor === Object) {
      // No params, GET all phrases

      const result = await prisma.phrase.findMany();
      if (result) {
        res.status(200).json({ result: result });
      } else {
        res.status(404).json({ errorCode: 1020, message: "No Phrase Found" });
      }
    } else {
      // Params Exist, Check Params type -> query OR text
      const key = Object.keys(params);
      if (key[0] === "query") {
        // Filter Phrases
      } else {
        // Search for Phrases
      }
    }
  } catch (error) {
    next(error);
  }
};
