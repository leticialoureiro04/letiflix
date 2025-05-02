const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// MongoDB Connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const database = client.db('sample_mflix');
    return database;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

// Initialize database connection
let db;
(async () => {
  db = await connectDB();
})();

// Routes
app.get('/api/movies', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const movies = await db.collection('movies')
      .find({})
      .project({
        title: 1,
        poster: 1,
        year: 1,
        plot: 1
      })
      .sort({ year: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();
    
    const total = await db.collection('movies').countDocuments();
    
    res.json({
      movies,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/movies/:id', async (req, res) => {
  try {
    const movie = await db.collection('movies').findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    res.json(movie);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/movies/:id/comments', async (req, res) => {
  try {
    const comments = await db.collection('comments')
      .find({ movie_id: new ObjectId(req.params.id) })
      .sort({ date: -1 })
      .toArray();
    
    res.json(comments);
  } catch (error) {
    console.error('Error fetching movie comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CRUD Operations for Movies

// Create a new movie
app.post('/api/movies', async (req, res) => {
  try {
    const movieData = {
      ...req.body,
      year: parseInt(req.body.year) || 0,
      runtime: parseInt(req.body.runtime) || 0,
      released: req.body.released ? new Date(req.body.released) : new Date(),
      lastupdate: new Date()
    };

    const result = await db.collection('movies').insertOne(movieData);
    res.status(201).json({
      success: true,
      id: result.insertedId,
      message: 'Movie added successfully'
    });
  } catch (error) {
    console.error('Error adding movie:', error);
    res.status(500).json({ error: 'Error adding movie', details: error.message });
  }
});

app.post('/api/movies/:id/comments', async (req, res) => {
  try {
    const { name, text } = req.body;
    const movieId = req.params.id;

    if (!text || !name) {
      return res.status(400).json({ error: 'Name and text are required' });
    }

    const comment = {
      movie_id: new ObjectId(movieId),
      name,
      text,
      date: new Date()
    };

    const result = await db.collection('comments').insertOne(comment);
    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      commentId: result.insertedId
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Error adding comment', details: error.message });
  }
});

app.put('/api/comments/:commentId', async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required to update comment' });
    }

    const result = await db.collection('comments').updateOne(
      { _id: new ObjectId(commentId) },
      {
        $set: {
          text,
          date: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json({
      success: true,
      message: 'Comment updated successfully'
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Error updating comment', details: error.message });
  }
});

app.delete('/api/comments/:commentId', async (req, res) => {
  try {
    const commentId = req.params.commentId;

    const result = await db.collection('comments').deleteOne({
      _id: new ObjectId(commentId)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Error deleting comment', details: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});