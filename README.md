# Jobsomely

This project was bootstrapped with [bootstrap@5.2.0](https://getbootstrap.com/docs/5.2/getting-started/introduction/).

## Description

This app is an employment website for job listings.

### User Stories

-  **404:** As an anon/user I can see a 404 page if I try to reach a page that does not exist so that I know it's my fault
-  **Signup:** As an anon I can sign up in the platform so that I can start creating and managing my account
-  **Login:** As a user I can login to the platform so that I can start creating and managing my backlog
-  **Logout:** As a user I can logout from the platform so no one else can modify my information
-  **Apply to jobs** As a candidate I can apply to advertised jobs
-  **Add jobs** As a company I can add jobs to jobs listings
-  **Delete jobs** As a company I can delete jobs from jobs listings
-  **Check profile** As a user I can check companies and candidates profiles

### Backlog

- Upload image file

## Client

### Routes

- / - Homepage
- /signup - Signup form
- /login - Login form
- /jobs - jobs list
- /jobs/:jobId - job details
- /companies - companies list
- /companies/:companyId - company details
- /candidates - candidates list
- /candidates/:candidateId - candidate details
- /myprofile - my details
- /mycompany - my company details
- /jobs/create - create job
- /job/edit/:jobId - job edit/
- 404

### Pages

- Home Page (public)
- Sign in Page (anon only)
- Log in Page (anon only)
- Jobs List Page (private only)
- Candidates List Page (private only)
- Companies List Page (private only)
- Job Create (company only)
- Job Detail Page (private only)
- Candidate Detail Page (private only)
- Company Detail Page (private only)
- My Profile Page (private only)
- 404 Page (public)

## Server / Backend

### Models

User model

```javascript
{
    email: {
      type: String,
      required: [true, "Email is required."],
      match: [/^\S+@\S+\.\S+$/, "Please use a valid e-mail address."],
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      match: [/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}/],
    },
    name: {
      type: String,
      unique: true,
      required: [true, "You need to have a username"],
    },
    userType: {
      type: String,
      enum: ['candidate', 'company', 'admin'],
      default: 'candidate',
      required: true
    },
    candidate: {
      type: Schema.Types.ObjectId,
      ref: 'Candidate'
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company'
    }
  }
```

Job model

```javascript
 {
        title: {
            type: String,
            required: true,
            trim: true
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        skills: {
            type: String,
            required: true,
            trim: true
        },
        level: {
            type: String,
            required: true,
            trim: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        location: {
            type: String,
            required: true,
            trim: true
        },
        applicants: [{
            type: Schema.Types.ObjectId,
            ref: 'Candidate'
        }]
    }
```

Company model

```javascript
 {
        name: {
            type: String,
            required: true,
            trim: true
        },
        jobs: [{
            type: Schema.Types.ObjectId,
            ref: 'Job'
        }],
        description: {
            type: String,
            required: true,
            trim: true
        },
        address: {
            type: String
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    }
```

Candidate model

```javascript
 {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        role: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required."],
            match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
            trim: true,
            unique: true,
            lowercase: true
        },
        phone: {
            type: Number,
            required: true,
            trim: true
        },
        location: {
            type: String,
            required: true,
            trim: true
        },
        about: {
            type: String,
            required: true,
            trim: true
        },
        skills: {
            type: String,
            required: true,
            trim: true
        },
        imageUrl: {
            type: String
        },
        linkedin: {
            type: String,
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    }
```

### API Endpoints/Backend Routes

| HTTP Method | URL                         | Request Body                 | Success status | Error Status | Description                                                  |
| ----------- | --------------------------- | ---------------------------- | -------------- | ------------ | ------------------------------------------------------------ |
| GET         | `/verify    `           	|                 			   | 200            | 404          | Validates the request payload                                |
| POST        | `/signup`                   | {username, email, password, userType}| 200    | 404          | Checks if fields not empty (422) and user not exists (409), then create user with encrypted password, and store user in session |
| POST        | `/login`                    | {username, password}         | 200            | 401          | Checks if fields not empty (422), if user exists (404), and if password matches (404), then stores user in session    |
| POST        | `/upload`                 	|	   						   |                | 400          | Uploads image files                                          |
| GET         | `/candidates`               |                              |                | 400          | Show candidates list                                         |
| POST        | `/candidates`               | {firstName, lastName, role, email, phone, location, about, skills, imageUrl, linkedin, owner} | | | Create candidate profile|
| GET         | `/candidates/:candidateId`  |                              |                |              | Show candidate details                                       |
| PUT         | `/candidates/:candidateId`  |                              | 201            | 400          | Updates the candidate details                                |
| DELETE      | `/candidates/:candidateId`  |                              | 201            | 400          | delete element                                               |
| GET         | `/myprofile`                | {firstName, lastName, role, email, phone, location, about, skills, imageUrl, linkedin, owner}|               | 400          | Show current user profile |
| GET         | `/companies`                |                              |                |              | Show companies list                                          |
| POST        | `/companies`               	| {name, jobs, description, address, owner}|    |              | Creates company elements                                     |
| GET         | `/companies/:companyId`     |                              |                | 400          | Show company details                                         |
| PUT         | `/companies/:companyId`     |                              | 201            | 400          | Updates the company details                                  |
| DELETE      | `/companies/:companyId`     |                              | 201            | 400          | delete element                                               |
| GET         | `/myprofile`                | {name, jobs, description, address, owner}|    | 400          | Show current user company                                    |
| GET         | `/jobs`                     |                              |                |              | Show jobs list                                               |
| POST        | `/jobs`                 	| {title, description, skills, level, location, owner}|  |     | Creates job elements                                         |
| GET         | `/jobs/:jobId`              |                              |                | 400          | Show job details                                             |
| PUT         | `/jobs/:jobId`              |                              | 201            | 400          | Updates the job details                                      |
| DELETE      | `/job/:jobId`               |                              | 201            | 400          | delete element                                               |
| GET         | `/searchjob`                |                              |                | 400          | Search job by title                                          |


## Links

### Git

The url to your repository and to your deployed project

[Client repository Link](https://github.com/alikedo/Job-somely-app/tree/main/Job-somely-app-client)

[Server repository Link](https://github.com/alikedo/Job-somely-app/tree/main/Job-somely-app-server)

[Deployed App Link](https://jobsomely.netlify.app)

### Slides

The url to your presentation slides

[Slides Link](https://docs.google.com/presentation/d/1M6Ub4YwKt31PoKETJdkIQhh2jtlLspbEk4E1lw-gDDI)
