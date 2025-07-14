# Contributing to Book Club

Thank you for your interest in contributing to the Book Club application! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/Book-Club.git
   cd Book-Club
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```
5. **Set up the database** using the queries in `queries.sql`

## Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the coding standards below

3. **Test your changes**:
   ```bash
   npm test
   node --check index.js
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add: description of your changes"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

## Coding Standards

### JavaScript/Node.js
- Use ES6+ features where appropriate
- Use meaningful variable and function names
- Add comments for complex logic
- Follow the existing code style
- Use `const` and `let` instead of `var`
- Use template literals for string interpolation
- Handle errors properly with try-catch blocks

### Database
- Use parameterized queries to prevent SQL injection
- Handle database errors gracefully
- Use transactions for multi-step operations
- Include appropriate indexes for performance

### Frontend (EJS/CSS)
- Use semantic HTML
- Keep CSS organized and avoid inline styles where possible
- Ensure responsive design
- Add proper alt text for images
- Use proper form validation

## Types of Contributions

### Bug Fixes
- Fix security vulnerabilities
- Correct functionality issues
- Improve error handling
- Fix responsive design issues

### Features
- Add new functionality
- Improve existing features
- Enhance user experience
- Add accessibility features

### Documentation
- Improve README
- Add code comments
- Update API documentation
- Create user guides

### Testing
- Add unit tests
- Add integration tests
- Improve test coverage
- Add end-to-end tests

## Pull Request Guidelines

1. **Clear description**: Explain what your PR does and why
2. **Reference issues**: Link to any related GitHub issues
3. **Small, focused changes**: Keep PRs small and focused on one feature/fix
4. **Tests**: Include tests for new functionality
5. **Documentation**: Update documentation if needed
6. **Code review**: Be responsive to feedback and make requested changes

## Code Review Process

1. All PRs require review before merging
2. Reviewers will check for:
   - Code quality and style
   - Security issues
   - Performance implications
   - Test coverage
   - Documentation updates
3. Address feedback promptly
4. Keep discussions professional and constructive

## Security

- Never commit sensitive data (passwords, API keys, etc.)
- Use environment variables for configuration
- Follow security best practices
- Report security vulnerabilities privately

## Performance

- Optimize database queries
- Minimize external API calls
- Use appropriate caching strategies
- Consider scalability implications

## Testing

- Write tests for new functionality
- Ensure existing tests still pass
- Test edge cases and error conditions
- Include both positive and negative test cases

## Documentation

- Update README for new features
- Add inline comments for complex code
- Update API documentation
- Include setup instructions for new dependencies

## Questions?

If you have questions about contributing:
1. Check existing issues and PRs
2. Create a new issue with the `question` label
3. Reach out to maintainers

## Code of Conduct

Please be respectful and professional in all interactions. We want to maintain a welcoming environment for all contributors.

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (ISC License).

Thank you for contributing to Book Club! 🎉