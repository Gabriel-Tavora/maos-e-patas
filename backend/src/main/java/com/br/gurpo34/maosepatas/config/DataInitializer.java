package com.br.gurpo34.maosepatas.config;

import com.br.gurpo34.maosepatas.entity.Administrador;
import com.br.gurpo34.maosepatas.repository.AdministradorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Carga inicial: cria o administrador padrão quando o banco ainda não tem nenhum.
 * Login: admin@maosepatas.com.br / admin123
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AdministradorRepository administradorRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (administradorRepository.count() > 0) {
            return;
        }
        Administrador admin = new Administrador();
        admin.setNome("Administrador");
        admin.setEmail("admin@maosepatas.com.br");
        admin.setSenha(passwordEncoder.encode("admin123"));
        administradorRepository.save(admin);
        log.info("Administrador padrão criado: admin@maosepatas.com.br / admin123");
    }
}
