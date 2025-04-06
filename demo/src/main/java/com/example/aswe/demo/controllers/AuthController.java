package com.example.aswe.demo.controllers;

import com.example.aswe.demo.models.User;
import com.example.aswe.demo.services.AuthService;

import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class AuthController {

    @Autowired
    private AuthService authService;

    // Landing page
    @GetMapping("/")
    public String home() {
        return "LandingPage"; // maps to LandingPage.html
    }

    // Review page (unprotected)
    @GetMapping("/review")
    public String review() {
        return "review"; // maps to review.html
    }

    // Dashboard (protected)
    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, Model model) {
        User user = (User) session.getAttribute("loggedInUser");

        if (user == null) {
            return "Dashboard"; // must be logged in
        }

        model.addAttribute("user", user); // so you can say "Welcome, user!"
        return "Dashboard"; // maps to Dashboard.html
    }

    // Show signup form
    @GetMapping("/signup")
    public String showSignupForm(Model model) {
        model.addAttribute("user", new User());
        return "signup";
    }

    // Handle signup form
    @PostMapping("/signup")
    public String signup(@ModelAttribute User user, Model model) {
        System.out.println(">>> Received signup form for: " + user.getEmail());

        if (authService.register(user)) {
            return "redirect:/login";
        }

        model.addAttribute("error", "Email already registered.");
        return "signup";
    }

    // Show login form
    @GetMapping("/login")
    public String showLoginForm() {
        return "login";
    }

    // Handle login form
    @PostMapping("/custom-login")
    public String login(@RequestParam String email,
                        @RequestParam String password,
                        Model model,
                        HttpSession session) {

        System.out.println(">>> Login form submitted for: " + email);

        User user = authService.login(email, password);
        if (user != null) {
            // ✅ Save user to session
            session.setAttribute("loggedInUser", user);

            // Optional: show welcome message
            model.addAttribute("message", "✅ Login successful. Welcome, " + user.getUsername() + "!");

            return "review";
        }

        model.addAttribute("error", "❌ Invalid email or password.");
        return "login";
    }

    // Handle logout
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate(); // clears session
        return "redirect:/login";
    }
}
