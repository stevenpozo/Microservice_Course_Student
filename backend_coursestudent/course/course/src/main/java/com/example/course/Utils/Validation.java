package com.example.course.Utils;

import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.util.HashMap;
import java.util.Map;

public class Validation {
    public static Map<String, String> getValidationErrors(BindingResult result) {
        Map<String, String> mistake = new HashMap<>();
        for (FieldError error : result.getFieldErrors()) {
            mistake.put(error.getField(), error.getDefaultMessage());
        }
        return mistake;
    }
}
