package ru.itmo.beans;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Named;
import lombok.Getter;
import lombok.Setter;


@Named("echoBean")
@RequestScoped
@SuppressWarnings("unused")
public class EchoBean {

    @Getter @Setter
    private String inputText;

    @Getter
    private String responseText;

    public void processInput() {
        if (inputText != null && !inputText.trim().isEmpty()) {
            responseText = "Echo response: " + inputText.trim();
        } else {
            responseText = "You didn't enter any text";
        }

        inputText = "";
    }
}