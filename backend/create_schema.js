// Switch to the target database (though connection string should handle it, this is safe)
db = db.getSiblingDB('revelations');

// Create Users collection with validation
try {
    db.createCollection("users", {
       validator: {
          $jsonSchema: {
             bsonType: "object",
             required: [ "name", "email", "password", "role" ],
             properties: {
                name: {
                   bsonType: "string",
                   description: "must be a string and is required"
                },
                email: {
                   bsonType: "string",
                   description: "must be a string and is required"
                },
                password: {
                   bsonType: "string",
                   description: "must be a string and is required"
                },
                role: {
                   enum: [ "student", "organizer", "admin" ],
                   description: "can only be one of the enum values and is required"
                }
             }
          }
       }
    });
    print("Created users collection");
} catch (e) {
    print("Users collection might already exist: " + e);
}

// Create index for email uniqueness
try {
    db.users.createIndex({ "email": 1 }, { unique: true });
    print("Created unique index on users.email");
} catch (e) {
    print("Error creating index on users: " + e);
}

// Create Events collection
try {
    db.createCollection("events", {
       validator: {
          $jsonSchema: {
             bsonType: "object",
             required: [ "title", "description", "dateTime", "venue", "category", "organizerId" ],
             properties: {
                title: {
                   bsonType: "string",
                   description: "must be a string and is required"
                },
                category: {
                   enum: ['tech', 'cultural', 'sports', 'workshop', 'seminar', 'other'],
                   description: "must be one of the valid categories"
                },
                status: {
                   enum: ['draft', 'published', 'closed'],
                   description: "must be one of the valid statuses"
                }
             }
          }
       }
    });
    print("Created events collection");
} catch (e) {
    print("Events collection might already exist: " + e);
}

// Create Registrations collection
try {
    db.createCollection("registrations", {
       validator: {
          $jsonSchema: {
             bsonType: "object",
             required: [ "userId", "eventId" ],
             properties: {
                userId: {
                   bsonType: "objectId",
                   description: "must be an objectId and is required"
                },
                eventId: {
                   bsonType: "objectId",
                   description: "must be an objectId and is required"
                }
             }
          }
       }
    });
    print("Created registrations collection");
} catch (e) {
    print("Registrations collection might already exist: " + e);
}

// Create compound unique index for registrations
try {
    db.registrations.createIndex({ "userId": 1, "eventId": 1 }, { unique: true });
    print("Created unique index on registrations (userId, eventId)");
} catch (e) {
    print("Error creating index on registrations: " + e);
}

// Create Themes collection
try {
    db.createCollection("themes", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                 properties: {
                    font: {
                        enum: ['pixel', 'retro', 'modern']
                    }
                 }
            }
        }
    });
    print("Created themes collection");
} catch (e) {
    print("Themes collection might already exist: " + e);
}

print("Schema initialization complete.");
