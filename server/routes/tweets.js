"use strict";

const userHelper    = require("../lib/util/user-helper")
const express       = require('express');
const tweetsRoutes  = express.Router();

module.exports = function(DataHelpers) {

  tweetsRoutes.get("/", function(req, res) {
    try {
      DataHelpers.getTweets((err, tweets) => {
        if (err) {
          console.error("Error fetching tweets:", err);
          res.status(500).json({ error: err.message });
        } else {
          res.json(tweets);
        }
      });
    } catch (err) {
      console.error("Unhandled error:", err);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  });

  tweetsRoutes.post("/", function(req, res) {
    try {
      if (!req.body.text) {
        res.status(400).json({ error: 'invalid request: no data in POST body'});
        return;
      }

      const user = req.body.user ? req.body.user : userHelper.generateRandomUser();
      const tweet = {
        user: user,
        content: {
          text: req.body.text
        },
        created_at: Date.now()
      };

      DataHelpers.saveTweet(tweet, (err) => {
        if (err) {
          console.error("Error saving tweet:", err);
          res.status(500).json({ error: err.message });
        } else {
          res.status(201).send();
        }
      });
    } catch (err) {
      console.error("Unhandled error:", err);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  });

  return tweetsRoutes;

}
