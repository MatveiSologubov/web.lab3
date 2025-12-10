package ru.itmo.beans;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Named;
import lombok.Getter;

@Named("startPageBean")
@RequestScoped
@SuppressWarnings("unused")
public class StartPageBean {
    @Getter
    private final String studentName = "Sologubov Matvei Alekseevich";

    @Getter
    private final String groupNumber = "P3232";

    @Getter
    private final String variantNumber = "36589";
}