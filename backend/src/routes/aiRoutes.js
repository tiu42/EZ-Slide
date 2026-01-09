import express from 'express';
import { protect } from '../middleware/auth.js';
import geminiService from '../services/geminiService.js';
import Presentation from '../models/Presentation.js';
import Slide from '../models/Slide.js';

const router = express.Router();

router.post('/generate-slides', protect, async (req, res) => {
    try {
        const { topic, slideCount = 5, tone = 'professional', language = 'vi' } = req.body;

        if (!topic) {
            return res.status(400).json({ error: 'Topic is required' });
        }

        // 1. Generate content using Gemini
        const slidePlans = await geminiService.generateSlidePlan({
            topic,
            slideCount,
            tone,
            language
        });

        // 2. Create Presentation
        const presentation = await Presentation.create({
            title: topic,
            userId: req.user._id,
            slideOrder: [] // Will update later
        });

        const createdSlidesIds = [];

        // 3. Create Slides
        for (let i = 0; i < slidePlans.length; i++) {
            const plan = slidePlans[i];
            const elements = [];

            // Title Element
            elements.push({
                id: `el-${Date.now()}-${i}-title`,
                type: 'text',
                x: 50,
                y: 50,
                width: 700,
                height: 60,
                text: plan.title,
                fontSize: 36,
                fontFamily: 'Arial',
                fill: '#000000',
                align: 'center',
                fontWeight: 'bold'
            });

            // Content Element (Paragraph)
            if (plan.content) {
                elements.push({
                    id: `el-${Date.now()}-${i}-content`,
                    type: 'text',
                    x: 100,
                    y: 150,
                    width: 600,
                    height: 200,
                    text: plan.content,
                    fontSize: 20,
                    fontFamily: 'Arial',
                    fill: '#333333',
                    align: 'left'
                });
            }

            // Bullets Element
            if (plan.bullets && plan.bullets.length > 0) {
                const bulletText = plan.bullets.map(b => `• ${b}`).join('\n');
                elements.push({
                    id: `el-${Date.now()}-${i}-bullets`,
                    type: 'text',
                    x: 100,
                    y: plan.content ? 350 : 150,
                    width: 600,
                    height: 200,
                    text: bulletText,
                    fontSize: 18,
                    fontFamily: 'Arial',
                    fill: '#333333',
                    align: 'left'
                });
            }

            const slide = await Slide.create({
                presentationId: presentation._id,
                elements: elements,
                background: '#ffffff'
            });

            createdSlidesIds.push(slide._id);
        }

        // 4. Update Presentation with slide order
        presentation.slideOrder = createdSlidesIds;
        await presentation.save();

        res.json({
            success: true,
            presentationId: presentation._id,
            slideCount: createdSlidesIds.length
        });

    } catch (error) {
        console.error('Error generating slides:', error);
        res.status(500).json({ error: 'Failed to generate slides', details: error.message });
    }
});

export default router;
