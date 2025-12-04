package ru.itmo.beans;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Named;
import lombok.Getter;
import ru.itmo.models.Point;

import java.util.ArrayList;
import java.util.List;

@Named("resultsBean")
@ApplicationScoped
@SuppressWarnings("unused")
public class ResultsBean {
    private static final int MAX_HISTORY_SIZE = 100;

    @Getter
    private final List<Point> results = new ArrayList<>();

    public void addResult(Point point) {
        if (results.size() >= MAX_HISTORY_SIZE) {
            results.remove(0);
        }
        results.add(point);
    }

    public void clearResults() {
        results.clear();
    }

    public List<Point> getReversedResults() {
        List<Point> reversed = new ArrayList<>(results);
        java.util.Collections.reverse(reversed);
        return reversed;
    }

    public String getPointsAsJson() {
        if (results.isEmpty()) {
            return "[]";
        }

        StringBuilder json = new StringBuilder("[");
        for (int i = 0; i < results.size(); i++) {
            Point point = results.get(i);
            json.append(String.format("{\"x\":%.2f,\"y\":%d,\"r\":%.2f,\"isHit\":%b}",
                    point.getX(), point.getY(), point.getR(), point.isHit()));
            if (i < results.size() - 1) {
                json.append(",");
            }
        }
        json.append("]");
        return json.toString();
    }
}