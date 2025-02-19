package spb.alex.security_3_1_4.DTO;

import java.util.Set;

public class UserDTO {

    private String username;
    private String lastName;
    private int age;
    private String email;
    private String password;
    private String phone;
    private Set<Long> roleIds;

    public UserDTO() {
    }

    public UserDTO(String username, String lastName, int age, String email, String password, String phone, Set<Long> roleIds) {
        this.username = username;
        this.lastName = lastName;
        this.age = age;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.roleIds = roleIds;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Set<Long> getRoleIds() {
        return roleIds;
    }

    public void setRoleIds(Set<Long> roleIds) {
        this.roleIds = roleIds;
    }
}
