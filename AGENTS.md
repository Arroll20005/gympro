# AGENTS.md

## Overview
This file provides guidelines for agentic coding agents working in the gym-pro repository.

## Commands

### Frontend (React)
- Install dependencies: `npm install`
- Start development server: `npm start`
- Build for production: `npm run build`
- Run tests: `npm test`
- Run a single test: `npm test -- --testNamePattern="your test pattern"` or `npm test -- --testPathPattern=path/to/test/file`
- Linting: Since there's no ESLint configuration, we rely on the default from react-scripts. However, we can run `npx eslint src` if we set up ESLint, but currently it's not configured. We'll note that.

### Backend (Django)
- Install dependencies: `pip install -r backend/requirement.txt` (note: the file is named requirement.txt, not requirements.txt)
- Run development server: `python backend/manage.py runserver`
- Run tests: `python backend/manage.py test`
- Run a single test: `python backend/manage.py test app_name.TestClass.test_method` or `python backend/manage.py test app_name.TestClass` or `python backend/manage.py test app_name`
- Linting: We don't have a linter configured, but we can use flake8 or pylint. We'll recommend setting up flake8.

## Code Style Guidelines

### Frontend (JavaScript/React)
- Imports: 
  - Group imports: 1) React and third-party libraries, 2) Internal components and hooks, 3) Styles, 4) Utilities.
  - Use absolute imports for internal components (if configured) or relative paths.
  - Prefer named imports over default imports when possible.
- Formatting:
  - Use 2 spaces for indentation (as per React standards).
  - Semicolons: Required.
  - Quotes: Use single quotes for strings, except when containing a single quote then use double quotes.
  - Line length: Maximum 100 characters.
  - Use Prettier for formatting (if set up) or follow the above.
- Types:
  - Since we're using JavaScript, we don't have static types. However, we can use PropTypes or TypeScript if migrated.
  - For now, we'll note that we should use PropTypes for component props.
- Naming Conventions:
  - Components: PascalCase (e.g., MyComponent)
  - Functions and variables: camelCase
  - Constants: UPPER_SNAKE_CASE
  - Files: 
      - Components: PascalCase (e.g., MyComponent.js)
      - Other files: camelCase (e.g., utilityFunctions.js)
- Error Handling:
  - Use try/catch for asynchronous operations.
  - For React components, use error boundaries for catching errors in the component tree.
  - Handle promise rejections in useEffect and event handlers.

### Backend (Python/Django)
- Imports:
  - Group imports: 1) Standard library, 2) Third-party packages, 3) Local applications.
  - Within each group, sort alphabetically.
  - Use absolute imports for internal modules.
- Formatting:
  - Follow PEP 8.
  - Use 4 spaces for indentation.
  - Maximum line length: 79 characters (or 88 if using Black, but we'll stick to 79 for PEP 8).
  - Use Black for formatting if set up.
- Types:
  - Use type hints as per PEP 484 and PEP 526.
  - For Django models, we don't add type hints to model fields, but we can for methods and custom properties.
- Naming Conventions:
  - Classes: PascalCase
  - Functions and variables: snake_case
  - Constants: UPPER_SNAKE_CASE
  - Modules and packages: snake_case
  - Django apps: lowercase, no underscores if possible.
  - Template files: lowercase with underscores.
- Error Handling:
  - Use try/except for catching specific exceptions.
  - In views, catch exceptions and return appropriate HTTP responses (e.g., 400, 500).
  - Use Django's built-in validation for forms and models.
  - Log errors appropriately (using logging module).

## Additional Notes
- The frontend uses Jest for testing. We recommend writing unit tests for components and hooks.
- The backend uses Django's testing framework. We recommend writing unit tests for models, views, and forms.
- When adding new dependencies, update the respective package files (package.json for frontend, requirement.txt for backend) and run the install command.

## Project-Specific Guidelines

### Frontend Structure
Based on the codebase analysis:
- Components are located in `frontend/src/components/`
- Pages are located in `frontend/src/pages/`
- Context API is used for state management (`frontend/src/context/AuthContext.js`)
- Routing is handled with React Router v6 (`react-router-dom`)
- Testing is configured with React Testing Library and Jest

### Backend Structure
Based on the codebase analysis:
- Django project structure with apps in `backend/apps/`
- Main configuration in `backend/config/`
- Apps include: accounts, classes, reservations
- API endpoints are defined in each app's `urls.py` file
- Authentication uses JWT tokens (djangorestframework-simplejwt)
- CORS headers are configured (django-cors-headers)

### Specific Code Examples from Analysis

#### Frontend Import Style (from App.js)
```javascript
// Group 1: React and third-party libraries
import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

// Group 2: Internal components and hooks
import {
  AuthProvider,
  AuthContext
} from './context/AuthContext';

// Group 3: Internal components (pages)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
// ... etc
```

#### Backend Import Style (from config/urls.py)
```python
# Standard library imports (none in this file)
# Third-party packages
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)

# Local applications (none in this file, but would be like: from myapp import views)
```

#### Component Naming Convention
- Components use PascalCase: `ProtectedRoute`, `AppRoutes`, `App`
- Functions use camelCase: `ProtectedRoute` (component), `AppRoutes` (function)
- Constants would use UPPER_SNAKE_CASE (none visible in sampled files)

#### Error Handling Patterns
- Frontend: Conditional rendering based on loading state in `ProtectedRoute`
- Backend: Django's built-in exception handling through middleware and views

### Testing Guidelines

#### Frontend Testing
- Test files follow naming convention: `[ComponentName].test.js`
- Example: `App.test.js` tests the `App.js` component
- Uses React Testing Library and Jest
- To run a specific test: `npm test -- --testNamePattern="test description"`

#### Backend Testing
- Test files are located in each app: `apps/[app_name]/tests.py`
- Uses Django's TestCase class
- To run a specific test: `python backend/manage.py test apps.accounts.Tests.test_method_name`

### Dependency Management
- Frontend: Update `frontend/package.json` and run `npm install`
- Backend: Update `backend/requirement.txt` and run `pip install -r backend/requirement.txt`
- Note: The backend requirements file uses an unconventional name (`requirement.txt` instead of `requirements.txt`)

### Development Workflow
1. For frontend changes: Start with `npm start` in the frontend directory
2. For backend changes: Start with `python backend/manage.py runserver` in the backend directory
3. Always write tests for new functionality
4. Follow existing code style guidelines when modifying files
5. Run linters/tests before submitting changes


## External Skills

- UI/UX Skill: see agents/ui-ux-skill.md

## User-Rules

-Rules: agents/story-user.md