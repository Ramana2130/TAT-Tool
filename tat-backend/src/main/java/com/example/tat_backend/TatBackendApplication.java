package com.example.tat_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class TatBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(TatBackendApplication.class, args);
	}

}
