const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'appeals';

let collection;

async function main() {
    try {
        await client.connect();
        console.log('Connected successfully to MongoDB server');
        const db = client.db(dbName);
        collection = db.collection('items');
        console.log('Database and collection setup complete');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

main();

app.get('/items', async (req, res) => {
    try {
        const items = await collection.find({}).toArray();
        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).send('Error fetching items');
    }
});

app.post('/add-appeal', async (req, res) => {
    try {
        const newAppeal = {
            title: req.body.title,
            status: 'new',
            status_cyr: 'Новое',
            content: req.body.content,
            answer: '',
            date: new Date()
        };

        const result = await collection.insertOne(newAppeal);
        res.status(201).send({ message: 'Appeal added successfully', id: result.insertedId });
    } catch (error) {
        console.error('Error adding appeal:', error);
        res.status(500).send({ message: 'Error adding appeal', error });
    }
});

app.post('/get-appeal', async (req, res) => {
  try {
      const { id } = req.body;

      if (!ObjectId.isValid(id)) {
          return res.status(400).send({ message: 'Invalid ID format' });
      }

      const objectId = new ObjectId(id);

      const document = await collection.findOne({ _id: objectId });

      if (!document) {
          return res.status(404).send({ message: 'Appeal not found' });
      }

      res.json(document);
  } catch (error) {
      console.error('Error fetching appeal:', error);
      res.status(500).send({ message: 'Error fetching appeal', error });
  }
});

app.post('/change-status', async (req, res) => {
  try {
    const id  = req.body.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    const objectId = new ObjectId(id);

    const result = await collection.findOneAndUpdate(
      { _id: objectId }, // Filter by the document's ID
      { $set: { status: req.body.stat, status_cyr: req.body.cyrstat, answer: req.body.answer } }, // Update fields
    );

    const document = await collection.findOne({ _id: objectId });
    res.json(document);

    if (!result.value) {
      return res.status(404).send({ message: 'Document not found' });
    }

  }
  catch (error){
    console.log(error);
  }
})

app.post('/cancel-all', async(req, res) => {
    const filter = { status: "work" };
    const update = {
      $set: {
        status: "cancel",
        status_cyr: "Отменено",
        answer: "Автоматически отменено поддержкой"
      }
    };

    const result = await collection.updateMany(filter, update);
    res.json(result);
})

app.post('/filter', async (req, res) => {
    const minDate = new Date(req.body.startDate);
    let maxDate = req.body.endDate ? new Date(req.body.endDate) : null;

    const query = {
        date: {
            $gte: minDate
        }
    };

    if (maxDate) {

        maxDate.setHours(23, 59, 59, 999);
        query.date.$lte = maxDate;
    } else {

        const startOfDay = new Date(minDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(minDate.setHours(23, 59, 59, 999));
        query.date = {
            $gte: startOfDay,
            $lte: endOfDay
        };
    }

    try {
        const result = await collection.find(query).toArray();
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});