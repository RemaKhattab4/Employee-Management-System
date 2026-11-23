
package com.nexora.employee.dashboard;

import com.nexora.employee.repository.EmployeeRepository;
import com.nexora.employee.department.DepartmentRepository;
import com.nexora.employee.attendance.AttendanceRepository;

import org.springframework.web.bind.annotation.*;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final AttendanceRepository attendanceRepository;

    public DashboardController(
            EmployeeRepository employeeRepository,
            DepartmentRepository departmentRepository,
            AttendanceRepository attendanceRepository) {

        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.attendanceRepository = attendanceRepository;
    }

    @GetMapping("/statistics")
    public Map<String, Long> getStatistics() {

        return Map.of(
                "totalEmployees", employeeRepository.count(),
                "activeEmployees", employeeRepository.countByStatusIgnoreCase("Active"),
                "totalDepartments", departmentRepository.count(),
                "totalAttendanceRecords", attendanceRepository.count()
        );
    }

    @GetMapping("/department-distribution")
    public List<Map<String, Object>> getDepartmentDistribution() {

        return employeeRepository.countEmployeesByDepartment()
                .stream()
                .map(row -> Map.<String, Object>of(
                        "department", row[0],
                        "count", row[1]
                ))
                .toList();
    }
}
