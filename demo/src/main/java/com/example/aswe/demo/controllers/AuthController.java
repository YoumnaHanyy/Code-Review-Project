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
 // Static email and password for admin check
 String adminEmail = "admin@example.com";
 String adminPassword = "admin123";

 // Check if the login credentials match the admin credentials
 if (email.equals(adminEmail) && password.equals(adminPassword)) {
     session.setAttribute("loggedInUser", "admin");
     return "redirect:/admin"; // Redirect to admin page
 }
        User user = authService.login(email, password);
        if (user != null) {
            // ✅ Save user to session
            session.setAttribute("loggedInUser", user);

            // Optional: show welcome message
            model.addAttribute("message", "✅ Login successful. Welcome, " + user.getUsername() + "!");

            return "review"; // Redirecting to review page after login
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

    @GetMapping("/review")
    public String review(HttpSession session) {
        if (session.getAttribute("loggedInUser") == null) {
            return "redirect:/login"; // Redirect to login if not logged in
        }
        return "review"; // Return the dashboard view
    }
    // Protected Route (e.g. Dashboard)
    @GetMapping("/dashboard")
    public String dashboard(HttpSession session) {
        if (session.getAttribute("loggedInUser") == null) {
            return "redirect:/login"; // Redirect to login if not logged in
        }
        return "Dashboard"; // Return the dashboard view
    }
    @GetMapping("/merge")
    public String merge(HttpSession session) {
        if (session.getAttribute("loggedInUser") == null) {
            return "redirect:/login"; // Redirect to login if not logged in
        }
        return "merge"; // Return the dashboard view
    }


    @GetMapping("/admin")
    public String adminPage(HttpSession session) {
        if (session.getAttribute("loggedInUser") == null || !session.getAttribute("loggedInUser").equals("admin")) {
            return "redirect:/login"; // Redirect to login if not logged in or not admin
        }
        return "admin"; // Return the admin page view
    }
    // Another protected route, like pulling or viewing profile
    @GetMapping("/pull")
    public String pull(HttpSession session) {
        if (session.getAttribute("loggedInUser") == null) {
            return "redirect:/login"; // Redirect to login if not logged in
        }
        return "pull"; // Return the pull page view
    }
}
