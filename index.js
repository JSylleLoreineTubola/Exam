const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
const port = 6000;

// Set up default mongoose connection
const url = "mongodb+srv://admin:poblacion@cluster0.yfxtuhr.mongodb.net/test";
const client = new MongoClient(url);

app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);

const dbName = "PatientsDB";
let db;
client
  .connect()
  .then(async () => {
    db = client.db(dbName);
    console.log("Connected to Mongodb");
  })
  .catch((err) => {
    console.log(err);
    console.log("Unable to connect to Mongodb");
  });


app.get("/Patient",(req, res) => {
  console.log("request");
  res.status(200).send("Hospital Results");
})

app.get("/", (req, res) => {
  db.collection("Patient")
    .find({})
    .toArray()
    .then((records) => {
      return res.json(records);
    })
    .catch((err) => {
      console.log("err");
      return res.json({ msg: "There was an error processing your query" });
    });
});

//Create a patient

app.post("/", (req, res) => {
    console.log(req.body);
    const {Patient_Name,Gender,Date_of_Birth,Address,Contact_Number} = req.body;
    db.collection("Patient")
      .insertOne({Patient_Name,Gender,Date_of_Birth,Address,Contact_Number})
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  });

  //Create Prescriptions

  app.post("/Prescriptions", (req, res) => {
    console.log(req.body);
    const {Patient_Name,Gender,Date_of_Birth,Diagnosis,Consultation_Visit,Medication} = req.body;
    db.collection("Prescriptions")
      .insertOne({Patient_Name,Gender,Date_of_Birth,Diagnosis,Consultation_Visit,Medication})
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  }); 

  //Delete Patients

  app.delete("/Patient/:_id", (req, res) => {
    const id = req.params._id;
    db.collection("Patient")
      .deleteOne(
        {
          _id: ObjectId(id)
        })
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  });

  //Delete a prescription

  app.delete("/Prescriptions/:_id", (req, res) => {
    const id = req.params._id;
    db.collection("Prescriptions")
      .deleteOne(
        {
          _id: ObjectId(id)
        })
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  }); 

  //Add a medication to the prescription

  app.put("/Prescriptions/:_id", (req, res) => {
    const id = req.params._id;
    const {Patient_Name,Gender,Date_of_Birth,Diagnosis,Consultation_Visit} = req.body;
    db.collection("Prescriptions")
      .updateOne(
        {
          _id: ObjectId(id)
        },
        {
          $push: {
            Medication
          }
        }
      )
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  });

  //Remove a medication from a prescription

  app.put("/Prescriptions/:_id", (req, res) => {
    const id = req.params._id;
    const {Patient_Name,Gender,Date_of_Birth,Diagnosis,Consultation_Visit} = req.body;
    db.collection("Prescriptions")
      .updateOne(
        {
          _id: ObjectId(id)
        },
        {
          $pull: {
            Medication
          }
        }
      )
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  });

  //update patient
  app.put("/:_id", (req, res) => {
    const id = req.params._id;
    db.collection("Patient")
      .updateOne(
        {
          _id: ObjectId(id)
        },
        {
          $set:req.body
        }
      )
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  });


  app.delete("/:_id", (req, res) => {
    const id = req.params._id;
    db.collection("Patient")
      .deleteOne(
        {
          _id: ObjectId(id)
        })
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  }); 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});