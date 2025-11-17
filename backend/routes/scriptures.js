import { Router } from "express";
import db from "../db/connection.js";
import { Int32, ObjectId } from "mongodb";

const scriptures = Router();

scriptures.get("/:page/:limit", async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 50;

    const offset = (page - 1) * limit;

    let collections = await db.collection("scriptures");
    const totalItems = await collections.countDocuments();

    let results = await collections.find().skip(offset).limit(limit).toArray();

    const totalPages = Math.ceil(totalItems / limit);
    res.status(200).json({
      data: results,
      pagination: {
        page: page,
        limit: limit,
        total: totalItems,
        totalPages: totalPages,
      },
    });
  } catch (error) {
    res.status(500).send("Error getting scripture");
  }
});

scriptures.post("/filter/:page/:limit", async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 50;
    let document;
    const offset = (page - 1) * limit;

    console.log(req.body);
    let collections = await db.collection("scriptures");
    
    if (parseInt(req.body.chapters) > 0) {
      document = {
        book: { $regex: req.body.scripture },
        chapter: parseInt(req.body.chapters),
        verse: { $regex: req.body.verse },
        "prayer_point.category": { $regex: req.body.category },
      };
    } else {
      document = {
        book: { $regex: req.body.scripture},
        verse: { $regex: req.body.verse },
        "prayer_point.category": { $regex: req.body.category },
      };
    }
    
    let results = await collections
      .find(document)
      .skip(offset)
      .limit(limit)
      .toArray();

    const totalItems = results.length;
    const totalPages = Math.ceil(totalItems / limit);
    
    res.status(200).json({
      data: results,
      pagination: {
        page: page,
        limit: limit,
        total: totalItems,
        totalPages: totalPages,
      },
    });
  } catch (error) {
    res.status(500).send("Error getting scripture");
  }
});

scriptures.get("/prayerpoints/:id", async (req, res) => {
  let collections = await db.collection("scriptures");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collections.findOne(query);
  
  if (!result) res.status(404).send("Not found");
  else res.status(200).json(result.prayer_point);
});

scriptures.get("/:id", async (req, res) => {
  let collections = await db.collection("scriptures");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collections.findOne(query);
  
  if (!result) res.status(404).send("Not found");
  else res.status(200).json(result);
});

scriptures.post("/", async (req, res) => {
  try {
    let document = {
      book: req.body.book,
      chapter: req.body.chapter,
      verse: req.body.verse,
      scripture: req.body.scripture,
      prayer_point: req.body.prayer_point,
    };
    let collections = await db.collection("scriptures");
    let result = await collections.insertOne(document);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send("Error adding scripture");
  }
});

scriptures.patch("/:id", async (req, res) => {
  try {
    let query = { _id: new ObjectId(req.params.id) };
    let document = {
      $set: {
        book: req.body.book,
        chapter: req.body.chapter,
        scripture: req.body.scripture,
        verse: req.body.verse,
      },
    };
    let collections = await db.collection("scriptures");
    let result = await collections.updateOne(query, document);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send("Error updating scripture");
  }
});

scriptures.patch("/post-prayerpoint/:id", async (req, res) => {
  try {
    let query = { _id: new ObjectId(req.params.id) };
    let document = {
      $set: {
        prayer_point: req.body.prayer_point,
      },
    };
    let collections = await db.collection("scriptures");
    let result = await collections.updateOne(query, document);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send("Error updating scripture");
  }
});

scriptures.patch("/approve/:id", async (req, res) => {
  try {
    let query = { _id: new ObjectId(req.params.id) };
    let document = {
      $set: {
        prayer_point: req.body.prayer_point,
      },
    };
    let collections = await db.collection("scriptures");
    let result = await collections.updateOne(query, document);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send("Error approving scripture");
  }
});

scriptures.delete("/:id", async (req, res) => {
  try {
    let query = { _id: new ObjectId(req.params.id) };
    let collections = await db.collection("scriptures");
    let result = await collections.deleteOne(query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send("Error deleting scripture");
  }
});

export default scriptures;
