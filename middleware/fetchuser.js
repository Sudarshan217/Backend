const jwt = require('jsonwebtoken');
const JWT_SECERT = 'Sudarshan@123'

const fetchuser = (req, res, next) => {
    const token = req.header('token');
    if (!token) {
        return res.status(401).json({ error: 'Please enter a valid token' });
    }
    try {
        const data = jwt.verify(token,JWT_SECERT);
        req.user = data.user;
        next()
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({error:'Token Error'})
    }

}

module.exports = fetchuser


