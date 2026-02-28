# Contributing to Product Discovery Hub

Thank you for your interest in contributing! This document provides guidelines for contributing to the Product Discovery Hub project.

## 🤝 How to Contribute

### Reporting Issues

- Use the GitHub Issues tab to report bugs
- Provide detailed information about the issue
- Include steps to reproduce
- Add screenshots if applicable

### Suggesting Features

- Open a GitHub Issue with the "feature request" label
- Describe the feature and its use case
- Explain why it would be valuable

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the code style guidelines
   - Add tests if applicable
   - Update documentation

4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Provide a clear description
   - Reference related issues
   - Wait for review

## 📝 Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper types, avoid `any`
- Use meaningful variable names
- Add JSDoc comments for public functions

Example:
```typescript
/**
 * Fetches products from the database with filters
 * @param params - Search and filter parameters
 * @returns Promise with products and pagination info
 */
export async function getProducts(params: SearchParams) {
  // Implementation
}
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop types

Example:
```typescript
interface ProductCardProps {
  product: Product
  onVote?: (productId: string) => void
}

export function ProductCard({ product, onVote }: ProductCardProps) {
  // Implementation
}
```

### File Organization

```
src/
├── app/              # Next.js pages and API routes
├── components/       # Reusable UI components
├── lib/             # Utility functions and helpers
├── types/           # TypeScript type definitions
└── utils/           # Helper utilities
```

### Naming Conventions

- **Files**: `kebab-case.tsx` (e.g., `product-card.tsx`)
- **Components**: `PascalCase` (e.g., `ProductCard`)
- **Functions**: `camelCase` (e.g., `getProducts`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)
- **Types/Interfaces**: `PascalCase` (e.g., `ProductProps`)

## 🧪 Testing

- Write tests for new features
- Ensure existing tests pass
- Aim for high code coverage

Run tests:
```bash
npm test
```

## 📚 Documentation

- Update README.md if needed
- Add JSDoc comments for functions
- Update API documentation for API changes
- Include examples in documentation

## 🚀 Development Workflow

1. **Setup development environment**
   ```bash
   npm install
   cp .env.example .env
   npm run prisma:migrate
   npm run dev
   ```

2. **Make changes**
   - Write code
   - Test locally
   - Commit frequently

3. **Before submitting PR**
   ```bash
   npm run lint
   npm run build
   npm test
   ```

## 📋 Commit Message Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add product voting system
fix: resolve database connection issue
docs: update API documentation
```

## 🎨 Design Guidelines

- Follow the existing design system
- Use Tailwind CSS classes
- Ensure responsive design
- Test on multiple browsers
- Maintain accessibility standards (WCAG 2.1 AA)

## 🔒 Security

- Never commit sensitive data
- Use environment variables for secrets
- Follow OWASP security best practices
- Report security issues privately

## 📞 Questions?

- Open a GitHub Discussion
- Check existing issues and PRs
- Read the documentation

## 🙏 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on what's best for the community

## ⚖️ License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.

---

Thank you for contributing to Product Discovery Hub! 🚀
