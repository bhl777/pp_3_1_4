package spb.alex.security_3_1_4.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/api")
    public List<User> showAllUsersRest() {

        return userService.findAllUsers();
    }

    @PostMapping("/api/new")
    public ResponseEntity<User> createUser(@Valid @RequestBody UserDTO userDTO) {
        User newUser = userService.createUserFromDTO(userDTO);
        User createdUser = userService.saveUser(newUser);

        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @GetMapping("/api/new")
    public User getEmptyUser () {
        User user = new User();
        Set<Role> roles = new HashSet<>(roleService.getAllRoles());
        user.setRoles(roles);

        return user;
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
            existingUser.setPassword(userService.passCoder(userDTO.getPassword()));
            User updatedUser = userService.saveUser(existingUser);

            return ResponseEntity.ok(updatedUser);
        } else {

            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/api/user")
    public User getUserRest(@RequestParam Long id) {
        return userService.findById(id);
    }
}
