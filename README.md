# Boon frontend application

## Setup

The project requires the following tools:

* [Node](https://nodejs.org/en/)
* [Yarn](https://yarnpkg.com)
* [psc-package](https://github.com/purescript/psc-package/releases)
* [Running backend application](https://git.ringseven.com/paul/marketing-automation-backend)

1. Fetch dependencies:

   ```bash
   yarn install
   npm install -g pulp bower
   ```

1. Start the application locally:

   ```bash
   yarn run serve
   ```

   Note that this command will run the application with code reloading for development purposes.

## Development

Make sure to run tests and static analysis before making a commit. You can perform all checks with the following command:

```bash
yarn run check
```

### Automatic code formatting

We use [prettier](https://prettier.io/) to automatically format all
TypeScript and SCSS code. To run it:

`yarn run format`

You should either:

* [configure your editor](https://prettier.io/docs/en/editors.html) to
  format each file on save, or
* [setup a pre-commit hook](https://prettier.io/docs/en/precommit.html).

### Automated testing

To run automated tests do:

`yarn run test`

The process will stay open and rerun tests as needed when code is changed.

Additionally, each test run will produce a coverage report. Open
`coverage/index.html` in your browser to view it.

You can read about writing unit tests at https://angular.io/guide/testing
To make the process easier we have some custom test helpers available in
`test/support/helpers.ts` module.

### Code linting

To run TSLint on the whole project do:

`yarn run lint`

Linter is also run automatically by Ionic during `serve` and `build`, but that
skips checks of the test code, so make sure to run the task manually before
committing.

## Code guidelines

### Organization rules

Most application code lives in `src/app/` directory. All files except `main.ts`
and `*.module.ts` files should be organized into subdirectories.

Each directory under `app/` should have a corresponding Angular module
(`@NgModule`) defined in a file called `MODULE_NAME.module.ts`. For example,
for the `app/core/` directory there will be `app/core.module.ts` file
containing `@NgModule` definition for a class named `CoreModule`.

Each directory/module under `app/` should represent a cohesive part of the
application. There will be modules representing particular web pages,
as well as more "utility" modules that act as a base for higher-level
modules. The idea is to allow for code reuse while still maintaing a clear
picture of the application architecture. In other words, by looking at
the names of directories in `app/` it should be easy to figure out what
the application does and what parts it consists of.

File names should all be lower-case with words separated with a dash (`-`).
Additionally, files should be named with a suffix representing their type:
"module", "component", "page", "service", etc. For example `login.page.ts`
is a valid name, while `Login.ts` is not.

TypeScript classes inside those files should be named using CamelCase and have
the approriate suffix corresponding to the suffix in the file name. For example
`AuthService` is a valid class name, while `Auth` is not.

Top-level pages should be defined using `@IonicPage`. Even though they are
not going to be referenced in templates directly they should have `selector`
defined. This way the template contents will be embedded in the right element
and SCSS can be scoped the same way as in other components. All page-related
files should have additional `.page` suffix. Additionally, Ionic requires
a separate module file for all pages. Overall, each page will have four
associated files:

* component code: `NAME.page.ts`
* module boilerplate: `NAME.page.module.ts`
* template: `NAME.page.pug`
* styles: `NAME.page.scss`

### Style rules

Use `RxJS` for implementing services, even those that don't use `HttpClient`.
That will make them easier to combine. Overall, prefer a declarative functional
style that `RxJS` enables to an imperative programming style that utilizes
assignment. Our TSLint rules should guide you in the right direction.

### SCSS development rules

Use SCSS syntax exlusively. Don't use Sass or plain CSS.

Make sure to use SCSS features like variables and mixins where applicable.

Use [flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) when
implementing UI designs. Never use floats.

Each styled component should have a corresponding `.scss` file with
the component selector as the top-level SCSS rule. For example,
`login-page.component.ts` should have `login-page.scss` file with
`login-page { ... }` as its contents.

Never write global selectors that will apply to all elements on a page. That
applies to both standard HTML elements (`input`, `p`, etc.) as well as elements
and classes coming from 3rd-party libraries (`.card`, `ion-header`, etc.)
Instead, each style should be specific to a given component.

Do not use shared classes directly in HTML when that element already has
a class or needs additional styling:

```html
<!-- bad -->
<div class="center padding-left">
</div>
```

Instead, give the element a new class name and extend the shared classes:

```html
<!-- good -->
<div class="main-content">
</div>
```

```scss
.main-content {
  @extend .center;
  @extend .padding-left;
}
```

In other words, use only a single class per element and combine styles when
needed in SCSS files.

Use descriptive semantic names for SCSS classes. For example `.red-button` and
`.header` would be bad names, while `.warning-button` and `.user-profile-header`
would be good.

Name SCSS variables similarly, e.g instead of `$green` call it `$color-primary`.

Use `@import` to only pull definitions that you use in a particular file.

Do not use `!important` as it makes overriding and reusing styles hard.

All shared SCSS files should be stored in `src/theme/` directory. It has been
prepopulated with four files, that import parts of them from subdirectories,
described below.

1. Use only media queries defined in `mixins.scss`. They use the same sizing
   system as Ionic Grid, so will work well with Ionic components. You can extend
   that file with your own mixins that will be used throughout the app.

2. Similarly, `shared-classes.scss` file contains classes that are commonly used
   throughout the app.

3. `style-guide.scss` contains SCSS variables that outline the theming of the app.
   Please add variables here when they are to be used in more than one place.

4. Finally, `variables.scss` should only be used to override Ionic framework
   variables.

## Workflow

### When starting a new ticket on issue tracker

1. Make sure that it is placed in the To Do column.
1. Check if it is not blocked by another task using issue links.
1. Check relevant tickets using issue links to get a better context.
1. Assign ticket to yourself and move it to Doing column.
1. Don’t reserve tickets in advance unless you have to.

### When working on the implementation

1. Work on a new branch. It is a good idea to use some naming schema (like `[id]/[description]`: `MA-11/implement-login-page`) but it is up to you.
1. Follow guidelines from the project’s documentation.
1. Do not merge other branches into yours - use `git rebase` instead.
1. When working on the new feature, add tests.
1. When working on a bug fix, add a test for a given use-case.

### Before submitting merge request

1. Make sure that tests and static analysis pass.
1. Make sure that your branch is up-to-date with the base one (use `git rebase` if not and resolve conflicts if necessary).
1. If you have used WIP, FIXUPs or any other „dirty” commits, make sure to rebase them and add a proper message to each.
1. Follow [guidelines for writing commit messages](https://gist.github.com/smt116/df307ad726f69b40f205b0ac68badc96).

### After submitting merge request

1. Move ticket to the Code Review column on the issue tracker.
1. Wait for the code review from team members.
1. Apply changes if necessary (you can add them as FIXUP commits to make the code review easier) and ping someone that the code is ready for another iteration.
1. When the code is ready to merge, make sure to resolve WIP status, rebase FIXUP commits (if any) and rebase with the base branch (resolve conflicts if any).

## Deployments

The application is deployed as static files for [the backend](https://git.ringseven.com/paul/marketing-automation-backend). These static files are built using `beta` and `production` branches. Each Monday, the following procedure needs to be performed:

1. `git checkout master`
1. `git pull`
1. `git checkout production`
1. `git merge beta`
1. `git push origin production`
1. `git checkout beta`
1. `git merge master`
1. `git push origin beta`
1. Notify #boon Slack channel that branches have been updated.
