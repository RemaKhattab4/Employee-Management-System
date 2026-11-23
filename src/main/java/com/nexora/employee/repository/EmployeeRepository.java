package com.nexora.employee.repository;

import com.nexora.employee.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    long countByStatusIgnoreCase(String status);
    @Query("SELECT e.department.name, COUNT(e) " +
            "FROM Employee e " +
            "WHERE e.department IS NOT NULL " +
            "GROUP BY e.department.name")
    List<Object[]> countEmployeesByDepartment();
}
