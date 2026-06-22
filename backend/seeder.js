const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Book = require("./models/Book");

// Load Environment variables
dotenv.config();

const categories = ["Fiction", "Science", "History", "Technology", "Biography"];

const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];

const fictionTemplates = [
    "The Shadow of {noun}",
    "Chronicles of the {adj} {noun}",
    "The Last {noun}",
    "Secrets in the {noun}",
    "Beyond the {adj} Horizon",
    "The {noun} Legacy",
    "Echoes of {noun}",
    "The {adj} Alchemist",
    "Whispers in the {noun}",
    "The {noun} of Secrets"
];
const fictionNouns = ["Castle", "Emperor", "River", "Mirror", "Flame", "Wind", "Storm", "Ocean", "Kingdom", "Stranger", "Dream", "Shadow"];
const fictionAdjs = ["Lost", "Silent", "Hidden", "Dark", "Golden", "Ancient", "Forgotten", "Broken", "Eternal", "Sacred"];

const scienceTemplates = [
    "Principles of {noun}",
    "Introduction to {adj} {noun}",
    "The Quantum {noun}",
    "Exploring the {noun} Universe",
    "Advanced {noun} Dynamics",
    "The Science of {noun}",
    "Understanding the {adj} {noun}",
    "The Future of {noun}"
];
const scienceNouns = ["Cosmology", "Physics", "Chemistry", "Biology", "Genetics", "Astrophysics", "Thermodynamics", "Evolution", "Neuroscience"];
const scienceAdjs = ["Modern", "Applied", "Theoretical", "Molecular", "Quantum", "Cellular", "Chemical"];

const historyTemplates = [
    "The Rise and Fall of {noun}",
    "History of the {adj} {noun}",
    "Secrets of the {noun} Empire",
    "The {adj} Revolution",
    "Chronicles of {noun}",
    "The {noun} Wars",
    "A History of {noun}"
];
const historyNouns = ["Rome", "Egypt", "Europe", "Asia", "Civilization", "Warfare", "Monarchy", "Humanity", "The Middle Ages"];
const historyAdjs = ["Ancient", "Medieval", "Imperial", "Global", "Revolutionary", "Modern"];

const techTemplates = [
    "Modern {noun} Engineering",
    "Building {adj} {noun} Systems",
    "The {noun} Handbook",
    "Introduction to {adj} {noun}",
    "Mastering {noun}",
    "{noun} for Beginners",
    "Designing {adj} {noun}"
];
const techNouns = ["JavaScript", "Python", "React", "Node.js", "Docker", "Kubernetes", "Machine Learning", "Databases", "Cloud Computing", "Web Development"];
const techAdjs = ["Scalable", "Robust", "Interactive", "Advanced", "Full-Stack", "Distributed"];

const bioTemplates = [
    "The Life and Times of {name}",
    "{name}: A Journey of {adj} Discovery",
    "Memoirs of {name}",
    "The Mind of {name}",
    "{name}: The Story of a {noun}",
    "Inside the World of {name}"
];
const bioNouns = ["Leader", "Visionary", "Scientist", "Rebel", "Innovator", "Pioneer"];
const bioAdjs = ["Remarkable", "Uncharted", "Inspiring", "Bold", "Creative"];

const generateName = () => {
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${first} ${last}`;
};

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateTitle = (category) => {
    let title = "";
    if (category === "Fiction") {
        const temp = getRandomElement(fictionTemplates);
        title = temp
            .replace("{noun}", getRandomElement(fictionNouns))
            .replace("{adj}", getRandomElement(fictionAdjs));
    } else if (category === "Science") {
        const temp = getRandomElement(scienceTemplates);
        title = temp
            .replace("{noun}", getRandomElement(scienceNouns))
            .replace("{adj}", getRandomElement(scienceAdjs));
    } else if (category === "History") {
        const temp = getRandomElement(historyTemplates);
        title = temp
            .replace("{noun}", getRandomElement(historyNouns))
            .replace("{adj}", getRandomElement(historyAdjs));
    } else if (category === "Technology") {
        const temp = getRandomElement(techTemplates);
        title = temp
            .replace("{noun}", getRandomElement(techNouns))
            .replace("{adj}", getRandomElement(techAdjs));
    } else if (category === "Biography") {
        const temp = getRandomElement(bioTemplates);
        title = temp
            .replace("{name}", generateName())
            .replace("{noun}", getRandomElement(bioNouns))
            .replace("{adj}", getRandomElement(bioAdjs));
    }
    return title;
};

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for Seeding...");

        // Clear existing data
        await User.deleteMany({});
        await Book.deleteMany({});
        console.log("Cleared existing Users and Books.");

        // Create Admin User
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);
        await User.create({
            name: "Admin Librarian",
            email: "admin@aetheria.com",
            password: hashedPassword
        });
        console.log("Default Admin User created: admin@aetheria.com / password123");

        // Generate 100 books for each category
        const booksToInsert = [];
        const titleTracker = new Set(); // Prevent duplicates

        for (const cat of categories) {
            let count = 0;
            while (count < 100) {
                let title = generateTitle(cat);
                
                // Ensure unique titles just to make it clean
                if (!titleTracker.has(title)) {
                    titleTracker.add(title);
                    booksToInsert.push({
                        title,
                        author: generateName(),
                        category: cat,
                        quantity: Math.floor(Math.random() * 20) + 1 // random stock 1-20
                    });
                    count++;
                }
            }
        }

        await Book.insertMany(booksToInsert);
        console.log(`Successfully seeded ${booksToInsert.length} books in total (100 books for each of the 5 categories).`);

        mongoose.connection.close();
        console.log("Database Seeding Finished Successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error.message);
        process.exit(1);
    }
};

seedData();
