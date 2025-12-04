package ru.itmo.database;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Singleton class that manages database connections.
 * Thread-safe and provides connection pooling-like behavior.
 */
public class DatabaseManager {
    private static final Logger LOGGER = Logger.getLogger(DatabaseManager.class.getName());
    private static final String PROPERTIES_FILE = "/database.properties";

    private static DatabaseManager instance;
    private String dbUrl;
    private String dbUser;
    private String dbPassword;

    private DatabaseManager() {
        initialize();
    }

    public static synchronized DatabaseManager getInstance() {
        if (instance == null) {
            instance = new DatabaseManager();
        }
        return instance;
    }

    private void initialize() {
        Properties properties = new Properties();
        try (InputStream input = DatabaseManager.class.getResourceAsStream(PROPERTIES_FILE)) {
            if (input == null) {
                throw new RuntimeException("Database configuration file not found: " + PROPERTIES_FILE);
            }
            properties.load(input);

            dbUrl = properties.getProperty("db.url");
            dbUser = properties.getProperty("db.user");
            dbPassword = properties.getProperty("db.password");

            if (dbUrl == null || dbUser == null || dbPassword == null) {
                throw new RuntimeException("Missing required database properties in " + PROPERTIES_FILE);
            }

            Class.forName("org.postgresql.Driver");
            LOGGER.info("PostgreSQL JDBC Driver registered successfully");

        } catch (IOException | ClassNotFoundException e) {
            throw new RuntimeException("Failed to initialize database configuration", e);
        }
    }

    public Connection getConnection() throws SQLException {
        try {
            return DriverManager.getConnection(dbUrl, dbUser, dbPassword);
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Failed to get database connection", e);
            throw e;
        }
    }

    public void initializeSchema() {
        String createTableSQL = """
                CREATE TABLE IF NOT EXISTS points (
                    id SERIAL PRIMARY KEY,
                    x DOUBLE PRECISION NOT NULL,
                    y DOUBLE PRECISION NOT NULL,
                    r DOUBLE PRECISION NOT NULL,
                    hit BOOLEAN NOT NULL,
                    process_time_ms REAL NOT NULL,
                    request_time VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """;

        try (Connection connection = getConnection()) {
            Statement statement = connection.createStatement();

            statement.execute(createTableSQL);
            LOGGER.info("Database schema initialized successfully");

        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Failed to initialize database schema", e);
            throw new RuntimeException("Database initialization failed", e);
        }
    }
}
