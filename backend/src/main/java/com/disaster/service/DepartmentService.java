package com.disaster.service;

import com.disaster.entity.Department;
import com.disaster.exception.ResourceNotFoundException;
import com.disaster.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for managing departments
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    /**
     * Get department by ID
     */
    @Transactional(readOnly = true)
    public Department getById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + id));
    }

    /**
     * Get all departments
     */
    @Transactional(readOnly = true)
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    /**
     * Get all active departments
     */
    @Transactional(readOnly = true)
    public List<Department> getActiveDepartments() {
        return departmentRepository.findAllActive();
    }

    /**
     * Get department by name
     */
    @Transactional(readOnly = true)
    public Department getByName(String name) {
        return departmentRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + name));
    }

    /**
     * Create new department
     */
    @Transactional
    public Department createDepartment(Department department) {
        log.info("Creating department: {}", department.getName());

        if (departmentRepository.existsByName(department.getName())) {
            throw new IllegalArgumentException("Department already exists: " + department.getName());
        }

        return departmentRepository.save(department);
    }

    /**
     * Update department
     */
    @Transactional
    public Department updateDepartment(Long id, Department updatedDepartment) {
        Department existing = getById(id);

        existing.setName(updatedDepartment.getName());
        existing.setDescription(updatedDepartment.getDescription());
        existing.setContactNumber(updatedDepartment.getContactNumber());
        existing.setAddress(updatedDepartment.getAddress());
        existing.setActive(updatedDepartment.getActive());

        return departmentRepository.save(existing);
    }

    /**
     * Deactivate department (soft delete)
     */
    @Transactional
    public Department deactivateDepartment(Long id) {
        Department department = getById(id);
        department.setActive(false);
        return departmentRepository.save(department);
    }

    /**
     * Delete department (hard delete)
     */
    @Transactional
    public void deleteDepartment(Long id) {
        Department department = getById(id);
        
        if (!department.getStaff().isEmpty() || !department.getRescueTeams().isEmpty()) {
            throw new IllegalStateException(
                "Cannot delete department with associated staff or teams");
        }
        
        departmentRepository.delete(department);
        log.info("Deleted department: {}", id);
    }
}
