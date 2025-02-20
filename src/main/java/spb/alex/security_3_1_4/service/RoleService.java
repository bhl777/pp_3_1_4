package spb.alex.security_3_1_4.service;

import spb.alex.security_3_1_4.model.Role;

import java.util.List;
import java.util.Set;

public interface RoleService {

    List<Role> getAllRoles();

    Set<Role> findRolesByIds(Set<Long> roleIds);
}
