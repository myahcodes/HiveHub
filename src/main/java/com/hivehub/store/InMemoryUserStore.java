package com.hivehub.store;

import com.hivehub.model.UserRecord;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public final class InMemoryUserStore {
    private static final Map<String, UserRecord> USERS_BY_USERNAME = new ConcurrentHashMap<>();
    private static final Map<String, String> USERNAME_BY_EMAIL = new ConcurrentHashMap<>();

    private InMemoryUserStore() {
    }

    public static synchronized boolean addUser(UserRecord user) {
        String usernameKey = normalize(user.getUsername());
        String emailKey = normalize(user.getEmail());

        if (USERS_BY_USERNAME.containsKey(usernameKey) || USERNAME_BY_EMAIL.containsKey(emailKey)) {
            return false;
        }

        USERS_BY_USERNAME.put(usernameKey, user);
        USERNAME_BY_EMAIL.put(emailKey, usernameKey);
        return true;
    }

    public static UserRecord findByIdentifier(String identifier) {
        String key = normalize(identifier);

        UserRecord byUsername = USERS_BY_USERNAME.get(key);
        if (byUsername != null) {
            return byUsername;
        }

        String username = USERNAME_BY_EMAIL.get(key);
        if (username == null) {
            return null;
        }

        return USERS_BY_USERNAME.get(username);
    }

    private static String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase();
    }
}
