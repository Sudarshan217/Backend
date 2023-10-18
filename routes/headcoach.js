const express = require('express');
const User = require("../models/user")
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECERT = 'Sudarshan@123'
const fetchuser = require('../middleware/fetchuser')

// ROUTE 1: Create a User using : POST "api/headcoach/createuser".No login required

router.post('/createuser', [
    // check the user-name, email, password is filled our requirements
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 })],
    async (req, res) => {
        let success = false;
        const result = validationResult(req);
        try {
            if (result.isEmpty()) {

                // check the user email is exists
                let user = await User.findOne({ email: req.body.email });
                if (user) {
                    success = false
                    return res.status(400).json({ success, errors: 'This email is already exits' })
                }

                // bcrypts
                const salt = await bcrypt.genSalt(10);
                const secPass = await bcrypt.hash(req.body.password, salt)

                // create a new user
                user = await User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: secPass
                })

                // User id token
                const data = {
                    user: {
                        id: user.id
                    }
                }
                const token = jwt.sign(data, JWT_SECERT);
                success = true;
                res.json({ success, token })
            }
        } catch (errors) {
            console.log(errors.message);
            res.status(500).send("Some error occured")
        }
    })

// ROUTE 2: Authenticate a User using: POST "api/headcoach/userlogin". Create user login required

router.post('/userlogin', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    // If there are error return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            let success = false
            return res.status(400).json({ success: success, errors: 'User is already exits' })
        }

        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            success = false
            return res.status(400).json({ success: success, errors: 'Wrong Password' })
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const token = jwt.sign(data, JWT_SECERT);
        let success = true
        res.json({ success: success, token: token })

    } catch (error) {
        console.log(errors.message);
        res.status(500).send("Some error occured")
    }
})

// ROUTE 3: Get user loggedin Details using: POST "/api/headcoach/getuser". login details required 
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        userid = req.user.id;
        const user = await User.findById(userid).select('-password')
        res.send(user)
    } catch (error) {
        console.log(error.message);
        res.status(400).send('Server Error')
    }
})

module.exports = router   