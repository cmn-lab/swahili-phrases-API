const prisma = require('../prisma/index');

// dummy data
const phrases = require("../models/phraseModel");

exports.getPhrases = async (req, res, next) => {
  // Get all phrases
  const phrases = await prisma.phrase.findMany();
  console.log(phrases);
  res.status(200).json({ phrases });
};

exports.createPhrase = async (req, res, next) => {
  // Create a new phrase
  try {
    let { phrase, author, tags, length } = req.body;

  } catch (error) {
    throw new Error(error)
  }  

}