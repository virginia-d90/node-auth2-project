const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken"); 

const router = require("express").Router();

const Users = require("../users/users-model.js");
const { isValid } = require("../users/users-service.js");

router.post("/register", isValid, userCounter, (req, res) => {
    const credentials = req.body;
    const rounds = process.env.BCRYPT_ROUNDS || 8;
    const hash = bcryptjs.hashSync(credentials.password, rounds);
    console.log(req.user_counter)
    if(req.user_counter === 0){
        credentials.role = 1
    } else {
        credentials.role = 2
    }

    credentials.password = hash;

    Users.add(credentials)
        .then(user => {
            const token = makeJwt(user);

            res.status(201).json({ data: user, token });
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
});

router.post("/login", isValid, (req, res) => {
    const { username, password } = req.body;
    console.log(username)
    Users.findBy({username: username})
        .then(([user]) => {
            console.log("user", user);
            if (user && bcryptjs.compareSync(password, user.password)) {
                const token = makeJwt(user);

                res.status(200).json({ message: "Welcome to our API", token });
            } else {
                console.log("error")
                res.status(401).json({ message: "Invalid credentials /login" });
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ message: error.message });
        });
});

function makeJwt(user) {
    const payload = {
        subject: user.id,
        username: user.username,
        role: user.role,
    };

    const secret = process.env.JWT_SECRET || "is it secret, is it safe?";

    const options = {
        expiresIn: "1h",
    };
    console.log(payload)
    return jwt.sign(payload, secret, options);
}

function userCounter(req, res, next){
    Users.countUsers()
        .then((count)=> {
            console.log("User Count: ", count['count(`id`)'])
            req.user_counter = count['count(`id`)']
            next()
        })
        .catch(err => {
            res.status(400).json({ error:true, message: "something went wrong on count", err:err})
        })
}

module.exports = router;