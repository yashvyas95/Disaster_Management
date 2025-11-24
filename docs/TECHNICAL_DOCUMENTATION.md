# Disaster Management System V2 - Technical Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Backend Architecture](#backend-architecture)
5. [Frontend Architecture](#frontend-architecture)
6. [Database Schema](#database-schema)
7. [API Documentation](#api-documentation)
8. [Security Implementation](#security-implementation)
9. [Real-time Features](#real-time-features)
10. [Deployment](#deployment)
11. [Configuration](#configuration)

---

## System Overview

The Disaster Management System V2 is a comprehensive, real-time emergency response coordination platform built with modern enterprise-grade technologies. The system facilitates efficient communication between victims, emergency dispatchers, rescue teams, and department heads.

### Core Capabilities
- **Real-time Emergency Request Management**: Submit, track, and resolve emergency requests
- **Role-Based Access Control**: 5 distinct user roles with specific permissions
- **Live Communication**: WebSocket-based chat system with typing indicators
- **Analytics Dashboard**: Real-time statistics and visualizations
- **Team Coordination**: Rescue team assignment and status tracking
- **Multi-Department Support**: Fire, Police, Medical, Accident departments

### System Metrics
- **Backend**: 9 Controllers, 51 REST Endpoints, 5 Entities
- **Frontend**: 35 Components, 9 Services, 3 Role-Specific Dashboards
- **Database**: 7 Tables with optimized indexing
- **Performance**: Stateless architecture with Redis caching

---

## Architecture

### High-Level Architecture

```
┌─────────────┐
│   Browser   │
│  (Angular)  │
└──────┬──────┘
       │ HTTP/WS
       ↓
┌──────────────────┐
│  Nginx (Port 80) │
└────────┬─────────┘
         │
         ↓
┌──────────────────────────────┐
│  Spring Boot Backend (8080)  │
│  ├─ REST API Controllers     │
│  ├─ WebSocket (STOMP)        │
│  ├─ JWT Authentication       │
│  └─ Business Logic           │
└────────┬─────────────────────┘
         │
    ┌────┴────┐
    ↓         ↓
┌─────────┐  ┌──────────┐
│  MySQL  │  │  Redis   │
│  (3306) │  │  (6379)  │
└─────────┘  └──────────┘
```

### Component Architecture

**Three-Tier Architecture:**
1. **Presentation Layer**: Angular 18 SPA with Bootstrap 5
2. **Business Logic Layer**: Spring Boot 3.2.0 with service-oriented design
3. **Data Layer**: MySQL 8.0 with Hibernate JPA + Redis for caching

---

## Technology Stack

### Backend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 17 (LTS) | Core programming language |
| Spring Boot | 3.2.0 | Application framework |
| Spring Security | 6.x | Authentication & authorization |
| Spring WebSocket | Latest | Real-time communication |
| Spring Data JPA | Latest | Database abstraction |
| Hibernate | 6.x | ORM framework |
| MySQL Connector | 8.0.33 | Database driver |
| Redis | 7.4.7 | Caching & session management |
| Flyway | Latest | Database migration |
| Lombok | Latest | Boilerplate reduction |
| JWT (JJWT) | 0.12.3 | Token-based authentication |
| SpringDoc OpenAPI | 2.3.0 | API documentation |
| SockJS | Latest | WebSocket fallback |
| STOMP | Latest | WebSocket messaging protocol |

### Frontend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 18.2.8 | SPA framework |
| TypeScript | 5.5.4 | Type-safe JavaScript |
| RxJS | 7.8.0 | Reactive programming |
| Bootstrap | 5.3.x | UI framework |
| Chart.js | 4.4.1 | Data visualization |
| ngx-toastr | 18.0.0 | Toast notifications |
| SockJS Client | 1.6.1 | WebSocket client |
| STOMP.js | 2.3.3 | WebSocket messaging |

### Infrastructure
| Technology | Version | Purpose |
|------------|---------|---------|
| Docker | Latest | Containerization |
| Docker Compose | Latest | Multi-container orchestration |
| Nginx | 1.17.1-alpine | Web server & reverse proxy |
| MySQL | 8.0 | Relational database |
| Redis | 7.4.7-alpine | In-memory cache |

---

## Backend Architecture

### Layer Structure

```
com.disaster
├── config/                 # Configuration classes
│   ├── SecurityConfig     # Spring Security setup
│   ├── WebSocketConfig    # WebSocket configuration
│   └── SwaggerConfig      # API documentation
├── controller/            # REST API endpoints
│   ├── AuthController     # Authentication endpoints
│   ├── EmergencyRequestController
│   ├── RescueTeamController
│   ├── DepartmentController
│   ├── DashboardController
│   ├── ChatController     # WebSocket endpoints
│   └── MessageController
├── service/               # Business logic
│   ├── AuthService
│   ├── EmergencyRequestService
│   ├── RescueTeamService
│   ├── DashboardService
│   └── CustomUserDetailsService
├── repository/            # Data access layer
│   ├── UserRepository
│   ├── EmergencyRequestRepository
│   ├── RescueTeamRepository
│   ├── DepartmentRepository
│   └── MessageRepository
├── entity/                # Domain models
│   ├── User
│   ├── EmergencyRequest
│   ├── RescueTeam
│   ├── Department
│   └── Message
├── dto/                   # Data transfer objects
│   ├── LoginRequest
│   ├── SignupRequest
│   ├── DashboardStatsDto
│   └── EmergencyRequestDto
├── exception/             # Exception handling
│   ├── GlobalExceptionHandler
│   ├── ResourceNotFoundException
│   └── UserAlreadyExistsException
└── security/              # Security components
    ├── JwtProvider
    ├── JwtAuthenticationFilter
    └── CustomUserDetailsService
```

### Design Patterns Implemented

1. **Repository Pattern**: Data access abstraction
2. **Service Layer Pattern**: Business logic separation
3. **DTO Pattern**: Data transfer optimization
4. **Builder Pattern**: Immutable object construction (Lombok)
5. **Dependency Injection**: Spring IoC container
6. **RESTful Architecture**: Stateless API design

### Key Backend Components

#### 1. Authentication Flow
```java
Client → AuthController → AuthService → JwtProvider → Response
         ↓
    UserRepository
         ↓
      Database
```

#### 2. Emergency Request Processing
```java
Client → EmergencyRequestController → RequestService
         ↓
    Repository Layer
         ↓
    MySQL Database
         ↓
    WebSocket Broadcast (optional)
```

#### 3. WebSocket Communication
```java
Client → WebSocketConfig → ChatController → MessageService
         ↓
    Redis PubSub
         ↓
    Broadcast to Subscribers
```

---

## Frontend Architecture

### Module Structure

```
src/app/
├── core/                  # Core functionality
│   ├── guards/           # Route guards
│   │   └── auth.guard.ts
│   └── interceptors/     # HTTP interceptors
│       ├── token.interceptor.ts
│       ├── error.interceptor.ts
│       ├── loading.interceptor.ts
│       └── cache.interceptor.ts
├── dashboards/           # Role-specific dashboards
│   ├── admin-dashboard/
│   ├── department-dashboard/
│   └── victim-dashboard/
├── services/             # API services
│   ├── auth.service.ts
│   ├── dashboard.service.ts
│   ├── request.service.ts
│   ├── rescue-team.service.ts
│   └── chat.service.ts
├── model/                # TypeScript interfaces
│   ├── User.ts
│   ├── EmergencyRequest.ts
│   └── RescueTeam.ts
├── login/                # Authentication
├── signup/               # User registration
├── chat-lobby/           # Real-time chat
└── request-landing/      # Emergency submission
```

### State Management

- **LocalStorage**: JWT token, user info
- **RxJS BehaviorSubjects**: Real-time data streams
- **Services**: Centralized state for shared data

### Routing Strategy

```typescript
Routes:
/ (Landing Page)
/login (Public)
/signup (Public)
/request-landing (Public - Emergency submission)

/admin-dashboard (ROLE_ADMIN)
/dept-dashboard (ROLE_DEPARTMENT_HEAD, ROLE_DISPATCHER)
/victim-dashboard (ROLE_VICTIM)
/chat-lobby (Authenticated)
```

### Component Communication

1. **Parent-Child**: `@Input()` and `@Output()`
2. **Service-Based**: Shared services with observables
3. **WebSocket**: Real-time event broadcasting

---

## Database Schema

### Entity Relationship Diagram

```
users
├── id (PK)
├── username
├── password
├── email
├── role
└── created_by_id (FK → users)

departments
├── id (PK)
├── name
├── description
└── head_id (FK → users)

rescue_teams
├── id (PK)
├── name
├── status (AVAILABLE/BUSY/UNAVAILABLE)
├── member_count
├── department_id (FK → departments)
└── capabilities (ENUM SET)

emergency_requests
├── id (PK)
├── victim_name
├── victim_phone
├── location
├── latitude
├── longitude
├── emergency_type
├── priority (LOW/MEDIUM/HIGH/CRITICAL)
├── status (PENDING/ASSIGNED/EN_ROUTE/ON_SCENE/RESOLVED/CANCELLED)
├── description
├── created_at
├── resolved_at
├── created_by_id (FK → users)
└── assigned_team_id (FK → rescue_teams)

messages
├── id (PK)
├── content
├── sender_id (FK → users)
├── request_id (FK → emergency_requests)
├── timestamp
└── is_read
```

### Key Indexes

```sql
-- Performance optimization
CREATE INDEX idx_request_status ON emergency_requests(status);
CREATE INDEX idx_request_created ON emergency_requests(created_at);
CREATE INDEX idx_request_priority ON emergency_requests(priority);
CREATE INDEX idx_team_status ON rescue_teams(status);
CREATE INDEX idx_message_request ON messages(request_id);
```

### Database Constraints

- **Foreign Keys**: Cascade on update, restrict on delete
- **NOT NULL**: Required fields enforced at DB level
- **ENUM Types**: Emergency type, priority, status, team status
- **Timestamps**: Automatic creation and update tracking

---

## API Documentation

### Authentication Endpoints

#### POST /api/auth/signup
Register a new user account

**Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "ROLE_VICTIM"
}
```

**Response (200):**
```json
{
  "message": "User registered successfully",
  "username": "john_doe"
}
```

#### POST /api/auth/login
Authenticate and receive JWT token

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "username": "admin",
  "role": "ROLE_ADMIN",
  "email": "admin@disaster.com"
}
```

### Emergency Request Endpoints

#### POST /api/requests/emergency
Submit new emergency request

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "victimName": "Jane Smith",
  "victimPhone": "555-1234",
  "location": "123 Main St, Downtown",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "emergencyType": "FIRE",
  "priority": "HIGH",
  "description": "Building fire on 3rd floor"
}
```

**Response (201):**
```json
{
  "id": 42,
  "status": "PENDING",
  "createdAt": "2025-11-23T10:30:00Z",
  ...
}
```

#### GET /api/requests/active
Get all active emergency requests (paginated)

**Query Parameters:**
- `page`: Page number (default: 0)
- `size`: Page size (default: 10, max: 100)

**Response (200):**
```json
{
  "content": [...],
  "totalElements": 61,
  "totalPages": 7,
  "size": 10,
  "number": 0
}
```

#### POST /api/requests/{id}/assign/{teamId}
Assign rescue team to request

**Roles Required:** ADMIN, DEPARTMENT_HEAD, DISPATCHER

**Response (200):**
```json
{
  "id": 42,
  "assignedTeam": {
    "id": 3,
    "name": "Fire Squad Alpha"
  },
  "status": "ASSIGNED"
}
```

### Dashboard Endpoints

#### GET /api/dashboard/stats
Get comprehensive system statistics

**Roles Required:** ADMIN, DEPARTMENT_HEAD

**Response (200):**
```json
{
  "totalRequests": 61,
  "pendingRequests": 31,
  "activeRequests": 18,
  "resolvedRequests": 12,
  "totalTeams": 15,
  "availableTeams": 8,
  "busyTeams": 7,
  "requestsByStatus": {
    "PENDING": 31,
    "ASSIGNED": 10,
    "EN_ROUTE": 5,
    "ON_SCENE": 3,
    "RESOLVED": 12
  },
  "requestsByPriority": {
    "LOW": 5,
    "MEDIUM": 18,
    "HIGH": 25,
    "CRITICAL": 13
  }
}
```

### WebSocket Endpoints

#### STOMP /app/chat.send
Send chat message

**Payload:**
```json
{
  "content": "Team en route to location",
  "requestId": 42
}
```

#### Subscribe /topic/messages/{requestId}
Receive real-time messages for specific request

**Server Broadcasts:**
```json
{
  "id": 123,
  "content": "Team has arrived",
  "sender": {
    "id": 5,
    "username": "rescue_team_1"
  },
  "timestamp": "2025-11-23T10:35:00Z"
}
```

---

## Security Implementation

### Authentication Mechanism

**JWT (JSON Web Tokens):**
- Algorithm: HS512
- Token Expiration: 24 hours
- Refresh Token: Not implemented (future enhancement)

```java
// Token Generation
String token = Jwts.builder()
    .setSubject(username)
    .setIssuedAt(new Date())
    .setExpiration(new Date(System.currentTimeMillis() + 86400000))
    .signWith(SignatureAlgorithm.HS512, jwtSecret)
    .compact();
```

### Authorization (Role-Based Access Control)

**5 User Roles:**
1. `ROLE_ADMIN`: Full system access
2. `ROLE_DEPARTMENT_HEAD`: Department management
3. `ROLE_DISPATCHER`: Request assignment
4. `ROLE_RESCUE_TEAM_MEMBER`: Field operations
5. `ROLE_VICTIM`: Emergency submission only

**Method-Level Security:**
```java
@PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_HEAD')")
public ResponseEntity<DashboardStats> getDashboardStats() {
    // Only admins and department heads can access
}
```

### Security Configurations

```java
@Configuration
public class SecurityConfig {
    
    // Public endpoints
    .requestMatchers("/api/auth/**").permitAll()
    .requestMatchers("/api/requests/emergency").permitAll()
    
    // Protected endpoints
    .requestMatchers("/api/admin/**").hasRole("ADMIN")
    .requestMatchers("/api/dashboard/stats").hasAnyRole("ADMIN", "DEPARTMENT_HEAD")
    
    // WebSocket security
    .requestMatchers("/ws/**").authenticated()
}
```

### CORS Configuration

```java
@CrossOrigin(origins = "http://localhost:4200")
// Allows Angular dev server requests
```

### Password Security

**Current:** Plain text (development only)
**Production Requirement:** BCrypt with strength 12

```java
// TODO: Enable for production
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12);
}
```

---

## Real-time Features

### WebSocket Architecture

**Protocol Stack:**
- **Transport**: WebSocket (with SockJS fallback)
- **Messaging**: STOMP (Simple Text Oriented Messaging Protocol)
- **Broker**: In-memory broker (Spring)

### Chat System Implementation

**Frontend (Angular):**
```typescript
// Connect to WebSocket
this.stompClient = Stomp.over(() => new SockJS('http://localhost:8080/ws'));

// Subscribe to messages
this.stompClient.subscribe('/topic/messages/' + requestId, (message) => {
    this.handleIncomingMessage(JSON.parse(message.body));
});

// Send message
this.stompClient.send('/app/chat.send', {}, JSON.stringify(messageDto));
```

**Backend (Spring Boot):**
```java
@MessageMapping("/chat.send")
@SendTo("/topic/messages/{requestId}")
public Message sendMessage(@Payload MessageDto messageDto) {
    return messageService.saveAndBroadcast(messageDto);
}
```

### Real-time Features List

1. **Live Chat**: Team-victim communication per request
2. **Typing Indicators**: Show when user is typing
3. **Status Updates**: Broadcast request status changes
4. **Dashboard Refresh**: Auto-update statistics
5. **Notifications**: Real-time toast alerts

---

## Deployment

### Docker Compose Architecture

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    ports: ["3306:3306"]
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: disaster_management_v2
    volumes: [mysql-data:/var/lib/mysql]
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7.4.7-alpine
    ports: ["6379:6379"]
    command: redis-server --maxmemory 256mb

  backend:
    build: ./backend
    ports: ["8080:8080"]
    depends_on: [mysql, redis]
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/disaster_management_v2
      SPRING_REDIS_HOST: redis

  frontend:
    build: ./frontend
    ports: ["4200:80"]
    depends_on: [backend]
```

### Build & Deploy Process

```bash
# 1. Build all containers
docker-compose build

# 2. Start services
docker-compose up -d

# 3. Verify deployment
docker ps

# 4. Check logs
docker logs disaster-backend --tail 100
```

### Health Monitoring

```bash
# Backend health
curl http://localhost:8080/actuator/health

# Frontend status
curl http://localhost:4200

# Database connection
docker exec disaster-mysql mysql -uroot -prootpassword -e "SHOW DATABASES;"
```

---

## Configuration

### Backend Configuration (application.yml)

```yaml
spring:
  datasource:
    url: jdbc:mysql://mysql:3306/disaster_management_v2
    username: root
    password: rootpassword
    driver-class-name: com.mysql.cj.jdbc.Driver
    
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
        
  redis:
    host: redis
    port: 6379
    
  flyway:
    enabled: true
    baseline-on-migrate: true
    
server:
  port: 8080
  
jwt:
  secret: DisasterManagementSecretKey2025
  expiration: 86400000

springdoc:
  api-docs:
    path: /api-docs
  swagger-ui:
    path: /swagger-ui.html
```

### Frontend Configuration (environment.ts)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  websocketUrl: 'http://localhost:8080/ws'
};
```

### Environment Variables

```bash
# Backend
SPRING_PROFILES_ACTIVE=dev
MYSQL_HOST=mysql
MYSQL_PORT=3306
REDIS_HOST=redis
JWT_SECRET=YourSecretKey

# Frontend
API_URL=http://localhost:8080/api
```

---

## Performance Considerations

### Caching Strategy
- **Redis**: Session data, frequently accessed lookups
- **HTTP Cache**: Static resources with ETags
- **Browser Cache**: 7-day cache for assets

### Database Optimization
- **Indexes**: All foreign keys and frequently queried fields
- **Connection Pooling**: HikariCP (default 10 connections)
- **Query Optimization**: JPA criteria queries, no N+1 problems

### Frontend Optimization
- **Lazy Loading**: Route-based code splitting
- **AOT Compilation**: Production builds
- **Tree Shaking**: Unused code elimination
- **Minification**: JS/CSS compression

---

## Monitoring & Logging

### Backend Logging
```java
// SLF4J with Logback
logger.info("Emergency request {} assigned to team {}", requestId, teamId);
logger.error("Failed to process request", exception);
```

### Frontend Error Handling
```typescript
// Global error interceptor
catchError((error: HttpErrorResponse) => {
  this.toastr.error(error.message);
  return throwError(error);
})
```

### Metrics (Spring Boot Actuator)
- `/actuator/health`: Application health
- `/actuator/metrics`: Performance metrics
- `/actuator/info`: Build information

---

## Maintenance & Support

### Backup Strategy
```bash
# Database backup
docker exec disaster-mysql mysqldump -uroot -prootpassword disaster_management_v2 > backup.sql

# Restore
docker exec -i disaster-mysql mysql -uroot -prootpassword disaster_management_v2 < backup.sql
```

### Update Procedures
1. Pull latest code
2. Run tests
3. Build new images
4. Deploy with zero downtime (blue-green)
5. Verify functionality
6. Rollback if needed

---

## Appendix

### Useful Commands

```bash
# Restart specific service
docker-compose restart backend

# View real-time logs
docker-compose logs -f backend

# Execute SQL
docker exec -it disaster-mysql mysql -uroot -prootpassword disaster_management_v2

# Clean rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Troubleshooting Common Issues

**Issue: JWT token expired**
- Solution: Re-login to get new token

**Issue: WebSocket connection failed**
- Solution: Check CORS settings, verify backend is running

**Issue: Database connection refused**
- Solution: Wait for MySQL healthcheck, verify credentials

---

**Document Version**: 1.0  
**Author**: Yash Vyas  
**Classification**: Internal Use
