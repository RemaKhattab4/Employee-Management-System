
package com.nexora.employee.attendance;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping
    public List<Attendance> getAllAttendance() {
        return attendanceService.getAllAttendance();
    }

    @GetMapping("/employee/{employeeId}")
    public List<Attendance> getEmployeeAttendance(
            @PathVariable Long employeeId) {
        return attendanceService.getEmployeeAttendance(employeeId);
    }

    @PostMapping
    public Attendance addAttendance(@RequestBody Attendance attendance) {
        return attendanceService.addAttendance(attendance);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttendance(@PathVariable Long id) {
        attendanceService.deleteAttendance(id);
        return ResponseEntity.noContent().build();
    }
}
