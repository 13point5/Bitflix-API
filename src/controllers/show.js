const express = require('express')
const Show = require('../models/show')

const router = express.Router()

// Add a new show
router.post('/new', async (req, res) => {
    try {
        const show = new Show(req.body)
        await show.save()
        res.status(201).send(show)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Get all shows
router.get('/all', async (req, res) => {
    try {
        const shows = await Show.find({})
        res.send(shows)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Get show by id
router.get('/:id', async (req, res) => {
    try {
        const show = await Show.findById(req.params.id)

        if (!show) {
            return res.status(404).send({'error': 'Show not found'})
        }

        res.send(show)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Update a show
router.patch('/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowed = ['season', 'episode']
    const isValid = updates.every((update) => {
        return allowed.includes(update)
    })

    if (!isValid) {
        return res.status(400).send({'error': 'Invalid update methods'})
    }

    try {
        const show = await Show.findById(req.params.id)
        updates.forEach((update) => {
            show[update] = req.body[update]
        })
        await show.save()
        // const show = await Show.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        
        if (!show) {
            return res.status(404).send({'error': 'Show not found'})
        }

        res.send(show)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Delete show by id
router.delete('/:id', async (req, res) => {
    try {
        const show = await Show.findByIdAndDelete(req.params.id)

        if (!show) {
            return res.status(404).send({'error': 'Show not found'})
        }
        
        res.send(show)
    } catch (error) {
        res.status(400).json(error)
    }
})

module.exports = router