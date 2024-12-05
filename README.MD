# AidMi

This [Refine](https://github.com/refinedev/refine) project was generated with [create refine-app](https://github.com/refinedev/refine/tree/master/packages/create-refine-app).

## Set Up

### Environment variables

Create a `.env` file in the root of your project and add the following environment variables:

``` text
VITE_BACKEND_URL=<supabase host>
VITE_SUPABASE_ANON_KEY=<supabase anon key>
VITE_AI_SERVICE_URL_PROXY=<ai server proxy url>
```

### Running the development server

```bash
    npm run dev
```

### Building for production

```bash
    npm run build
```

### Running the production server

```bash
    npm run start
```

## Project Structure

The project structure is like so:

``` bash
├───src
│   ├───assets
│   │   ├───fonts
│   │   └───images
│   ├───components
│   │   └───...
│   ├───hooks
│   ├───layouts
│   │   ├───admin-layout
│   │   └───...
│   ├───models
│   ├───pages
│   │   ├───login
│   │   ├───patients
│   │   │   └───components
│   │   └───...
│   ├───providers
│   │   └───...
│   ├───styles
│   ├───typings
│   └───utils
└───supabase
    └───functions
        └───http-proxy
```

1. **assets** -  all static assets (fonts, images, etc.)
2. **components** - reusable UI components
3. **hooks** - custom React hooks
4. **layouts** - reusable page layouts
5. **models** - data models
6. **pages** - application pages
    - **components**  - page-specific components
7. **providers** - data providers (e.g. Supabase)
8. **styles** - global styles
9. **typings** - type definitions
10. **utils** - utility functions
11. **supabase** - Supabase edge functions

## Tools Used

| Tool | Description |
| --- | --- |
| React | A JavaScript library for building user interfaces |
| Refine | A React Framework for building internal tools, admin panels, dashboards & B2B apps |
| Supabase | A PostgreSQL database with a RESTful API and real-time capabilities |

### Refine

A React Framework for building internal tools, admin panels, dashboards & B2B apps with unmatched flexibility ✨

Refine's hooks and components simplifies the development process and eliminates the repetitive tasks by providing industry-standard solutions for crucial aspects of a project, including authentication, access control, routing, networking, state management, and i18n.

## Supabase

Supabase is a PostgreSQL database with a RESTful API and real-time capabilities. It's an alternative to Firebase and other backend-as-a-service platforms.

### Supabase Features

- PostgreSQL Database
- RESTful API
- Real-time Capabilities
- Authentication
- Authorization
- File Storage
- Edge Functions

## Learn More

To learn more about **Refine**, please check out the [Documentation](https://refine.dev/docs)

- **REST Data Provider** [Docs](https://refine.dev/docs/core/providers/data-provider/#overview)
- **Ant Design** [Docs](https://refine.dev/docs/ui-frameworks/antd/tutorial/)
- **React Router** [Docs](https://refine.dev/docs/core/providers/router-provider/)
- **Custom Auth Provider** [Docs](https://refine.dev/docs/core/providers/auth-provider/)
