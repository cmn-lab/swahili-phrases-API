const prisma = require("../prisma/index");
const { validationResult } = require("express-validator");
const hashids = require("../hashes/hashIds");

exports.createPhrase = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      let { text, author, tags } = req.body;
      const decodedId = hashids.decode(author);
      const decodedTagIds = [];

      // Extract phrase tags
      tags.forEach((tag) => {
        const decodedTagId = hashids.decode(tag);
        decodedTagIds.push(decodedTagId[0]);
      });

      // Create a new phrase
      const result = await prisma.phrase.create({
        data: {
          text: text,
          author: decodedId[0],
        },
      });

      if (result) {
        const { id } = result;
        const dataArray = [];

        // Populate data array with phrase-tag relationship
        decodedTagIds.forEach((tagId) => {
          const recordObject = {
            phraseId: id,
            tagId: tagId,
          };
          dataArray.push(recordObject);
        });

        // Create phrase-tag relationship records
        const phraseTagsResult = await prisma.phraseTags.createMany({
          data: dataArray,
          skipDuplicates: true,
        });

        if (phraseTagsResult) {
          res.status(200).json({
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
      const result = await prisma.phrase.findMany({
        select: {
          text: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          phrasetags: {
            select: {
              tag: {
                select: {
                  name: true
                }
              }
            }
          }
        },
      });

      if (result) {
        res.status(200).json({ result: result });
      } else {
        res.status(404).json({ errorCode: 1020, message: "No Phrase Found" });
      }
    } else {
      // Params Exist, Check Params type -> query OR text
      const key = Object.keys(params);

      if (key[0] === "query") {
        // Filter Phrases by tag(s)
        const { query } = params;
        const queryTags = JSON.parse(query);

        const result = await prisma.phrase.findMany({
          select: {
            text: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            phrasetags: {
              where: {
                OR: [
                  {
                    tag: {
                      name: {
                        equals: queryTags.tags[0],
                      }
                    }
                  },
                  {
                    tag: {
                      name: {
                        equals: queryTags.tags[1],
                      }
                    }
                  }
                ]
              },
              select: {
                tag: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        });
        result && res.status(200).json(result);
      } else {
        // Search for Phrases
        const { text } = params;
        /// An error occurs here ... FIX IT 
        const result = await prisma.phrase.findMany({
          where: {
            text: {
              search: text,
            },
          },
        });
        
        if(result){
          res.status(200).json(result);
        }else{
          res.status(404).json({ "errorCode": 1020, "message": "Phrase not found"});
        }
      }
    }
  } catch (error) {
    next(error);
  }
};
