const db = require('../middleware/db');

exports.users_getAll = (req, res, next) => {

    const { limit } = req.query;
    getUsers();

    async function getUsers() {
        try {
            const dbresult = await db.query('SELECT * FROM usr_users ORDER BY id DESC LIMIT $1', [limit]);

            res.status(200).json({
                users: dbresult.rows
            });
        } catch(err) {
            res.status(200).json({
                message: err
            });
        }
    }
}