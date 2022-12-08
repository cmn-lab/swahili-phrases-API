const prisma = require('../prisma/index');
const { use } = require('../routes/phraseRoutes');

exports.createUser = async (req, res, next) => {
    // Create new user
    try {
        const { name, email, password, role } = req.body;
        //validate input with express validator here ...
        const user = {name, email, password, role};
        const result = await prisma.user.create({ data: user})
        res.status(200).json({ result });
    } catch (error) {
        next(error);
    }
}

exports.updateUser = async (req, res, next) => {
    const { id } = req.params;
    const {name, email, password, role} = req.body;
}