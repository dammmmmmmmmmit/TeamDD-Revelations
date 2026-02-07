// Switch to the target database
db = db.getSiblingDB('revelations');

const passwordHash = "$2a$10$B1HiqstZORmbr1IG5DljhO3C1o6H/FpetNiYBxl7IFar5U2oEQrTK"; // 'password123'

// Users to insert
const users = [
    {
        name: "Admin User",
        email: "admin@example.com",
        password: passwordHash,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Event Organizer",
        email: "organizer@example.com",
        password: passwordHash,
        role: "organizer",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Student User",
        email: "student@example.com",
        password: passwordHash,
        role: "student",
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

// Insert users
try {
    const result = db.users.insertMany(users);
    print("Inserted " + result.insertedIds.length + " users.");

    // Retrieve the organizer for event creation
    const organizer = db.users.findOne({ email: "organizer@example.com" });

    if (organizer) {
        const events = [
            {
                title: "Strange Hackathon",
                description: "A hackathon in the upside down.",
                dateTime: new Date("2024-12-01T10:00:00Z"),
                venue: "Hawkins High School",
                category: "tech",
                status: "published",
                organizerId: organizer._id,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        const eventResult = db.events.insertMany(events);
        print("Inserted " + eventResult.insertedIds.length + " events.");
    }

} catch (e) {
    print("Error inserting data: " + e);
}

print("Database seeding complete.");
