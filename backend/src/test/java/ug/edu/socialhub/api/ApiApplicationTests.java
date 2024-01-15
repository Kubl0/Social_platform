package ug.edu.socialhub.api;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import ug.edu.socialhub.api.service.ApiService;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class ApiApplicationTests {

	@Autowired
	private ApiService yourServiceClass;

	@Test
	void contextLoads() {
		assertNotNull(yourServiceClass, "The YourServiceClass bean should not be null");
	}

}