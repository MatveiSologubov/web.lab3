package ru.itmo.beans;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;
import lombok.Getter;
import lombok.Setter;
import ru.itmo.models.Point;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.logging.Logger;

@Named("pointBean")
@RequestScoped
@SuppressWarnings("unused")
public class PointBean {
    private static final Logger LOGGER = Logger.getLogger(PointBean.class.getName());

    private static final double MIN_X = -4.0;
    private static final double MAX_X = 4.0;
    private static final double MIN_Y = -3.0;
    private static final double MAX_Y = 3.0;
    private static final double MIN_R = 0.1;
    private static final double MAX_R = 3.0;


    @Getter
    @Setter
    private Double x;

    @Getter
    @Setter
    private Double y;

    @Getter
    @Setter
    private Double r;

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

    private boolean isValid(double x, double y, double r) {
        if (x < MIN_X || x > MAX_X) {
            return false;
        }

        if (y < MIN_Y || y > MAX_Y) {
            return false;
        }

        return !(r < MIN_R) && !(r > MAX_R);
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