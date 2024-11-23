package tn.pi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})



public class WebAppIotApplication {

    public static void main(String[] args) {
        SpringApplication.run(WebAppIotApplication.class, args);
    }

}
