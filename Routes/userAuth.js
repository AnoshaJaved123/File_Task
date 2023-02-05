const express = require('express')
const router = express.Router();
const User = require('../Model/User')
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs')
var jwt = require("jsonwebtoken");

// const { name, email, password,role } = req.body;

//Route 1: Create user 
router.post('/createuser',
    [
        body("name", "Enter a valid Email").isLength({ min: 3 }),
        body("email", "Enter a valid Email").isEmail(),
        body("password", "Enter a valid password").isLength({ min: 5 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                console.log(user);
                return res
                    .status(400)
                    .json({ error: 'email id already exists ' });
            }

            const salt = await bcrypt.genSaltSync(10);
            const secpass = await bcrypt.hash(req.body.password, salt);

            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                role: req.body.role,
                password: secpass,

            })
            // res.json(user)

            const JWT_SEC = "This Project belongs to $Anosha";
            const data = {
                user: {
                    id: user.id,
                }
            }
            const authtoken = jwt.sign(data, JWT_SEC)
            res.json(authtoken)
        } catch (error) {
            console.log(error.message);
            return res.status(500).json("internal server error")
        }
    })



// Route 2: Authenticate user
router.post('/login',
    [body('email', 'enter valid email').isEmail(),
    body('password', 'password cannot be blank').exists()
    ],
    async (req, res) => {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const { email, password } = req.body;
        try {
            //for email confirmation
            let user = await User.findOne({ email });
            if (!user) {
                success = false;
                return res.status(400).json({ error: "Please try to login with correct credentials" })
            }
            //for password confirmation
            const passwordCompare = await bcrypt.compare(password, user.password)
            if (!passwordCompare) {
                success = false;
                return res.status(400).json({ error: "Please try to login with correct password" })
            }

            const data = {
                user: {
                    id: user.id,
                    name: user.name,
                }
            }

            const JWT_SEC = "This Project belongs to $Anosha";
            const authtoken = jwt.sign(data, JWT_SEC)
            success = true

            res.json({ user, authtoken, success })

        } catch (error) {
            console.log(error.message);
            return res.status(500).json("internal server error")
        }

        router.route('/fetchuserid/:id').get(function (req, res) {
            let id = req.params.id
            User.findById(id, function (err, user) {
                res.json(user)
            })
        })

    }

)

////

router.get('/fectchuser',
    async (req, res) => {
        try {
            const getuser = await User.find({})
            res.json(getuser)
        } catch (error) {
            console.log(error.message)
            return res.status(500).json("internal server error")

        }

    })



/// fetch user by id
router.get('/fetchuserid/:id',
    async (req, res) => {
        try {
            const getUserbyid = await User.findById(req.params.id)
            if (!getUserbyid) {
                return res.status(400).json("not found")
            }
            res.json(getUserbyid)

        } catch (error) {
            console.log(error.message)
            return res.status(500).json('internal server error')
        }
    }
)




module.exports = router;