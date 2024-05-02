const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Hotel = require('./models/hotels');

const app = express();
const port = 8080;
const mongoURI = 'mongodb://localhost/hotels';

app.use(cors());
app.use(express.json());

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.error('Error connecting to MongoDB:', err);
})
app.post('/hotels', async (req, res) => {
    try {
        const { name, location, rating } = req.body;
        const newHotel = new Hotel({
            name,
            location,
            rating
        });

        const savedHotel = await newHotel.save();
        res.status(201).json(savedHotel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.get('/hotels', async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.json(hotels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/hotels/:id', async (req, res) => {
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedHotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        res.json(updatedHotel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/hotels/:id', async (req, res) => {
    try {
        const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);
        if (!deletedHotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        res.json({ message: 'Hotel deleted successfully' });
    } catch (err) {
        console.error('Error deleting hotel:', err); 
        res.status(500).json({ message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});