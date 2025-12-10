package ru.itmo.listeners;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import ru.itmo.database.DatabaseManager;

import java.util.logging.Logger;

@WebListener
public class DatabaseInitializer implements ServletContextListener {
    private static final Logger LOGGER = Logger.getLogger(DatabaseInitializer.class.getName());

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        try {
            LOGGER.info("Initializing database schema...");
            DatabaseManager.getInstance().initializeSchema();
            LOGGER.info("Database schema initialized successfully");
        } catch (Exception e) {
            LOGGER.severe("Failed to initialize database schema: " + e.getMessage());
        }
    }
}
