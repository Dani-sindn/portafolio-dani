# Workflow

This document outlines the recommended workflow for developing and contributing to the project.

## Git Workflow

1.  **Pull Latest Changes**: Always start by pulling the latest changes from the main branch.
    ```bash
    git checkout main
    git pull origin main
    ```

2.  **Create a Branch**: Create a new branch for your feature or fix.
    ```bash
    git checkout -b feature/my-new-feature
    ```
    *Naming convention*: `feature/name`, `fix/issue`, `docs/update`.

3.  **Make Changes**: Edit the code and test your changes locally.

4.  **Commit**: Commit your changes with clear, descriptive messages.
    ```bash
    git add .
    git commit -m "feat: add new hero section"
    ```
    *We recommend using [Conventional Commits](https://www.conventionalcommits.org/).*

5.  **Push**: Push your branch to the remote repository.
    ```bash
    git push origin feature/my-new-feature
    ```

6.  **Merge**: Open a Pull Request (PR) or merge your branch into `main` after review.

## Deployment

This project is optimized for deployment on platforms like **Vercel** or **Netlify**.

### Vercel (Recommended)
1.  Connect your GitHub repository to Vercel.
2.  Vercel will automatically detect the Vite settings.
3.  Every push to `main` will trigger a production deployment.
4.  Pull requests will generate preview deployments.

## Continuous Improvement
- Keep the documentation updated as you add new features.
- Refactor code as you go to keep technical debt low.
