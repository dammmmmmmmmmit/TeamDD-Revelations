// Switch to the target database
db = db.getSiblingDB('revelations');

// Create Messages collection with validation
try {
    db.createCollection("messages", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["eventId", "userId", "content"],
                properties: {
                    eventId: {
                        bsonType: "objectId",
                        description: "Event ID is required"
                    },
                    userId: {
                        bsonType: "objectId",
                        description: "User ID is required"
                    },
                    content: {
                        bsonType: "string",
                        maxLength: 1000,
                        description: "Message content is required"
                    },
                    isDeleted: {
                        bsonType: "bool"
                    }
                }
            }
        }
    });
    print("Created messages collection");
} catch (e) {
    print("Messages collection might already exist: " + e);
}

// Create indexes for efficient querying
try {
    db.messages.createIndex({ "eventId": 1, "createdAt": 1 });
    print("Created index on messages (eventId, createdAt)");
} catch (e) {
    print("Error creating index on messages: " + e);
}

print("Messages schema initialization complete.");
