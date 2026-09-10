package inventory.controller;

import inventory.model.User;
import inventory.service.AuthService;
import inventory.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(
            AuthService authService,
            JwtService jwtService) {

        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> register(@RequestBody User user) {

        User savedUser = authService.register(user);

        String token = jwtService.generateToken(savedUser);

        return Map.of(
                "token", token,
                "id", savedUser.getId(),
                "firstName", savedUser.getFirstName(),
                "lastName", savedUser.getLastName(),
                "email", savedUser.getEmail());
    }

    @PostMapping("/login")
    public Map<String, Object> login(
            @RequestBody Map<String, String> request) {

        User user = authService.authenticate(
                request.get("email"),
                request.get("password"));

        String token = jwtService.generateToken(user);

        return Map.of(
                "token", token,
                "id", user.getId(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName(),
                "email", user.getEmail());
    }
}