package com.jagan.healthcare.service;
import com.jagan.healthcare.dto.HospitalRequest; import com.jagan.healthcare.model.Hospital; import com.jagan.healthcare.repository.HospitalRepository; import org.springframework.stereotype.Service;
@Service
public class HospitalService {
    private final HospitalRepository repository;
    public HospitalService(HospitalRepository repository) { this.repository = repository; }

    public Hospital create(HospitalRequest r) {
        Hospital h = new Hospital();
        h.setName(r.getName());
        h.setCity(r.getCity());
        h.setArea(r.getArea());
        h.setAddress(r.getAddress());
        h.setPhone(r.getPhone());
        h.setSpecialties(r.getSpecialties());
        return repository.save(h);
    }

    public Hospital update(Long id, HospitalRequest r) {
        Hospital h = repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Hospital not found."));
        h.setName(r.getName());
        h.setCity(r.getCity());
        h.setArea(r.getArea());
        h.setAddress(r.getAddress());
        h.setPhone(r.getPhone());
        h.setSpecialties(r.getSpecialties());
        return repository.save(h);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) throw new IllegalArgumentException("Hospital not found.");
        repository.deleteById(id);
    }
}
