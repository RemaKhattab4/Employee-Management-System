
package com.nexora.employee.department;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));
    }

    public Department addDepartment(Department department) {
        if (departmentRepository.existsByNameIgnoreCase(department.getName())) {
            throw new RuntimeException("Department already exists");
        }

        return departmentRepository.save(department);
    }

    public Department updateDepartment(Long id, Department department) {
        Department existing = getDepartmentById(id);

        existing.setName(department.getName());
        existing.setDescription(department.getDescription());

        return departmentRepository.save(existing);
    }

    public void deleteDepartment(Long id) {
        departmentRepository.deleteById(id);
    }
}
