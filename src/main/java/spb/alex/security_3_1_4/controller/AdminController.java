package spb.alex.security_3_1_4.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import spb.alex.security_3_1_4.DTO.UserDTO;
import spb.alex.security_3_1_4.model.Role;
import spb.alex.security_3_1_4.model.User;
import spb.alex.security_3_1_4.service.RoleService;
import spb.alex.security_3_1_4.service.UserService;

import java.util.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

//    @GetMapping(value = "/admin")
//    public String listUsers(Model model, Authentication authentication) {
//
//        if (authentication != null) {
//            UserDetails ud = (UserDetails) authentication.getPrincipal();
//            model.addAttribute("currUser", userService.findByName(ud.getUsername()));
//        }
//        else {
//            model.addAttribute("currUser", new User());
//        }
//        model.addAttribute("newUser", new User());
//        model.addAttribute("users", userService.findAllUsers());
//        List<Role> allRoles = roleService.getAllRoles();
//        model.addAttribute("allRoles", allRoles);
//
//        return "admin"; // имя представления;
//    }

    @GetMapping("/api")
    public List<User> showAllUsersRest() {
        List<User> users = userService.findAllUsers();

        return users;
    }

    @GetMapping("/new")
    public String getAddPage(Model model) {
        model.addAttribute("user", new User());
        List<Role> allRoles = roleService.getAllRoles();
        model.addAttribute("allRoles", allRoles);

        return "new";
    }

    @PostMapping("/new")
    public String createUser(@ModelAttribute("user") User user) {
        userService.createUserWithRoles(user, user.getRoles());

        return "redirect:/admin/admin";
    }

    @PostMapping("/api/new")
    public ResponseEntity<User> createUser(@Valid @RequestBody UserDTO userDTO) {
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setLastName(userDTO.getLastName());
        user.setAge(userDTO.getAge());
        user.setEmail(userDTO.getEmail());
        user.setPassword(userDTO.getPassword());
        user.setPhone(userDTO.getPhone());

        // Установка ролей
        if (userDTO.getRoleIds() != null) {
            user.setRoles(roleService.findRolesByIds(userDTO.getRoleIds()));
        }

        User createdUser = userService.saveUser(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @GetMapping("/api/new")
    public User getEmptyUser () {
        User user = new User();
        Set<Role> roles = new HashSet<>(roleService.getAllRoles());
        user.setRoles(roles);
        return user;
    }

    @GetMapping("/delete")
    public String getDeletePage(Model model,
                                @RequestParam Long id) {
        User user = userService.findById(id); // Загружаем пользователя по id
        model.addAttribute("user", user);// Передаем существующего пользователя
        List<Role> allRoles = roleService.getAllRoles();
        model.addAttribute("allRoles", allRoles);

        return "delete";
    }

    @PostMapping("/delete")
    public String deleteUser(@RequestParam Long id) {
        userService.deleteUser(id);

        return "redirect:/admin/admin";
    }

    @DeleteMapping("/api/delete")
    public String deleteUserRest(@RequestParam Long id) {
        userService.deleteUser(id);

        return "User was deleted";
    }

    @PutMapping("/api/update")
    public ResponseEntity<User> updateUser(@RequestParam Long id, @Valid @RequestBody UserDTO userDTO) {

        Optional<User> existingUserOpt = Optional.ofNullable(userService.findById(id));

        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();
            existingUser.setUsername(userDTO.getUsername());
            existingUser.setLastName(userDTO.getLastName());
            existingUser.setAge(userDTO.getAge());
            existingUser.setEmail(userDTO.getEmail());
            existingUser.setPassword(userDTO.getPassword());
            existingUser.setPhone(userDTO.getPhone());

            // Установка ролей
            if (userDTO.getRoleIds() != null) {
                existingUser.setRoles(roleService.findRolesByIds(userDTO.getRoleIds()));
            }

            User updatedUser = userService.saveUser(existingUser);
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/update")
    public String getUpdatePage(Model model,
                                @RequestParam Long id) {
        User user = userService.findById(id); // Загружаем пользователя по id
        model.addAttribute("user", user); // Передаем существующего пользователя
        List<Role> allRoles = roleService.getAllRoles();
        model.addAttribute("allRoles", allRoles);

        return "update";
    }

    @PostMapping("/update")
    public String updateUser(@ModelAttribute("user") User user,
                             @RequestParam Long id) {
        userService.updateUser(id, user, user.getRoles());

        return "redirect:/admin/admin";
    }

    @GetMapping(value = "/user")
    public String getUserProfile(Model model,
                                 @RequestParam Long id) {
        model.addAttribute("user", userService.findById(id));

        return "user";
    }

    @GetMapping("/api/user")
    public User getUserRest(@RequestParam Long id) {
        return userService.findById(id);
    }
}
