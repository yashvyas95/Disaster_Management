# Security Policy

## Supported Versions

We actively maintain security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| 1.0.x   | :x:                |

## Reporting a Vulnerability

The Disaster Management System team takes security issues seriously. We appreciate your efforts to disclose security vulnerabilities responsibly.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please send an email to: **Yash Vyas** at the project repository.

### What to Include

Please include the following information in your security report:

- **Description**: Detailed description of the vulnerability
- **Impact**: What an attacker could achieve by exploiting this vulnerability
- **Reproduction**: Step-by-step instructions to reproduce the issue
- **Environment**: 
  - Java version
  - Spring Boot version
  - Browser (for frontend issues)
  - Operating system
- **Proof of Concept**: Code or screenshots demonstrating the vulnerability
- **Suggested Fix**: If you have ideas for how to fix the issue

### Response Timeline

- **Initial Response**: Within 48 hours of report submission
- **Confirmation**: Within 5 business days
- **Resolution**: 
  - Critical: 7 days
  - High: 14 days
  - Medium: 30 days
  - Low: 60 days

### Vulnerability Classification

We use the Common Vulnerability Scoring System (CVSS) v3.1 to assess severity:

- **Critical (9.0-10.0)**: Immediate action required
- **High (7.0-8.9)**: Urgent fix needed
- **Medium (4.0-6.9)**: Important to address
- **Low (0.1-3.9)**: Monitor and plan fix

### Security Measures in Place

Our application implements multiple security layers:

#### Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- BCrypt password hashing (strength 12)
- Session timeout and management

#### Data Protection
- HTTPS-only communication in production
- Input validation and sanitization
- SQL injection prevention with parameterized queries
- XSS protection with Content Security Policy

#### Infrastructure Security
- Docker containerization
- Environment variable isolation
- Database connection pooling
- Redis session storage

#### API Security
- CORS configuration
- Rate limiting (planned)
- Request size limits
- Authentication required for all endpoints

### Responsible Disclosure

We believe in responsible disclosure and will work with security researchers to:

1. Understand and validate the reported vulnerability
2. Develop and test a fix
3. Release the security update
4. Publicly acknowledge your contribution (with your permission)

### Bug Bounty

Currently, we do not offer a formal bug bounty program. However, we greatly appreciate security researchers and will:

- Acknowledge your contribution in release notes
- Provide a letter of recommendation for your professional portfolio
- Consider future opportunities for collaboration

### Security Best Practices for Users

#### For Administrators
- Use strong, unique passwords
- Enable two-factor authentication when available
- Regularly update user permissions
- Monitor system logs for suspicious activity
- Keep the application updated

#### For Developers
- Always validate input data
- Use parameterized queries
- Implement proper error handling
- Keep dependencies updated
- Follow secure coding practices

#### For End Users
- Use strong passwords
- Log out when finished
- Report suspicious activity
- Keep browsers updated
- Use trusted networks

### Previous Security Issues

We maintain transparency about resolved security issues:

- No critical security issues have been reported to date
- All dependencies are regularly scanned for vulnerabilities
- Automated security testing is part of our CI/CD pipeline

### Security Updates

Security patches are distributed through:

1. **GitHub Releases**: Tagged releases with security notes
2. **Docker Hub**: Updated container images
3. **Email Notifications**: For registered administrators
4. **GitHub Security Advisories**: For public vulnerabilities

### Contact Information

For security-related inquiries:

- **Primary Contact**: Yash Vyas via project repository
- **Response Time**: 48 hours maximum
- **Encryption**: Available upon request

### Legal

This security policy is subject to our [Code of Conduct](CODE_OF_CONDUCT.md) and [Contributing Guidelines](CONTRIBUTING.md).

By reporting vulnerabilities, you agree to:
- Provide reasonable time to fix issues before public disclosure
- Not access or modify user data beyond what's necessary to demonstrate the vulnerability
- Act in good faith to avoid privacy violations and disruption to users

---

**Author**: Yash Vyas  
**Policy Version**: 1.0