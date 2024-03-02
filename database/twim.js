db.createUser({
  user: 'admin',
  pwd: 'admin',
  roles: [
    {
      role: 'readWrite',
      db: 'mongoTwim',
    },
  ],
})

db = db.getSiblingDB('mongoTwim')
