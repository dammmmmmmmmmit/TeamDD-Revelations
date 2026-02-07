// Switch to the target database
db = db.getSiblingDB('revelations');

// Find a user to assign as organizer (using the one created in seed_users.js or any existing one)
const organizer = db.users.findOne({ role: 'organizer' }) || db.users.findOne({});

if (!organizer) {
    print("Error: No organizer or user found to assign events to. Please run seed_users.js first.");
    quit();
}

console.log("Assigning events to organizer: " + organizer.email);

const events = [
    {
        title: "The Upside Down Hackathon",
        description: "Enter the void and code your way out! specific challenges involving reverse engineering and obscure algorithms.",
        dateTime: new Date("2024-11-15T09:00:00Z"),
        venue: "Hawkins Lab (Main Hall)",
        category: "tech",
        status: "published",
        organizerId: organizer._id,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        title: "Demogorgon Debugging Contest",
        description: "Hunt down the most monstrous bugs in our codebase. Only the sharpest minds will survive this debugging nightmare.",
        dateTime: new Date("2024-11-16T14:00:00Z"),
        venue: "Starcourt Mall (Food Court)",
        category: "tech",
        status: "published",
        organizerId: organizer._id,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        title: "Cerebro AI Workshop",
        description: "Learn to build your own Cerebro-like neural network. Deep learning workshop focusing on signal processing and pattern recognition.",
        dateTime: new Date("2024-11-17T10:00:00Z"),
        venue: "The Radio Shack",
        category: "workshop",
        status: "published",
        organizerId: organizer._id,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        title: "Hellfire Club CTF",
        description: "Join the Hellfire Club for a Capture The Flag competition. Dungeons & Dragons themed cybersecurity challenges.",
        dateTime: new Date("2024-11-18T18:00:00Z"),
        venue: "Mike's Basement",
        category: "tech",
        status: "published",
        organizerId: organizer._id,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        title: "Mind Flayer's Distributed Systems",
        description: "A seminar on hive mind algorithms and distributed computing architectures. How to manage a fleet of connected entities.",
        dateTime: new Date("2024-11-19T13:00:00Z"),
        venue: "Hawkins Public Library",
        category: "seminar",
        status: "published",
        organizerId: organizer._id,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        title: "Eleven's Psychic Protocol Design",
        description: "Workshop on designing communication protocols for IoT devices using telepathic-like efficiency.",
        dateTime: new Date("2024-11-20T11:00:00Z"),
        venue: "Hopper's Cabin",
        category: "workshop",
        status: "published",
        organizerId: organizer._id,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        title: "Code Like it's 1984",
        description: "Retro programming challenge. Write code for 8-bit systems. Assembly and C only! No modern libraries allowed.",
        dateTime: new Date("2024-11-21T15:00:00Z"),
        venue: "Palace Arcade",
        category: "tech",
        status: "published",
        organizerId: organizer._id,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        title: "Gate Closing Algorithm Seminar",
        description: "Advanced algorithms for closing inter-dimensional portals. Graph theory and network security focus.",
        dateTime: new Date("2024-11-22T16:00:00Z"),
        venue: "Russian Lab Base",
        category: "seminar",
        status: "published",
        organizerId: organizer._id,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

try {
    const result = db.events.insertMany(events);
    print("Successfully inserted " + result.insertedIds.length + " events.");
} catch (e) {
    print("Error inserting events: " + e);
}
