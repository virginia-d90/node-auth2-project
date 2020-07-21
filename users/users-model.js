const db = require("../data/db-config");


const countUsers = async () => {
    const count = await db('users')
    .count('id')
    .first()
    return count 
}

function find() {
    return db("users as u")
    .join("roles as r", "u.role", "r.id")
    .select("u.id", "u.username", "r.name as role ")
    .orderBy("u.id");
}

async function findBy(filter) {
    const returned = await db("users")
    .join("roles", "users.role", "roles.id")
    .where(filter)
    .select("users.id", "users.username", "roles.name as role", "users.password")
    .orderBy("users.id");
    
    return returned
}

async function add(user) {
    try {
        const [id] = await db("users").insert(user, "id");
        
        return findById(id);
    } catch (error) {
        throw error;
    }
}

function findById(id) {
    return db("users").where({ id }).first();
}
module.exports = {
    add,
    find,
    findBy,
    findById,
    countUsers, 
};