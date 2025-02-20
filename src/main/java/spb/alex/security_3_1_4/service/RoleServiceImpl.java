package spb.alex.security_3_1_4.service;

import org.springframework.stereotype.Service;
import spb.alex.security_3_1_4.model.Role;
import spb.alex.security_3_1_4.repository.RoleRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    public Set<Role> findRolesByIds(Set<Long> roleIds) {

        List<Role> roles = roleRepository.findAllById(roleIds);

        return new HashSet<>(roles);
    }
}
