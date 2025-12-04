package ru.itmo.models;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Setter
@Getter
public class Point implements Serializable {
    private double x;
    private double y;
    private double r;
    private boolean hit;
    private float processTimeInMs;
    private String requestTime;

    public Point(double x, double y, double r, boolean hit, float processTimeInMs, String requestTime) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.processTimeInMs = processTimeInMs;
        this.requestTime = requestTime;
    }

    @Override
    public String toString() {
        return "Point{" +
                "x=" + x +
                ", y=" + y +
                ", r=" + r +
                ", hit=" + hit +
                ", processTimeInMs=" + processTimeInMs +
                ", requestTime='" + requestTime + '\'' +
                '}';
    }
}