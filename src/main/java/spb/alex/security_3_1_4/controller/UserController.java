package spb.alex.security_3_1_4.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import spb.alex.security_3_1_4.model.User;
import spb.alex.security_3_1_4.service.UserService;

@RestController
@RequestMapping("/")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping(value = "/user/get")
    public User getUserProfile(Authentication authentication) {

        if (authentication != null) {
            UserDetails ud = (UserDetails) authentication.getPrincipal();
            //            model.addAttribute("user", user);
//            boolean b = ud.getAuthorities().stream().anyMatch(
//                    a -> a.getAuthority().equals("ROLE_ADMIN"));
//            model.addAttribute("iAmAdmin", (b) ? 1 : 0);
//        } else {
//            model.addAttribute("iAmAdmin", 0);
            return userService.findByName(ud.getUsername());
        }
        return new User();
    }
}
