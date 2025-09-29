import { Router } from 'express';
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const scriptures = Router();

scriptures.get("/", async (req, res) => {
  try {
    let collections = await db.collection("scriptures");
    let results = await collections.find({}).toArray();
    res.status(200).json(results);
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
      img: req.body.img,
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