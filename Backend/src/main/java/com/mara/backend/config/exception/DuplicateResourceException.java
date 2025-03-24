package com.mara.backend.config.exception;

public class DuplicateResourceException extends Exception{
    public DuplicateResourceException(String message) {
        super(message);
    }
}
