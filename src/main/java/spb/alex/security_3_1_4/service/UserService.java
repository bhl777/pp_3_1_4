package spb.alex.security_3_1_4.service;

import spb.alex.security_3_1_4.model.User;
import java.util.List;

public interface UserService {
    User findByName(String username);

    List<User> findAllUsers();

    void deleteUser(Long id);

    User findById(Long id);

    User saveUser(User user);
}
