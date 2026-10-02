package com.jagan.healthcare.service;
import com.jagan.healthcare.dto.DoctorRequest; import com.jagan.healthcare.model.Doctor; import com.jagan.healthcare.repository.DoctorRepository; import org.springframework.stereotype.Service;
@Service
public class DoctorService {
    private final DoctorRepository repository;
    public DoctorService(DoctorRepository repository) { this.repository = repository; }

    public Doctor create(DoctorRequest r) {
        Doctor d = new Doctor();
        d.setName(r.getName());
        d.setSpecialty(r.getSpecialty());
        d.setHospitalName(r.getHospitalName());
        d.setConsultationFee(r.getConsultationFee());
        return repository.save(d);
    }

    public Doctor update(Long id, DoctorRequest r) {
        Doctor d = repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Doctor not found."));
        d.setName(r.getName());
        d.setSpecialty(r.getSpecialty());
        d.setHospitalName(r.getHospitalName());
        d.setConsultationFee(r.getConsultationFee());
        return repository.save(d);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) throw new IllegalArgumentException("Doctor not found.");
        repository.deleteById(id);
    }
}
