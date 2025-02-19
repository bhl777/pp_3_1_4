package spb.alex.security_3_1_4.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import spb.alex.security_3_1_4.model.Role;
import spb.alex.security_3_1_4.model.User;
import spb.alex.security_3_1_4.repository.RoleRepository;
import spb.alex.security_3_1_4.repository.UserRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserDetailsService, UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
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
    @Transactional
    public void createUser(User user, Long[] roles) {

        User existingUser = findByName(user.getUsername());
        if (existingUser != null) {
            throw new IllegalArgumentException("Пользователь с именем '" + user.getUsername() + "' уже существует");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword())); // Кодируем пароль
        user.setRoles(newRoleSet(roles));
        userRepository.save(user);
    }

    private Set<Role> newRoleSet(Long[] roles) {
        Set<Role> roleSet = new HashSet<>();

        for (Long l : roles) {
            roleSet.add(roleRepository.findRoleById(l));
        }

        return roleSet;
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
    @Transactional
    public void createUserWithRoles(User user, Set<Role> roles) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 2. Получаем полные объекты ролей из базы
        Set<Role> managedRoles = new HashSet<>(roleRepository.findAllById(
                roles.stream()
                        .map(Role::getId)
                        .collect(Collectors.toList())
        ));

        // 3. Устанавливаем роли
        user.setRoles(managedRoles);

        // 4. Сохраняем пользователя
        userRepository.save(user);

    }

    @Override
    @Transactional
    public void updateUser(Long id, User updatedUser, Set<Role> roles) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь с ID '" + id + "' не найден"));

        existingUser.setUsername(updatedUser.getUsername());
        existingUser.setAge(updatedUser.getAge());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setLastName(updatedUser.getLastName());

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        existingUser.setRoles(roles);
        userRepository.save(existingUser);
    }

    @Override
    public User findById(Long id) {
        return userRepository.findUserById(id);
    }

    @Override
    @Transactional
    public void createUserFromRest(User user) {
        userRepository.save(user);
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
