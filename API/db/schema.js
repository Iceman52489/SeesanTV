use seesanDB;

db.updateUser({
  user: 'mocha',
  pwd: 'lego8140',
  roles: [
    { role: 'readWrite', db: 'seesanDB' },
    { role: 'userAdminAnyDatabase', db: 'admin' },
    'clusterAdmin'
  ]
});
