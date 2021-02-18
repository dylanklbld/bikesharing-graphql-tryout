module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    await db.collection("bikes").insertMany([
      {
        name: "Henry",
        latitude: 50.119504,
        longitude: 8.638137,
        rented: false,
      },
      { name: "Hans", latitude: 50.119229, longitude: 8.64002, rented: false },
      {
        name: "Thomas",
        latitude: 50.120452,
        longitude: 8.650507,
        rented: false,
      },
    ]);
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    await db.collection("bikes").deleteMany({});
  },
};
