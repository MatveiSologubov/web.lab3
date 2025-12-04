package ru.itmo.beans;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;
import lombok.Getter;
import lombok.Setter;
import ru.itmo.models.Point;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Named("pointBean")
@RequestScoped
@SuppressWarnings("unused")
public class PointBean {

    @Getter
    @Setter
    private Double x;

    @Getter
    @Setter
    private Integer y;

    @Getter
    @Setter
    private Double r = 1.0;

    @Getter
    @Setter
    private Boolean autoSubmit = false;

    @Getter
    private Boolean hit;

    @Getter
    private Float processTimeInMs;

    @Getter
    private String requestTime;

    @Inject
    private ResultsBean resultsBean;

    public void checkPoint() {
        long startTime = System.nanoTime();

        try {
            if (x == null || y == null || r == null) {
                hit = false;
                return;
            }

            if (!isValid(x, y, r)) {
                hit = false;
                return;
            }

            hit = isHit(x, y, r);

            long endTime = System.nanoTime();
            processTimeInMs = (endTime - startTime) / 1_000_000f;
            requestTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

            Point point = new Point(x, y, r, hit, processTimeInMs, requestTime);
            resultsBean.addResult(point);

        } catch (Exception e) {
            hit = false;
            processTimeInMs = 0f;
            requestTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        }
    }

    public void reset() {
        x = null;
        y = null;
        r = 1.0;
        hit = null;
        processTimeInMs = null;
        requestTime = null;
    }

    private boolean isValid(double x, int y, double r) {
        if (x <= -4 || x >= 4) {
            return false;
        }

        if (y <= -3 || y >= 3) {
            return false;
        }

        return !(r < 0.1) && !(r > 3);
    }

    private boolean isHit(double x, double y, double r) {
        boolean isOutOfBounds = (Math.abs(x) > r || Math.abs(y) > r);
        if (isOutOfBounds) {
            return false;
        }

        boolean inQuarterCircle = (x <= 0 && y <= 0 && (x * x + y * y <= r * r));

        boolean inSquare = (x >= 0 && y >= 0 && x <= r && y <= r);

        boolean inTriangle = (x >= 0 && y <= 0 && x - y <= r);

        return inQuarterCircle || inSquare || inTriangle;
    }
}