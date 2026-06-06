# VendorBridge ServerCode Setup

Backend service for VendorBridge, built with Spring Boot, Spring Security, Spring Data JPA, MySQL, Thymeleaf email templates, and JWT authentication.

## Prerequisites

- Java 21
- MySQL 8 or compatible MySQL server
- Maven is optional because the project includes Maven Wrapper
- Docker is optional

## Project Structure

- `src/main/java/com/vendorbridge/controller` - REST controllers
- `src/main/java/com/vendorbridge/service` - business logic
- `src/main/java/com/vendorbridge/entity` - JPA entities
- `src/main/java/com/vendorbridge/dao` - Spring Data repositories
- `src/main/java/com/vendorbridge/dto` - request/response DTOs
- `src/main/resources/migrations/BaseTables.sql` - database schema
- `src/main/resources/templates` - email templates
- `src/main/resources/application.properties` - active profile
- `src/main/resources/application-dev.properties` - dev configuration

## Database Setup

Create the database:

```sql
CREATE DATABASE vendorbridge;
```

Then run:

```sql
ServerCode/src/main/resources/migrations/BaseTables.sql
```

The application uses:

```properties
spring.jpa.hibernate.ddl-auto=none
```

So tables must exist before starting the server.

## Configuration

Update `src/main/resources/application-dev.properties` for your local environment:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/vendorbridge
spring.datasource.username=<mysql-user>
spring.datasource.password=<mysql-password>
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=<mail-user>
spring.mail.password=<mail-app-password>

jwt.secret=<strong-secret>
frontend-url=http://localhost:5173
```

Do not commit real database, email, or JWT secrets.

## Run Locally

From `ServerCode`:

```powershell
.\mvnw.cmd spring-boot:run
```

On Linux/macOS:

```bash
./mvnw spring-boot:run
```

By default, Spring Boot starts on port `8080`.

## Build

From `ServerCode`:

```powershell
.\mvnw.cmd clean package
```

Build without tests:

```powershell
.\mvnw.cmd clean package -DskipTests
```

## Run With Docker

From `ServerCode`:

```powershell
docker compose up --build
```

The included `docker-compose.yml` maps:

```text
localhost:5000 -> container:8080
```

Make sure the container can reach the configured MySQL host in `application-dev.properties`.

## API Docs

Swagger/OpenAPI UI is available after startup at:

```text
http://localhost:8080/swagger-ui/index.html
```

If running through Docker Compose:

```text
http://localhost:5000/swagger-ui/index.html
```

## Main API Areas

- `/api/auth/**` - vendor registration, login, verification, password reset
- `/api/admin/**` - admin-only APIs
- `/api/rfq/**` - RFQ creation, approval flow, vendor RFQ listing
- `/api/quotation/**` - quotation submit/fetch/status APIs

## Common Commands

Compile:

```powershell
.\mvnw.cmd -q compile
```

Run tests:

```powershell
.\mvnw.cmd test
```

Clean target output:

```powershell
.\mvnw.cmd clean
```

## Notes

- The active profile is configured in `application.properties` as `dev`.
- The schema is intentionally kept in a single migration file: `BaseTables.sql`.
- If entity fields change, update `BaseTables.sql` in the same change.
- VendorBridge uses JWT bearer tokens. Protected APIs require an `Authorization: Bearer <token>` header.
