package ru.itmo.database;

import jakarta.enterprise.context.ApplicationScoped;
import ru.itmo.models.Point;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Data Access Object for Point entities.
 * Handles all database operations using plain JDBC.
 */
@ApplicationScoped
public class PointDAO {
    private static final Logger LOGGER = Logger.getLogger(PointDAO.class.getName());

    private static final String INSERT_SQL = """
            INSERT INTO points (x, y, r, hit, process_time_ms, request_time)
            VALUES (?, ?, ?, ?, ?, ?)
            """;

    private static final String SELECT_ALL_SQL = """
            SELECT x, y, r, hit, process_time_ms, request_time
            FROM points
            ORDER BY created_at DESC, id DESC
            """;

    private static final String SELECT_LIMITED_SQL = """
            SELECT x, y, r, hit, process_time_ms, request_time
            FROM points
            ORDER BY created_at DESC, id DESC
            LIMIT ?
            """;

    private static final String DELETE_ALL_SQL = "DELETE FROM points";

    private static final String COUNT_SQL = "SELECT COUNT(*) FROM points";

    public void save(Point point) {
        try (Connection connection = DatabaseManager.getInstance().getConnection();
             PreparedStatement statement = connection.prepareStatement(INSERT_SQL, Statement.RETURN_GENERATED_KEYS)) {

            statement.setDouble(1, point.getX());
            statement.setDouble(2, point.getY());
            statement.setDouble(3, point.getR());
            statement.setBoolean(4, point.isHit());
            statement.setFloat(5, point.getProcessTimeInMs());
            statement.setString(6, point.getRequestTime());

            int affectedRows = statement.executeUpdate();

            if (affectedRows == 0) {
                throw new SQLException("Creating point failed, no rows affected.");
            }

            LOGGER.fine("Saved point: " + point);

        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Failed to save point", e);
            throw new RuntimeException("Database save failed", e);
        }
    }

    public List<Point> findAll() {
        try (Connection connection = DatabaseManager.getInstance().getConnection();
             PreparedStatement statement = connection.prepareStatement(SELECT_ALL_SQL);
             ResultSet resultSet = statement.executeQuery()) {

            return mapResultSetToPoints(resultSet);

        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Failed to fetch points", e);
            throw new RuntimeException("Database query failed", e);
        }
    }

    public List<Point> findLastN(int limit) {
        try (Connection connection = DatabaseManager.getInstance().getConnection();
             PreparedStatement statement = connection.prepareStatement(SELECT_LIMITED_SQL)) {

            statement.setInt(1, limit);

            try (ResultSet resultSet = statement.executeQuery()) {
                return mapResultSetToPoints(resultSet);
            }

        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Failed to fetch points", e);
            throw new RuntimeException("Database query failed", e);
        }
    }

    public void deleteAll() {
        try (Connection connection = DatabaseManager.getInstance().getConnection();
             Statement statement = connection.createStatement()) {

            int affectedRows = statement.executeUpdate(DELETE_ALL_SQL);
            LOGGER.info("Deleted " + affectedRows + " points");

        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Failed to delete points", e);
            throw new RuntimeException("Database delete failed", e);
        }
    }

    public int count() {
        try (Connection connection = DatabaseManager.getInstance().getConnection();
             Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(COUNT_SQL)) {

            if (resultSet.next()) {
                return resultSet.getInt(1);
            }
            return 0;

        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Failed to count points", e);
            throw new RuntimeException("Database count failed", e);
        }
    }

    private List<Point> mapResultSetToPoints(ResultSet resultSet) throws SQLException {
        List<Point> points = new ArrayList<>();

        while (resultSet.next()) {
            Point point = new Point(
                    resultSet.getDouble("x"),
                    resultSet.getDouble("y"),
                    resultSet.getDouble("r"),
                    resultSet.getBoolean("hit"),
                    resultSet.getFloat("process_time_ms"),
                    resultSet.getString("request_time")
            );
            points.add(point);
        }

        return points;
    }
}
