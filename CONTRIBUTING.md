# Contributing
When contributing to this repository, please first discuss the change you wish to make via an issue, an email, or any other method with the owners of this repository before making a change.
> [!NOTE]
> If you want to contribute, please also take a look at the [Requirements file](./ERD_and_Implementation/Requirements.todo) and afterward, make an issue detailing what feature do you want to develop. Help is always appreciated! :)

## Development
This project is an offline-first based app which means you can easily run and use the application with a few commands:

1. Clone the project by using:
```bash
git clone https://github.com/ssanjose/transact.git
# or
git clone (your-forked-repo)
```

2. Go to the directory and run the development server:

> [!NOTE]
> Go into the folder with `cd ./transact`

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Commit Convention
Before you create a Pull Request, please check whether your commits comply with the commit conventions used in this repository.

When you create a commit we kindly ask you to follow the convention category: message in your commit message while using one of the following categories:
- `feat / feature`: all changes that introduce completely new code or new features
- `fix`: changes that fix a bug (ideally you will additionally reference an issue if present)
- `refactor`: any code related change that is not a fix nor a feature
- `docs`: changing existing or creating new documentation (i.e. README)
- `build`: all changes regarding the build of the software, changes to dependencies or the addition of new dependencies
- `test`: all changes regarding tests (adding new tests or changing existing ones)
- `ci`: all changes regarding the configuration of continuous integration (i.e. github workflows)
- `chore`: all changes to the repository that do not fit into any of the above categories
  e.g. `feat: pass complex calculation to web worker`

If you are interested in the detailed specification you can visit https://www.conventionalcommits.org/.

## Testing
Before submitting a PR:
1. Write tests for new features
2. Run existing tests: `npm test`
3. Ensure all tests pass
4. Follow test conventions in `docs/conventions/testing.md`
