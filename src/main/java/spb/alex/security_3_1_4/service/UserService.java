package spb.alex.security_3_1_4.service;

import spb.alex.security_3_1_4.model.Role;
import spb.alex.security_3_1_4.model.User;

import java.util.List;
import java.util.Set;

public interface UserService {
    User findByName(String username);

    List<User> findAllUsers();

    void createUser(User user, Long[] selectedIds);

    void deleteUser(Long id);

    void createUserWithRoles(User user, Set<Role> roles);

    void updateUser(Long id, User user, Set<Role> roles);

    User findById(Long id);

    void createUserFromRest(User user);

    User saveUser(User user);
}
