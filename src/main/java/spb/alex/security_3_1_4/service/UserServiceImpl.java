package spb.alex.security_3_1_4.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import spb.alex.security_3_1_4.model.User;
import spb.alex.security_3_1_4.repository.UserRepository;
import java.util.List;


@Service
public class UserServiceImpl implements UserDetailsService, UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findUserByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                user.getAuthorities()
        );
    }

    @Override
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public User findById(Long id) {
        return userRepository.findUserById(id);
    }

    @Override
    @Transactional
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User findByName(String username) {
        return userRepository.findUserByUsername(username);
    }
}
