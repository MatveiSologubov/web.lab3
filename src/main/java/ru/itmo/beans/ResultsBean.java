package ru.itmo.beans;

import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;
import lombok.Getter;
import ru.itmo.database.PointDAO;
import ru.itmo.models.Point;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.logging.Logger;

@Named("resultsBean")
@ApplicationScoped
@SuppressWarnings("unused")
public class ResultsBean {
    private static final Logger LOGGER = Logger.getLogger(ResultsBean.class.getName());
    private static final int MAX_DISPLAY_POINTS = 100;

    @Inject
    private PointDAO pointDAO;

    @Getter
    private List<Point> results = new ArrayList<>();

    @PostConstruct
    public void init() {
        loadResultsFromDatabase();
    }

    public void addResult(Point point) {
        try {
            pointDAO.save(point);
            loadResultsFromDatabase();
            LOGGER.fine("Added point to results: " + point);
        } catch (Exception e) {
            LOGGER.severe("Failed to save point to database: " + e.getMessage());

            if (results.size() >= MAX_DISPLAY_POINTS) {
                results.remove(0);
            }
            results.add(point);
        }
    }

    public void clearResults() {
        try {
            pointDAO.deleteAll();
            results.clear();
            LOGGER.info("Cleared all results from database");
        } catch (Exception e) {
            LOGGER.severe("Failed to clear results from database: " + e.getMessage());
            results.clear();
        }
    }

    private void loadResultsFromDatabase() {
        try {
            results = pointDAO.findLastN(MAX_DISPLAY_POINTS);
            LOGGER.fine("Loaded " + results.size() + " points from database");
        } catch (Exception e) {
            LOGGER.severe("Failed to load results from database: " + e.getMessage());
            results = Collections.emptyList();
        }
    }
}