# Contributing to Disaster Management System V2

First off, thank you for considering contributing to the Disaster Management System! It's people like you that make this project better for everyone.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Testing Requirements](#testing-requirements)

---

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title**: Descriptive summary of the issue
- **Steps to reproduce**: Detailed steps to replicate the bug
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Screenshots**: If applicable
- **Environment**: OS, browser, Java/Node versions
- **Logs**: Relevant error messages or stack traces

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- Use a clear and descriptive title
- Provide a detailed description of the proposed feature
- Explain why this enhancement would be useful
- List any alternative solutions you've considered

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:

- `good first issue` - Simple issues for newcomers
- `help wanted` - Issues where we need community help
- `documentation` - Documentation improvements

## Development Setup

### Prerequisites

- **Java 17** or higher
- **Node.js 18+** and npm
- **Maven 3.8+**
- **MySQL 8.0+**
- **Redis 7+** (optional for caching)
- **Docker** (optional for containerized setup)

### Quick Start

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR-USERNAME/Disaster_Management.git
   cd Disaster_Management
   ```

2. **Backend Setup**
   ```bash
   cd backend
   cp src/main/resources/application.yml.example src/main/resources/application.yml
   # Edit application.yml with your database credentials
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   # Application runs on http://localhost:4200
   ```

4. **Database Setup**
   ```sql
   CREATE DATABASE disaster_management_v2;
   -- Flyway migrations will run automatically on startup
   ```

### Using Docker (Recommended)

```bash
docker-compose up -d
```

Access the application at `http://localhost:4200`

## Coding Standards

### Java/Spring Boot

- Follow **Google Java Style Guide**
- Use **Lombok** to reduce boilerplate
- Write **JavaDoc** for public methods
- Keep classes focused (Single Responsibility Principle)
- Use meaningful variable and method names

**Example:**
```java
/**
 * Creates a new emergency request.
 *
 * @param requestDto The request details
 * @param username The victim's username
 * @return Created request with assigned ID
 * @throws UserNotFoundException if victim doesn't exist
 */
@Transactional
public EmergencyRequestDTO createRequest(
    EmergencyRequestDTO requestDto, 
    String username
) {
    // Implementation
}
```

### TypeScript/Angular

- Follow **Angular Style Guide**
- Use **strict TypeScript** configuration
- Implement **OnDestroy** for components with subscriptions
- Use **async pipe** where possible
- Keep components under 200 lines

**Example:**
```typescript
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    this.dataService.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.data = data);
  }
}
```

### General Guidelines

- **DRY**: Don't Repeat Yourself
- **KISS**: Keep It Simple, Stupid
- **SOLID** principles
- Write self-documenting code
- Comment complex logic only
- Keep functions small (< 50 lines)

## Pull Request Process

### Before Submitting

1. **Update documentation** for any changed functionality
2. **Add/update tests** - Maintain 75%+ code coverage
3. **Run all tests** locally and ensure they pass
4. **Follow commit message conventions** (see below)
5. **Rebase** on latest `main` branch

### Commit Message Format

Use conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no logic change)
- `refactor`: Code restructuring
- `test`: Adding/updating tests
- `chore`: Build process, dependencies

**Example:**
```
feat(auth): implement refresh token rotation

- Add refresh token to authentication response
- Implement token rotation on refresh
- Add Redis storage for refresh tokens
- Update security configuration

Closes #123
```

### PR Template

When creating a PR:

- Fill out the pull request template completely
- Link related issues
- Add screenshots for UI changes
- Request review from relevant maintainers
- Ensure CI checks pass

### Review Process

1. At least one maintainer must approve
2. All CI checks must pass
3. Code coverage must not decrease
4. No merge conflicts
5. Follows coding standards

## Issue Guidelines

### Issue Titles

- ✅ **Good**: `[Bug] JWT token expires before refresh on slow networks`
- ❌ **Bad**: `Login problem`

### Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Documentation improvements
- `question`: Further information is requested
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention needed
- `priority: high/medium/low`: Issue priority

## Testing Requirements

### Unit Tests

- Write unit tests for all business logic
- Use **JUnit 5** for Java
- Use **Jasmine/Karma** for Angular
- Maintain **75%+ code coverage**

**Backend Example:**
```java
@Test
void shouldCreateEmergencyRequest() {
    // Given
    EmergencyRequestDTO dto = createTestRequestDto();
    when(userRepository.findByUsername(anyString()))
        .thenReturn(Optional.of(testUser));

    // When
    EmergencyRequestDTO result = requestService.createRequest(dto, "victim1");

    // Then
    assertNotNull(result.getId());
    assertEquals("PENDING", result.getStatus());
    verify(requestRepository).save(any());
}
```

### Integration Tests

- Test API endpoints end-to-end
- Use **TestContainers** for database tests
- Mock external dependencies

### E2E Tests

- Test critical user flows
- Use **Protractor** or **Cypress**
- Cover main user journeys

## Branch Naming

- `feature/short-description` - New features
- `bugfix/short-description` - Bug fixes
- `hotfix/short-description` - Urgent production fixes
- `docs/short-description` - Documentation updates

## Getting Help

- 💬 **Discussions**: Use GitHub Discussions for questions
- 🐛 **Issues**: Report bugs via GitHub Issues
- 📧 **Email**: For security issues, see [SECURITY.md](SECURITY.md)

## Recognition

Contributors will be recognized in:
- GitHub Contributors page
- Release notes
- README.md (for significant contributions)

---

Thank you for contributing! 🎉

*This guide is adapted from open-source best practices and is subject to updates.*
